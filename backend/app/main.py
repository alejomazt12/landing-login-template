"""FastAPI entrypoint.

Serves the session API for the landing template. Runs on port 3031; the Next.js
frontend on 3030 talks to it server-side and never exposes the token to the
browser.
"""

import logging
from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, select, text
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import engine, get_db
from app.models import User
from app.routers import auth
from app.schemas import HealthResponse
from app.security import hash_password

logger = logging.getLogger("uvicorn.error")
settings = get_settings()


def seed_admin_user() -> None:
    """Create the seed admin user if it is missing.

    The schema itself is owned by Alembic: the container runs
    `alembic upgrade head` before this, so a missing table here means the
    migrations did not run rather than something to paper over.
    """
    if not inspect(engine).has_table("users"):
        raise RuntimeError(
            "The 'users' table does not exist. Run 'alembic upgrade head' before starting the API."
        )

    with Session(engine) as db:
        email = settings.seed_admin_email.lower()
        if db.scalar(select(User).where(User.email == email)) is None:
            db.add(
                User(
                    email=email,
                    full_name="Administrator",
                    hashed_password=hash_password(settings.seed_admin_password),
                )
            )
            db.commit()
            logger.info("Seed admin user created: %s", email)


@asynccontextmanager
async def lifespan(_: FastAPI):
    if not settings.debug and settings.jwt_secret == "change-me-in-production":
        raise RuntimeError("JWT_SECRET must be set to a unique value outside debug mode")

    seed_admin_user()
    yield


app = FastAPI(
    title="Landing Login Template API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)

app.include_router(auth.router)


@app.get("/health", response_model=HealthResponse, tags=["system"])
def health(db: Session = Depends(get_db)) -> HealthResponse:
    """Liveness probe that also reports whether the database answers."""
    try:
        db.execute(text("SELECT 1"))
        database = "up"
    except Exception:  # noqa: BLE001 - the probe must never raise
        logger.exception("Database health check failed")
        database = "down"

    return HealthResponse(status="ok", database=database)

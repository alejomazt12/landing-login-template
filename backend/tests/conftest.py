"""Test fixtures.

The database URL is set before the app is imported, so the module-level engine
in app.database binds to a throwaway SQLite file instead of Postgres.
"""

import os
import tempfile
from collections.abc import Iterator
from pathlib import Path

import pytest

DB_PATH = Path(tempfile.gettempdir()) / "landing_login_template_test.db"

os.environ["DATABASE_URL"] = f"sqlite+pysqlite:///{DB_PATH}"
os.environ["JWT_SECRET"] = "test-secret"
os.environ["SEED_ADMIN_EMAIL"] = "admin@example.com"
os.environ["SEED_ADMIN_PASSWORD"] = "admin1234"

from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

BACKEND_ROOT = Path(__file__).resolve().parent.parent


def alembic_config() -> Config:
    config = Config(str(BACKEND_ROOT / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_ROOT / "migrations"))
    return config


@pytest.fixture(scope="session")
def client() -> Iterator[TestClient]:
    DB_PATH.unlink(missing_ok=True)

    # Building the schema through Alembic rather than create_all means every
    # test run also proves the migrations apply cleanly from scratch.
    command.upgrade(alembic_config(), "head")

    with TestClient(app) as test_client:
        yield test_client

    DB_PATH.unlink(missing_ok=True)

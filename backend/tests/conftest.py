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

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402


@pytest.fixture(scope="session")
def client() -> Iterator[TestClient]:
    DB_PATH.unlink(missing_ok=True)
    with TestClient(app) as test_client:
        yield test_client
    DB_PATH.unlink(missing_ok=True)

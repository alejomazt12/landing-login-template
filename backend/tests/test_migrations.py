"""Migrations must build the schema the models expect, and undo it cleanly."""

from pathlib import Path

import pytest
from alembic import command
from sqlalchemy import create_engine, inspect

from tests.conftest import alembic_config


@pytest.fixture
def scratch_db(tmp_path: Path, monkeypatch: pytest.MonkeyPatch):
    db_path = tmp_path / "migrations.db"
    url = f"sqlite+pysqlite:///{db_path}"

    config = alembic_config()
    config.set_main_option("sqlalchemy.url", url)
    # env.py reads the URL from the settings, so point those at this database.
    monkeypatch.setenv("DATABASE_URL", url)

    from app.config import get_settings

    get_settings.cache_clear()
    yield config, url
    get_settings.cache_clear()


def test_upgrade_creates_the_users_table(scratch_db) -> None:
    config, url = scratch_db

    command.upgrade(config, "head")

    inspector = inspect(create_engine(url))
    assert "users" in inspector.get_table_names()

    columns = {column["name"] for column in inspector.get_columns("users")}
    assert columns == {
        "id",
        "email",
        "full_name",
        "hashed_password",
        "is_active",
        "created_at",
    }


def test_email_is_indexed_and_unique(scratch_db) -> None:
    config, url = scratch_db

    command.upgrade(config, "head")

    indexes = inspect(create_engine(url)).get_indexes("users")
    email_index = next(index for index in indexes if index["column_names"] == ["email"])
    # SQLite reports 1 where Postgres reports True, so compare truthiness.
    assert email_index["unique"]


def test_downgrade_removes_the_table(scratch_db) -> None:
    config, url = scratch_db

    command.upgrade(config, "head")
    command.downgrade(config, "base")

    assert "users" not in inspect(create_engine(url)).get_table_names()

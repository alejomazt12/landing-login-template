"""Application settings, loaded from environment variables."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "postgresql+psycopg://template:template@localhost:5432/template"

    # Override in every real deployment. The app refuses to start with the
    # default value when debug is off (see main.py).
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"

    # How long a session stays valid. Drives both the JWT expiry and the
    # cookie's Max-Age, so the two can never drift apart.
    # Defaults to 7 days; override with SESSION_TTL_MINUTES.
    session_ttl_minutes: int = 60 * 24 * 7

    # Seed account created on first boot so the template is usable right away.
    seed_admin_email: str = "admin@example.com"
    seed_admin_password: str = "admin1234"

    cors_origins: str = "http://localhost:3030"
    debug: bool = True

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Scholarship Management Backend"
    database_url: str = f"sqlite:///{(Path(__file__).resolve().parents[2] / 'app.db')}"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    admin_email: str = "admin@example.com"
    admin_password: str = "admin123"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


settings = Settings()

if settings.database_url.startswith("sqlite:///./"):
    relative_path = settings.database_url.replace("sqlite:///./", "", 1)
    absolute_path = Path(__file__).resolve().parents[2] / relative_path
    settings.database_url = f"sqlite:///{absolute_path}"

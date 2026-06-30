from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "TalentFusion AI"
    version: str = "1.0.0"
    debug: bool = False
    database_url: str = "postgresql://postgres:postgres@db:5432/talentfusion"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    class Config:
        env_file = ".env"


settings = Settings()

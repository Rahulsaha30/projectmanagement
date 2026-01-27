from pydantic_settings import BaseSettings

class Config(BaseSettings):
    DataBase_URL: str = "sqlite:///./intern_proj_manage.db.sqlite3"
    SECRET_KEY: str = "Cv_6-_3N9jMA7PzQ_u052WbUF1iKSkkS7XpFDzoIPNw"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRY_MIN: int = 30
    REFRESH_TOKEN_EXPIRY_DAYS: int = 365

    # class Config:
    #     env_file = ".env"
config = Config()

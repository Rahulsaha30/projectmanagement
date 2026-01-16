from pydantic_settings import BaseSettings

class Config(BaseSettings):
    DataBase_URL: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRY_MIN: int
    REFRESH_TOKEN_EXPIRY_DAYS: int

    class Config:
        env_file = ".env"
config = Config()

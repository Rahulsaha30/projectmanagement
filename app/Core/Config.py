from pydantic import BaseSettings

class Config(BaseSettings):
    DataBase_URL: str
    Secret_Key: str
    Algorithm: str
    Access_Token_Expire_Min: int
    Refresh_Token_Expire_Days: int

    class Config:
        env_file = ".env"
config = Config()

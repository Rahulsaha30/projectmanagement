from .Core.Config import config as settings
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

engine=create_engine(settings.DataBase_URL)
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base=declarative_base()
def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
        

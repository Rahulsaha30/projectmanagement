from passlib.context import CryptContext
from datetime import timedelta, datetime
from app.Core.Config import config as settings
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.DataBase import get_db
from app.Model.EmployeeModel import EmployeeModel

pwd_context=CryptContext(schemes=["bcrypt"],deprecated="auto")

def hash_password(password:str):
    return pwd_context.hash(password)

def verify_password(plain_password,strhashed_password:str):
    return pwd_context.verify(plain_password,strhashed_password)




# --- ACCESS TOKEN ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY_MIN)
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded


# --- REFRESH TOKEN ---
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRY_DAYS)
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, settings.SECRET_KEY + "_refresh", algorithm=settings.ALGORITHM)
    return encoded


# --- VERIFY FUNCTIONS ---
def verify_access_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None


def verify_refresh_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY + "_refresh", algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None



oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        emp_id: int = payload.get("sub")
        if emp_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()

    if user is None or not user.is_active:
        raise credentials_exception

    return user

from passlib.context import CryptContext
from datetime import timedelta, datetime, timezone
from app.Core.Config import config as settings
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.DataBase import get_db
from app.Model.EmployeeModel import EmployeeModel
import bcrypt
import re

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))


# --- ACCESS TOKEN ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRY_MIN)
    to_encode.update({"exp": expire})
    encoded = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded


# --- REFRESH TOKEN ---
def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=settings.REFRESH_TOKEN_EXPIRY_DAYS)
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

# def get_current_user(
#     token: str = Depends(oauth2_scheme),
#     db: Session = Depends(get_db)
# ):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"Authorization": "Bearer"},
#     )

#     try:
#         print("\n\n DECODING TOKEN RECEIVED FROM FRONTEND...\n", token, "\n\n")

#         payload = jwt.decode(
#             token,
#             settings.SECRET_KEY,
#             algorithms=[settings.ALGORITHM]
#         )

#         print("PAYLOAD:\n", payload, "\n\n")
        
#         emp_id: str = payload.get("sub")
#         if emp_id is None:
#             print("ERROR: emp_id is None in payload")
#             raise credentials_exception

#     except JWTError as e:
#         print(f"JWT ERROR: {str(e)}")
#         raise credentials_exception
#     except Exception as e:
#         print(f"UNEXPECTED ERROR: {str(e)}")
#         raise credentials_exception

#     user = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()

#     if user is None or not user.is_active:
#         print(f"USER LOOKUP FAILED: emp_id={emp_id}, user={user}, is_active={user.is_active if user else 'N/A'}")
#         raise credentials_exception

#     return user

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
        print("\n\n DECODING TOKEN RECEIVED FROM FRONTEND...\n", token, "\n\n")

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        print("\nPAYLOAD:\n", payload, "\n\n")
        # print("\nemp_ID:\n", payload.get("sub").get("emp_id"), "\n\n")

        # emp_id = dict(payload.get("sub")).get("emp_id")
        # emp_id = int(payload.get("sub").get("emp_id"))
        # emp_id = re.search(r"'emp_id'\s*:\s*'(\d+)'", str(payload.get("sub")))
        emp_id = payload.get("emp_id")
        print("\nEMP_ID MATCH OBJECT:\n", emp_id, "\n\n")

        if emp_id is None:
            raise credentials_exception

    except JWTError as e:
        print(f"Error decoding token: {e}")
        raise credentials_exception

    # user = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()

    # if user is None or not user.is_active:
    #     raise credentials_exception

    return payload



# repository pattern implementation in the dotnet project is one of the best practices
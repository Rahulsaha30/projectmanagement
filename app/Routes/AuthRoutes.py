from fastapi.security import OAuth2PasswordRequestForm
from app.Core.Security import verify_password
from app.Core.Security import create_access_token, create_refresh_token, verify_refresh_token
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.DataBase import get_db
from app.Core.Config import config as settings

from app.Model.EmployeeModel import EmployeeModel


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(EmployeeModel).filter(
        EmployeeModel.email == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": user.emp_id})
    refresh_token = create_refresh_token({"sub": user.emp_id})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/refresh")
def refresh_access_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    payload = verify_refresh_token(refresh_token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    emp_id: int = payload.get("sub")


    user = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()

    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")

    new_access_token = craete_access_token({"sub": user.emp_id})

    return {"access_token": new_access_token, "token_type": "bearer"}


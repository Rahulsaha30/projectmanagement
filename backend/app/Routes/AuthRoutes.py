# from app.Core.Security import verify_password, hash_password
# from app.Core.Security import create_access_token, create_refresh_token, verify_refresh_token
# from fastapi import APIRouter, Depends, HTTPException, status
# from jose import jwt, JWTError
# import re
# from app.Model.EmployeeModel import EmployeeModel
# from app.Model.Role import RoleEnum
# from pydantic import BaseModel
# from app.Core.Config import config as settings

from fastapi.security import OAuth2PasswordRequestForm
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.DataBase import get_db
from backend.app.Core.Logger import setup_logging
from backend.app.View.AuthSchemas import SignupRequest, ForgotPasswordRequest
from backend.app.Controllers.AuthController import loginUser, signupUser, forgetPasswordUser, refreshAccessToken

logger = setup_logging()

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):
    return signupUser(request, db, logger)

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
   return loginUser(form_data, db, logger)

@router.put("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    return forgetPasswordUser(request, db, logger)


@router.post("/refresh")
def refresh_access_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    return refreshAccessToken(refresh_token, db, logger)


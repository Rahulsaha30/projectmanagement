from fastapi.security import OAuth2PasswordRequestForm
from app.Core.Security import verify_password, hash_password
from app.Core.Security import create_access_token, create_refresh_token, verify_refresh_token
from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from pydantic import BaseModel
import re

from app.DataBase import get_db
from app.Core.Config import config as settings
from app.Core.Logger import setup_logging

from app.Model.EmployeeModel import EmployeeModel
from app.Model.Role import RoleEnum

logger = setup_logging()

class SignupRequest(BaseModel):
    emp_name: str
    email: str
    password: str
    role: RoleEnum
    pin: str

class ForgotPasswordRequest(BaseModel):
    email: str
    pin: str
    new_password: str

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/signup")
def signup(
    request: SignupRequest,
    db: Session = Depends(get_db)
):
    logger.info(f"Signup attempt for email: {request.email}")
    
    # Validate email format
    if not request.email.endswith('@gyansys.com'):
        logger.warning(f"Signup failed: Invalid email format: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email must be in @gyansys.com format"
        )
    
    # Validate name format (Name.Title)
    if not re.match(r'^[A-Za-z]+\.[A-Za-z]+$', request.emp_name):
        logger.warning(f"Signup failed: Invalid name format: {request.emp_name}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name must be in 'First.Last' format (e.g., John.Doe)"
        )
    
    # Validate password strength
    if not re.match(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$', request.password):
        logger.warning(f"Signup failed: Weak password for {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters with letters, digits, and special characters"
        )
    
    # Check PIN for role
    role_pins = {
        RoleEnum.admin: "adm789",
        RoleEnum.manager: "mgr456",
        RoleEnum.employee: "emp123"
    }
    if request.pin != role_pins.get(request.role):
        logger.warning(f"Signup failed: Invalid PIN for role {request.role}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PIN for the selected role"
        )
    
    # Check if email already exists
    existing_user = db.query(EmployeeModel).filter(EmployeeModel.email == request.email).first()
    if existing_user:
        logger.warning(f"Signup failed: Email already exists: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash the password
    hashed_password = hash_password(request.password)
    
    # Create new user
    new_user = EmployeeModel(
        emp_name=request.emp_name,
        email=request.email,
        hashed_password=hashed_password,
        role=request.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"Successful signup for user: {request.email}")
    return {"message": "User created successfully", "emp_id": new_user.emp_id}

@router.put("/forgot-password")
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    logger.info(f"Forgot password attempt for email: {request.email}")
    
    user = db.query(EmployeeModel).filter(EmployeeModel.email == request.email).first()
    if not user:
        logger.warning(f"Forgot password failed: Email not found: {request.email}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Email not found"
        )
    
    # Check PIN
    role_pins = {
        RoleEnum.admin: "adm789",
        RoleEnum.manager: "mgr456",
        RoleEnum.employee: "emp123"
    }
    if request.pin != role_pins.get(user.role):
        logger.warning(f"Forgot password failed: Invalid PIN for {request.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid PIN"
        )
    
    # Hash new password
    hashed_password = hash_password(request.new_password)
    user.hashed_password = hashed_password
    
    db.commit()
    
    logger.info(f"Password reset successful for user: {request.email}")
    return {"message": "Password reset successfully"}

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    logger.info(f"Login attempt for user: {form_data.username}")
    user = db.query(EmployeeModel).filter(
        EmployeeModel.email == form_data.username
    ).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        logger.warning(f"Failed login attempt for user: {form_data.username}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = create_access_token({"sub": user.emp_id})
    refresh_token = create_refresh_token({"sub": user.emp_id})
    logger.info(f"Successful login for user: {form_data.username}")
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

    new_access_token = create_access_token({"sub": user.emp_id})

    return {"access_token": new_access_token, "token_type": "bearer"}


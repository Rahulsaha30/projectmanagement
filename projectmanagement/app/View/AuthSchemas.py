from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.Model.Role import RoleEnum

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
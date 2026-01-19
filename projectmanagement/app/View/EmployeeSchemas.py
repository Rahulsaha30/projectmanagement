from pydantic import BaseModel
from typing import Optional
# from datetime import datetime
from app.Model.Role import RoleEnum

class EmployeeResponse(BaseModel):
    emp_id: int
    emp_name: str
    email: str
    role: str
    billable_work_hours: int
    skills: Optional[str]
    experience: Optional[int]
    dept: Optional[str]
    is_active: bool

class EmployeeCreate(BaseModel):
    emp_name: str
    email: str
    password: str
    role: RoleEnum
    billable_work_hours: Optional[int] = 0
    skills: Optional[str] = None
    experience: Optional[int] = None
    dept: Optional[str] = None

class EmployeeUpdate(BaseModel):
    emp_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[RoleEnum] = None
    billable_work_hours: Optional[int] = None
    skills: Optional[str] = None
    experience: Optional[int] = None
    dept: Optional[str] = None

class EmployeeResponse(BaseModel):
    emp_id: int
    emp_name: str
    email: str
    role: str
    billable_work_hours: int
    skills: Optional[str]
    experience: Optional[int]
    dept: Optional[str]
    is_active: bool

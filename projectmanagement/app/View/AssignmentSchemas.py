from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
# from app.Model.Role import RoleEnum

class AssignmentCreate(BaseModel):
    emp_id: int
    project_id: int
    allotted_hours: int

class AssignmentResponse(BaseModel):
    assign_id: int
    emp_id: int
    project_id: int
    assigned_at: datetime
    allotted_hours: int
    emp_name: str
    project_name: str

class AssignmentUpdate(BaseModel):
    allotted_hours: Optional[int] = None

class AssignmentResponse(BaseModel):
    assign_id: int
    emp_id: int
    project_id: int
    assigned_at: datetime
    allotted_hours: int
    emp_name: str
    project_name: str
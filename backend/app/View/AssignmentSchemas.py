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
    is_completed: bool = False
    completed_at: Optional[datetime] = None
    hours_worked: int = 0
    completion_notes: Optional[str] = None

class AssignmentUpdate(BaseModel):
    allotted_hours: Optional[int] = None

class TaskCompletionCreate(BaseModel):
    assign_id: int
    hours_worked: int
    completion_notes: Optional[str] = None

class TaskCompletionResponse(BaseModel):
    assign_id: int
    emp_id: int
    project_id: int
    emp_name: str
    project_name: str
    assigned_at: datetime
    completed_at: datetime
    allotted_hours: int
    hours_worked: int
    completion_notes: Optional[str] = None
from pydantic import BaseModel
from backend.app.Model.Role import RoleEnum
from pydantic import EmailStr
from typing import Optional
 
class JwtPayload(BaseModel):
    emp_id: str
    role: RoleEnum
    email: EmailStr
    is_active: bool
    experience: int
    billable_work_hours: int
    dept: Optional[str] = None 
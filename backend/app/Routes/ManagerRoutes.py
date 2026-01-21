from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from backend.app.DataBase import get_db
from backend.app.Core.Security import get_current_user
from backend.app.Controllers.ManagerController import (
    create_employee, list_employees, get_employee, update_employee, toggle_employee_status,
    search_employees_by_skills,
    EmployeeCreateByManager, EmployeeUpdate, EmployeeResponse
)
from backend.app.Model.EmployeeModel import EmployeeModel

router = APIRouter(prefix="/api/manager", tags=["Manager"])

# Employee endpoints
@router.post("/employees", response_model=EmployeeResponse)
def add_employee(
    employee: EmployeeCreateByManager,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    Add a new employee. Role is automatically set to 'employee'.
    Available to: Manager, Admin
    """
    return create_employee(db, employee, current_user)

@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return list_employees(db, None, None, current_user)

@router.get("/employees/search/by-skills", response_model=List[EmployeeResponse])
def search_employees_by_skill_set(
    skills: str = Query(..., description="Comma-separated skills (e.g., 'Python,FastAPI,SQL')"),
    min_experience: Optional[int] = Query(None, description="Minimum years of experience"),
    include_assigned: bool = Query(False, description="Include already assigned employees"),
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    Search for employees based on skill set requirements.
    Managers can use this to find suitable employees for their projects.
    """
    return search_employees_by_skills(db, skills, current_user, min_experience, include_assigned)

@router.get("/employees/{emp_id}", response_model=EmployeeResponse)
def get_employee_info(
    emp_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return get_employee(db, emp_id, current_user)

@router.put("/employees/{emp_id}", response_model=EmployeeResponse)
def update_employee_info(
    emp_id: int,
    update: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return update_employee(db, emp_id, update, current_user)

# @router.patch("/employees/{emp_id}/toggle-status")
# def toggle_employee_status_endpoint(
#     emp_id: int,
#     db: Session = Depends(get_db),
#     current_user: EmployeeModel = Depends(get_current_user)
# ):
#     return toggle_employee_status(db, emp_id, current_user)

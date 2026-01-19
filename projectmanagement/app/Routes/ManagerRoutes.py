from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.DataBase import get_db
from app.Core.Security import get_current_user
from app.Controllers.ManagerController import (
    create_employee, list_employees, get_employee, update_employee, deactivate_employee,
    create_assignment, list_assignments, update_assignment, delete_assignment,
    EmployeeCreate, EmployeeUpdate, EmployeeResponse,
    AssignmentCreate, AssignmentUpdate, AssignmentResponse
)
from app.Model.EmployeeModel import EmployeeModel

router = APIRouter(prefix="/api/manager", tags=["Manager"])

# Employee endpoints
@router.post("/employees", response_model=EmployeeResponse)
def add_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return create_employee(db, employee, current_user)

@router.get("/employees", response_model=List[EmployeeResponse])
def get_employees(
    dept: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return list_employees(db, dept, role, current_user)

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

@router.delete("/employees/{emp_id}")
def deactivate_employee_account(
    emp_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return deactivate_employee(db, emp_id, current_user)

# Assignment endpoints
@router.post("/assignments", response_model=AssignmentResponse)
def create_assignment_endpoint(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return create_assignment(db, assignment, current_user)

@router.get("/assignments", response_model=List[AssignmentResponse])
def list_assignments_endpoint(
    emp_id: Optional[int] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return list_assignments(db, emp_id, project_id, current_user)

@router.put("/assignments/{assign_id}", response_model=AssignmentResponse)
def update_assignment_endpoint(
    assign_id: int,
    update: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return update_assignment(db, assign_id, update, current_user)

@router.delete("/assignments/{assign_id}")
def delete_assignment_endpoint(
    assign_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return delete_assignment(db, assign_id, current_user)
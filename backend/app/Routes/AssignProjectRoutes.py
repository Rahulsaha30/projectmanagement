from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.DataBase import get_db
from app.Core.Security import get_current_user
from app.Controllers.AssignProjectController import (
    create_assignment, list_assignments, update_assignment, delete_assignment
)
from app.View.AssignmentSchemas import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse
)
from app.Model.EmployeeModel import EmployeeModel

router = APIRouter(prefix="/api/assignments", tags=["Assignments"])

# Assignment endpoints
@router.post("", response_model=AssignmentResponse)
def create_assignment_endpoint(
    assignment: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return create_assignment(db, assignment, current_user)

@router.get("", response_model=List[AssignmentResponse])
def list_assignments_endpoint(
    emp_id: Optional[int] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return list_assignments(db, emp_id, project_id, current_user)

@router.put("/{assign_id}", response_model=AssignmentResponse)
def update_assignment_endpoint(
    assign_id: int,
    update: AssignmentUpdate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return update_assignment(db, assign_id, update, current_user)

@router.delete("/{assign_id}")
def delete_assignment_endpoint(
    assign_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    return delete_assignment(db, assign_id, current_user)

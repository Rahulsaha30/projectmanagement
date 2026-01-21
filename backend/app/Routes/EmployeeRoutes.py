from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.app.DataBase import get_db
from backend.app.Core.Security import get_current_user
from backend.app.Controllers.EmployeeController import (
    get_my_assignments,
    get_my_assignment_details,
    mark_task_completed,
    get_my_completed_tasks
)
from backend.app.View.AssignmentSchemas import (
    AssignmentResponse,
    TaskCompletionCreate,
    TaskCompletionResponse
)
from backend.app.Model.EmployeeModel import EmployeeModel

router = APIRouter(prefix="/api/employee", tags=["Employee"])


@router.get("/my-assignments", response_model=List[AssignmentResponse])
def get_all_my_assignments(
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    Get all assignments/tasks assigned to the current user.
    Available to: Employee, Manager, Admin
    """
    return get_my_assignments(db, current_user)


@router.get("/my-assignments/{assign_id}", response_model=AssignmentResponse)
def get_assignment_details(
    assign_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    Get details of a specific assignment.
    Users can only view their own assignments.
    Available to: Employee, Manager, Admin
    """
    return get_my_assignment_details(db, assign_id, current_user)


@router.post("/task-completions", response_model=TaskCompletionResponse, status_code=status.HTTP_201_CREATED)
def complete_task(
    completion: TaskCompletionCreate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    Mark a task/assignment as completed.
    Users can only complete their own assignments.
    Available to: Employee, Manager, Admin
    """
    return mark_task_completed(db, completion, current_user)


@router.get("/my-task-completions", response_model=List[TaskCompletionResponse])
def get_completed_tasks_history(
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user)
):
    """
    View history of all tasks completed by the current user.
    Available to: Employee, Manager, Admin
    """
    return get_my_completed_tasks(db, current_user)

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List
from datetime import datetime
from app.Model.EmployeeModel import EmployeeModel
from app.Model.AssignedProjectModel import AssignedProjectModel
from app.Model.ProjectModel import ProjectModel
from app.View.AssignmentSchemas import (
    AssignmentResponse, TaskCompletionCreate, TaskCompletionResponse
)


def get_my_assignments(db: Session, current_user: EmployeeModel):
    """
    Get all assignments for the current user.
    Available to all roles (Employee/Manager/Admin).
    """
    assignments = db.query(AssignedProjectModel).filter(
        AssignedProjectModel.emp_id == current_user.emp_id
    ).join(ProjectModel).all()
    
    return [
        AssignmentResponse(
            assign_id=a.assign_id,
            emp_id=a.emp_id,
            project_id=a.project_id,
            assigned_at=a.assigned_at,
            allotted_hours=a.allotted_hours,
            emp_name=a.employee.emp_name,
            project_name=a.project.name,
            is_completed=a.is_completed,
            completed_at=a.completed_at,
            hours_worked=a.hours_worked,
            completion_notes=a.completion_notes
        ) for a in assignments
    ]


def get_my_assignment_details(db: Session, assign_id: int, current_user: EmployeeModel):
    """
    Get details of a specific assignment.
    Users can only see their own assignments.
    """
    assignment = db.query(AssignedProjectModel).filter(
        AssignedProjectModel.assign_id == assign_id,
        AssignedProjectModel.emp_id == current_user.emp_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or you don't have access to it"
        )
    
    return AssignmentResponse(
        assign_id=assignment.assign_id,
        emp_id=assignment.emp_id,
        project_id=assignment.project_id,
        assigned_at=assignment.assigned_at,
        allotted_hours=assignment.allotted_hours,
        emp_name=assignment.employee.emp_name,
        project_name=assignment.project.name,
        is_completed=assignment.is_completed,
        completed_at=assignment.completed_at,
        hours_worked=assignment.hours_worked,
        completion_notes=assignment.completion_notes
    )


def mark_task_completed(db: Session, completion: TaskCompletionCreate, current_user: EmployeeModel):
    """
    Mark a task/assignment as completed.
    Users can only complete their own assignments.
    """
    assignment = db.query(AssignedProjectModel).filter(
        AssignedProjectModel.assign_id == completion.assign_id,
        AssignedProjectModel.emp_id == current_user.emp_id
    ).first()
    
    if not assignment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found or you don't have access to it"
        )
    
    if assignment.is_completed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This assignment is already marked as completed"
        )
    
    # Validate hours worked
    if completion.hours_worked < 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Hours worked cannot be negative"
        )
    
    # Mark as completed
    assignment.is_completed = True
    assignment.completed_at = datetime.utcnow()
    assignment.hours_worked = completion.hours_worked
    assignment.completion_notes = completion.completion_notes
    
    db.commit()
    db.refresh(assignment)
    
    return TaskCompletionResponse(
        assign_id=assignment.assign_id,
        emp_id=assignment.emp_id,
        project_id=assignment.project_id,
        emp_name=assignment.employee.emp_name,
        project_name=assignment.project.name,
        assigned_at=assignment.assigned_at,
        completed_at=assignment.completed_at,
        allotted_hours=assignment.allotted_hours,
        hours_worked=assignment.hours_worked,
        completion_notes=assignment.completion_notes
    )


def get_my_completed_tasks(db: Session, current_user: EmployeeModel):
    """
    Get history of all completed tasks for the current user.
    """
    completed_assignments = db.query(AssignedProjectModel).filter(
        AssignedProjectModel.emp_id == current_user.emp_id,
        AssignedProjectModel.is_completed == True
    ).join(ProjectModel).all()
    
    return [
        TaskCompletionResponse(
            assign_id=a.assign_id,
            emp_id=a.emp_id,
            project_id=a.project_id,
            emp_name=a.employee.emp_name,
            project_name=a.project.name,
            assigned_at=a.assigned_at,
            completed_at=a.completed_at,
            allotted_hours=a.allotted_hours,
            hours_worked=a.hours_worked,
            completion_notes=a.completion_notes
        ) for a in completed_assignments
    ]

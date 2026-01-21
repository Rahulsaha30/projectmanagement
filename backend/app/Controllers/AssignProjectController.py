from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
from backend.app.Model.EmployeeModel import EmployeeModel
from backend.app.Model.AssignedProjectModel import AssignedProjectModel
from backend.app.Model.ProjectModel import ProjectModel
from backend.app.Model.Role import RoleEnum
from backend.app.View.AssignmentSchemas import (
    AssignmentCreate, AssignmentUpdate, AssignmentResponse
)

def check_manager_or_admin(user):
    if user.role not in [RoleEnum.manager, RoleEnum.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

# Assignment functions
def create_assignment(db: Session, assignment: AssignmentCreate, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    # Check employee
    emp = db.query(EmployeeModel).filter(EmployeeModel.emp_id == assignment.emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check project
    proj = db.query(ProjectModel).filter(ProjectModel.project_id == assignment.project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check unique
    existing = db.query(AssignedProjectModel).filter(
        AssignedProjectModel.emp_id == assignment.emp_id,
        AssignedProjectModel.project_id == assignment.project_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Assignment already exists")
    
    new_assign = AssignedProjectModel(
        emp_id=assignment.emp_id,
        project_id=assignment.project_id,
        allotted_hours=assignment.allotted_hours
    )
    db.add(new_assign)
    db.commit()
    db.refresh(new_assign)
    
    return AssignmentResponse(
        assign_id=new_assign.assign_id,
        emp_id=new_assign.emp_id,
        project_id=new_assign.project_id,
        assigned_at=new_assign.assigned_at,
        allotted_hours=new_assign.allotted_hours,
        emp_name=emp.emp_name,
        project_name=proj.name,
        is_completed=new_assign.is_completed,
        completed_at=new_assign.completed_at,
        hours_worked=new_assign.hours_worked,
        completion_notes=new_assign.completion_notes
    )

def list_assignments(db: Session, emp_id: Optional[int] = None, project_id: Optional[int] = None, current_user: EmployeeModel = None):
    if current_user:
        check_manager_or_admin(current_user)
    
    query = db.query(AssignedProjectModel).join(EmployeeModel).join(ProjectModel)
    if emp_id:
        query = query.filter(AssignedProjectModel.emp_id == emp_id)
    if project_id:
        query = query.filter(AssignedProjectModel.project_id == project_id)
    
    assignments = query.all()
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

def update_assignment(db: Session, assign_id: int, update: AssignmentUpdate, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    assign = db.query(AssignedProjectModel).filter(AssignedProjectModel.assign_id == assign_id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    if update.allotted_hours is not None:
        assign.allotted_hours = update.allotted_hours
    
    db.commit()
    db.refresh(assign)
    return AssignmentResponse(
        assign_id=assign.assign_id,
        emp_id=assign.emp_id,
        project_id=assign.project_id,
        assigned_at=assign.assigned_at,
        allotted_hours=assign.allotted_hours,
        emp_name=assign.employee.emp_name,
        project_name=assign.project.name,
        is_completed=assign.is_completed,
        completed_at=assign.completed_at,
        hours_worked=assign.hours_worked,
        completion_notes=assign.completion_notes
    )

def delete_assignment(db: Session, assign_id: int, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    assign = db.query(AssignedProjectModel).filter(AssignedProjectModel.assign_id == assign_id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assign)
    db.commit()
    return {"message": "Assignment deleted"}

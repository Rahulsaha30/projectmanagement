from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from app.Model.EmployeeModel import EmployeeModel
from app.Model.ProjectModel import ProjectModel
from app.Model.Role import RoleEnum
from app.View.ProjectSchemas import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectStatsResponse,
)
from datetime import datetime
from .ManagerController import check_manager_or_admin

def check_admin(user: EmployeeModel):
    if user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required"
        )


# Project CRUD functions
def create_project(db: Session, project: ProjectCreate, current_user: EmployeeModel):
    check_admin(current_user)

    new_proj = ProjectModel(
        name=project.name,
        client=project.client,
        expected_hours=project.expected_hours,
        status=project.status,
        end_date=project.end_date,
    )
    db.add(new_proj)
    db.commit()
    db.refresh(new_proj)
    return ProjectResponse(
        project_id=new_proj.project_id,
        name=new_proj.name,
        client=new_proj.client,
        expected_hours=new_proj.expected_hours,
        status=new_proj.status,
        start_date=new_proj.start_date,
        end_date=new_proj.end_date,
    )


def list_projects(
    db: Session, skip: int = 0, limit: int = 100, current_user: EmployeeModel = None
):
    if current_user:
        check_manager_or_admin(current_user)

    query = db.query(ProjectModel)
    projects = query.offset(skip).limit(limit).all()

    return [
        ProjectResponse(
            project_id=p.project_id,
            name=p.name,
            client=p.client,
            expected_hours=p.expected_hours,
            status=p.status,
            start_date=p.start_date,
            end_date=p.end_date,
        )
        for p in projects
    ]


def get_project(db: Session, project_id: int, current_user: EmployeeModel):
    check_admin(current_user)

    proj = db.query(ProjectModel).filter(ProjectModel.project_id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    return ProjectResponse(
        project_id=proj.project_id,
        name=proj.name,
        client=proj.client,
        expected_hours=proj.expected_hours,
        status=proj.status,
        start_date=proj.start_date,
        end_date=proj.end_date,
    )


def update_project(
    db: Session, project_id: int, update: ProjectUpdate, current_user: EmployeeModel
):
    check_admin(current_user)

    proj = db.query(ProjectModel).filter(ProjectModel.project_id == project_id).first()
    if not proj:
        raise HTTPException(status_code=404, detail="Project not found")

    for field, value in update.dict(exclude_unset=True).items():
        if hasattr(proj, field):
            setattr(proj, field, value)

    db.commit()
    db.refresh(proj)
    return ProjectResponse(
        project_id=proj.project_id,
        name=proj.name,
        client=proj.client,
        expected_hours=proj.expected_hours,
        status=proj.status,
        start_date=proj.start_date,
        end_date=proj.end_date,
    )


# def delete_project(db: Session, project_id: int, current_user: EmployeeModel):
#     check_admin(current_user)

#     proj = db.query(ProjectModel).filter(ProjectModel.project_id == project_id).first()
#     if not proj:
#         raise HTTPException(status_code=404, detail="Project not found")

#     db.delete(proj)
#     db.commit()
#     return {"message": "Project deleted"}


# Stats function
def get_project_stats(db: Session, current_user: EmployeeModel):
    check_admin(current_user)

    total_projects = db.query(ProjectModel).count()
    active_projects = db.query(ProjectModel).filter(ProjectModel.status == True).count()
    completed_projects = (
        db.query(ProjectModel).filter(ProjectModel.status == False).count()
    )

    # Sum of expected_hours across all projects
    total_expected_hours = db.query(ProjectModel).all()
    hours_sum = sum(p.expected_hours or 0 for p in total_expected_hours)

    return ProjectStatsResponse(
        total_projects=total_projects,
        active_projects=active_projects,
        completed_projects=completed_projects,
        total_expected_hours=hours_sum,
    )

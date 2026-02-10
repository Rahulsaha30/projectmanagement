from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List
from app.DataBase import get_db
from app.Core.Security import get_current_user
from app.Controllers.AdminController import (
    create_project,
    list_projects,
    get_project,
    update_project,
    # delete_project,
    get_project_stats,
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectStatsResponse,
)
from app.Model.EmployeeModel import EmployeeModel

router = APIRouter(prefix="/api/admin/projects", tags=["Admin"])


# Project endpoints
@router.post("", response_model=ProjectResponse)
def create_project_endpoint(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user),
):
    return create_project(db, project, current_user)


@router.get("", response_model=List[ProjectResponse])
def list_projects_endpoint(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Number of records to return"),
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user),
):
    return list_projects(db, skip, limit, current_user)


@router.get("/stats", response_model=ProjectStatsResponse)
def get_project_stats_endpoint(
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user),
):
    return get_project_stats(db, current_user)


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project_endpoint(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user),
):
    return get_project(db, project_id, current_user)


@router.put("/{project_id}", response_model=ProjectResponse)
def update_project_endpoint(
    project_id: int,
    update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: EmployeeModel = Depends(get_current_user),
):
    return update_project(db, project_id, update, current_user)


# @router.delete("/{project_id}")
# def delete_project_endpoint(
#     project_id: int,
#     db: Session = Depends(get_db),
#     current_user: EmployeeModel = Depends(get_current_user),
# ):
#     return delete_project(db, project_id, current_user)

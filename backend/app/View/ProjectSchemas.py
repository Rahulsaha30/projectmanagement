from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str
    client: str
    expected_hours: Optional[int] = None
    status: Optional[bool] = True
    end_date: Optional[datetime] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    client: Optional[str] = None
    expected_hours: Optional[int] = None
    status: Optional[bool] = None
    end_date: Optional[datetime] = None


class ProjectResponse(BaseModel):
    project_id: int
    name: str
    client: str
    expected_hours: Optional[int]
    status: bool
    start_date: datetime
    end_date: Optional[datetime]


class ProjectStatsResponse(BaseModel):
    total_projects: int
    active_projects: int
    completed_projects: int
    total_expected_hours: int

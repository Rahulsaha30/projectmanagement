from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint, Boolean, String
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.DataBase import Base

class AssignedProjectModel(Base):
    __tablename__ = "assigned_projects"

    assign_id = Column(Integer, primary_key=True, index=True)

    emp_id = Column(Integer, ForeignKey("employees.emp_id"))
    project_id = Column(Integer, ForeignKey("projects.project_id"))

    assigned_at = Column(DateTime, default=datetime.utcnow)
    allotted_hours = Column(Integer, nullable=False)
    
    # Task completion tracking
    is_completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    hours_worked = Column(Integer, default=0)
    completion_notes = Column(String, nullable=True)

    employee = relationship("EmployeeModel", back_populates="assignments")
    project = relationship("ProjectModel", back_populates="assignments")

    __table_args__ = (
        UniqueConstraint("emp_id", "project_id", name="unique_employee_project"),
    )

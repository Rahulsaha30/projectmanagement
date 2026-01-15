from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.DataBase import Base

class ProjectModel(Base):
    __tablename__ = "projects"

    project_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, nullable=False)

    expected_hours = Column(Integer)
    status = Column(Boolean, default=True)

    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)

    assignments = relationship(
        "AssignedProject",
        back_populates="project",
        cascade="all, delete"
    )

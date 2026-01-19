from sqlalchemy import Column, Integer, String ,Enum, Boolean
from sqlalchemy.orm import relationship
from app.DataBase import Base
from app.Model.Role import RoleEnum

class EmployeeModel(Base):
    __tablename__="employees"
    
    emp_id = Column(Integer, primary_key=True, index=True)
    emp_name = Column(String, nullable=False)

    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    billable_work_hours = Column(Integer, default=0)
    skills = Column(String)
    experience = Column(Integer)
    dept = Column(String)

    role = Column(Enum(RoleEnum), default=RoleEnum.employee)
    is_active = Column(Boolean, default=True)

    assignments = relationship(
        "AssignedProjectModel",
        back_populates="employee",
        cascade="all, delete"
    )


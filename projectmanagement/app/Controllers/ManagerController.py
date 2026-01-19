from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List, Optional
from app.Model.EmployeeModel import EmployeeModel
from app.Model.AssignedProjectModel import AssignedProjectModel
from app.Model.ProjectModel import ProjectModel
from app.Model.Role import RoleEnum
from pydantic import BaseModel
from datetime import datetime

def check_manager_or_admin(user: EmployeeModel):
    if user.role not in [RoleEnum.manager, RoleEnum.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

# Employee functions
def create_employee(db: Session, employee: EmployeeCreate, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    # Check if email exists
    existing = db.query(EmployeeModel).filter(EmployeeModel.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    from app.Core.Security import hash_password
    hashed_password = hash_password(employee.password)
    
    new_emp = EmployeeModel(
        emp_name=employee.emp_name,
        email=employee.email,
        hashed_password=hashed_password,
        role=employee.role,
        billable_work_hours=employee.billable_work_hours,
        skills=employee.skills,
        experience=employee.experience,
        dept=employee.dept
    )
    db.add(new_emp)
    db.commit()
    db.refresh(new_emp)
    return EmployeeResponse(
        emp_id=new_emp.emp_id,
        emp_name=new_emp.emp_name,
        email=new_emp.email,
        role=new_emp.role.value,
        billable_work_hours=new_emp.billable_work_hours,
        skills=new_emp.skills,
        experience=new_emp.experience,
        dept=new_emp.dept,
        is_active=new_emp.is_active
    )

def list_employees(db: Session, dept: Optional[str] = None, role: Optional[str] = None, current_user: EmployeeModel = None):
    if current_user:
        check_manager_or_admin(current_user)
    
    query = db.query(EmployeeModel)
    if dept:
        query = query.filter(EmployeeModel.dept == dept)
    if role:
        query = query.filter(EmployeeModel.role == RoleEnum(role))
    
    employees = query.all()
    return [
        EmployeeResponse(
            emp_id=e.emp_id,
            emp_name=e.emp_name,
            email=e.email,
            role=e.role.value,
            billable_work_hours=e.billable_work_hours,
            skills=e.skills,
            experience=e.experience,
            dept=e.dept,
            is_active=e.is_active
        ) for e in employees
    ]

def get_employee(db: Session, emp_id: int, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    emp = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    return EmployeeResponse(
        emp_id=emp.emp_id,
        emp_name=emp.emp_name,
        email=emp.email,
        role=emp.role.value,
        billable_work_hours=emp.billable_work_hours,
        skills=emp.skills,
        experience=emp.experience,
        dept=emp.dept,
        is_active=emp.is_active
    )

def update_employee(db: Session, emp_id: int, update: EmployeeUpdate, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    emp = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    if update.email:
        existing = db.query(EmployeeModel).filter(EmployeeModel.email == update.email, EmployeeModel.emp_id != emp_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
        emp.email = update.email
    
    for field, value in update.dict(exclude_unset=True).items():
        if field != 'email' and hasattr(emp, field):
            setattr(emp, field, value)
    
    db.commit()
    db.refresh(emp)
    return EmployeeResponse(
        emp_id=emp.emp_id,
        emp_name=emp.emp_name,
        email=emp.email,
        role=emp.role.value,
        billable_work_hours=emp.billable_work_hours,
        skills=emp.skills,
        experience=emp.experience,
        dept=emp.dept,
        is_active=emp.is_active
    )

def deactivate_employee(db: Session, emp_id: int, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    emp = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    emp.is_active = False
    db.commit()
    return {"message": "Employee deactivated"}

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
        project_name=proj.name
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
            project_name=a.project.name
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
        project_name=assign.project.name
    )

def delete_assignment(db: Session, assign_id: int, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    assign = db.query(AssignedProjectModel).filter(AssignedProjectModel.assign_id == assign_id).first()
    if not assign:
        raise HTTPException(status_code=404, detail="Assignment not found")
    
    db.delete(assign)
    db.commit()
    return {"message": "Assignment deleted"}

from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import Optional
from backend.app.Model.EmployeeModel import EmployeeModel
from backend.app.Model.Role import RoleEnum
from backend.app.Core.Security import hash_password
from backend.app.View.EmployeeSchemas import (
    EmployeeCreate, EmployeeUpdate, EmployeeResponse,
)

# def check_manager_or_admin(user: EmployeeModel):
def check_manager_or_admin(user):
    if user.role not in [RoleEnum.manager, RoleEnum.admin]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )

# Employee functions
def create_employee(db: Session, employee: EmployeeCreate, current_user: EmployeeModel):
    print("\n\n USER:\n", current_user, "\n\n")
    # print("\nCURRENT USRER ROLE\n", current_user['role'], "\n\n")
    print("\nCURRENT USRER ROLE\n", current_user.role, "\n\n")

    check_manager_or_admin(current_user)

    # Manager can only add employees, not managers or admins
    if current_user.role == RoleEnum.manager and employee.role != RoleEnum.employee:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Managers can only add employees, not managers or admins"
        )
    
    # Check if email exists
    existing = db.query(EmployeeModel).filter(EmployeeModel.email == employee.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
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
    
    # Manager can only see employees in their department
    if current_user and current_user.role == RoleEnum.manager:
        query = query.filter(EmployeeModel.dept == current_user.dept)
    elif dept:
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
    
    # Manager can only view employees in their department
    if current_user.role == RoleEnum.manager:
        if not current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Manager department not set"
            )
        if emp.dept != current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view employees in your department"
            )
    
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
    
    # Manager can only update employees in their department
    if current_user.role == RoleEnum.manager:
        if not current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Manager department not set"
            )
        if emp.dept != current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update employees in your department"
            )
    
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

def toggle_employee_status(db: Session, emp_id: int, current_user: EmployeeModel):
    check_manager_or_admin(current_user)
    
    emp = db.query(EmployeeModel).filter(EmployeeModel.emp_id == emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Manager can only toggle status for employees in their department
    if current_user.role == RoleEnum.manager:
        if not current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Manager department not set"
            )
        if emp.dept != current_user.dept:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only manage employees in your department"
            )
    
    # Toggle the active status
    emp.is_active = not emp.is_active
    db.commit()
    status_text = "activated" if emp.is_active else "deactivated"
    return {"message": f"Employee {status_text} successfully"}

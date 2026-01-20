from fastapi import Depends, HTTPException, status
from backend.app.Model.Role import RoleEnum
from backend.app.Core.Security import get_current_user
from backend.app.Model.EmployeeModel import EmployeeModel
#  Depend FUNCTIONS FOR ROLE-BASED ACCESS CONTROL*/


def require_admin(
    user: EmployeeModel = Depends(get_current_user)
):
    if user.role != RoleEnum.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return user

def require_manager(
    user: EmployeeModel = Depends(get_current_user)
):
    if user.role not in [RoleEnum.admin, RoleEnum.manager]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Manager access required"
        )
    return user

def require_employee(
    user: EmployeeModel = Depends(get_current_user)
):
    return user


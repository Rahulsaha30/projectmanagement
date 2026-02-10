"""
Script to populate the database with test data
Run this after creating the database to add sample employees, managers, and projects
"""
import sys
import os
from pathlib import Path

# Add parent directory to path to import backend modules
current_dir = Path(__file__).parent
parent_dir = current_dir.parent
sys.path.insert(0, str(parent_dir))

# Set the working directory to backend
os.chdir(current_dir)

from app.DataBase import SessionLocal, Base, engine
from app.Model.EmployeeModel import EmployeeModel
from app.Model.ProjectModel import ProjectModel
from app.Model.AssignedProjectModel import AssignedProjectModel
from app.Model.Role import RoleEnum
from app.Core.Security import hash_password
from datetime import datetime, timedelta

def populate_data():
    # Create all tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully!")
    
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(EmployeeModel).count()
        if existing_count > 1:
            print(f"Database already has {existing_count} employees. Skipping population.")
            return
        
        print("Populating database with test data...")
        
        # Create Admin
        admin = EmployeeModel(
            emp_name="Admin.User",
            email="Admin.User@gyansys.com",
            hashed_password=hash_password("Admin123@"),
            role=RoleEnum.admin,
            billable_work_hours=0,
            skills="Management,Leadership,Strategy",
            experience=10,
            dept="Administration",
            is_active=True
        )
        db.add(admin)
        db.flush()
        
        # Create Managers
        manager1 = EmployeeModel(
            emp_name="John.Manager",
            email="John.Manager@gyansys.com",
            hashed_password=hash_password("Manager123@"),
            role=RoleEnum.manager,
            billable_work_hours=0,
            skills="Python,Django,Team Management",
            experience=7,
            dept="Development",
            is_active=True
        )
        db.add(manager1)
        db.flush()
        
        manager2 = EmployeeModel(
            emp_name="Sarah.Lead",
            email="Sarah.Lead@gyansys.com",
            hashed_password=hash_password("Manager123@"),
            role=RoleEnum.manager,
            billable_work_hours=0,
            skills="React,Angular,UI/UX",
            experience=6,
            dept="Frontend",
            is_active=True
        )
        db.add(manager2)
        db.flush()
        
        # Create Employees for Development Department
        employees_dev = [
            {
                "name": "Alice.Developer",
                "email": "Alice.Developer@gyansys.com",
                "skills": "Python,FastAPI,PostgreSQL",
                "experience": 3,
                "dept": "Development",
                "added_by": manager1.emp_id
            },
            {
                "name": "Bob.Coder",
                "email": "Bob.Coder@gyansys.com",
                "skills": "Python,Django,MySQL",
                "experience": 4,
                "dept": "Development",
                "added_by": manager1.emp_id
            },
            {
                "name": "Charlie.Dev",
                "email": "Charlie.Dev@gyansys.com",
                "skills": "Java,Spring Boot,MongoDB",
                "experience": 5,
                "dept": "Development",
                "added_by": manager1.emp_id
            },
            {
                "name": "David.Backend",
                "email": "David.Backend@gyansys.com",
                "skills": "Node.js,Express,PostgreSQL",
                "experience": 2,
                "dept": "Development",
                "added_by": manager1.emp_id
            }
        ]
        
        dev_emp_objects = []
        for emp_data in employees_dev:
            emp = EmployeeModel(
                emp_name=emp_data["name"],
                email=emp_data["email"],
                hashed_password=hash_password("Employee123@"),
                role=RoleEnum.employee,
                billable_work_hours=0,
                skills=emp_data["skills"],
                experience=emp_data["experience"],
                dept=emp_data["dept"],
                is_active=True,
                added_by=emp_data["added_by"]
            )
            db.add(emp)
            dev_emp_objects.append(emp)
        
        db.flush()
        
        # Create Employees for Frontend Department
        employees_frontend = [
            {
                "name": "Emma.Frontend",
                "email": "Emma.Frontend@gyansys.com",
                "skills": "React,TypeScript,Redux",
                "experience": 3,
                "dept": "Frontend",
                "added_by": manager2.emp_id
            },
            {
                "name": "Frank.UI",
                "email": "Frank.UI@gyansys.com",
                "skills": "Angular,RxJS,SASS",
                "experience": 4,
                "dept": "Frontend",
                "added_by": manager2.emp_id
            },
            {
                "name": "Grace.Designer",
                "email": "Grace.Designer@gyansys.com",
                "skills": "Figma,CSS,HTML,JavaScript",
                "experience": 2,
                "dept": "Frontend",
                "added_by": manager2.emp_id
            }
        ]
        
        frontend_emp_objects = []
        for emp_data in employees_frontend:
            emp = EmployeeModel(
                emp_name=emp_data["name"],
                email=emp_data["email"],
                hashed_password=hash_password("Employee123@"),
                role=RoleEnum.employee,
                billable_work_hours=0,
                skills=emp_data["skills"],
                experience=emp_data["experience"],
                dept=emp_data["dept"],
                is_active=True,
                added_by=emp_data["added_by"]
            )
            db.add(emp)
            frontend_emp_objects.append(emp)
        
        db.flush()
        
        # Create Projects
        projects = [
            {
                "name": "E-Commerce Platform",
                "client": "RetailCorp",
                "expected_hours": 500,
                "status": True,
                "end_date": datetime.utcnow() + timedelta(days=90)
            },
            {
                "name": "Mobile Banking App",
                "client": "FinanceBank",
                "expected_hours": 800,
                "status": True,
                "end_date": datetime.utcnow() + timedelta(days=120)
            },
            {
                "name": "Healthcare Portal",
                "client": "MediCare",
                "expected_hours": 600,
                "status": True,
                "end_date": datetime.utcnow() + timedelta(days=100)
            },
            {
                "name": "Analytics Dashboard",
                "client": "DataTech",
                "expected_hours": 400,
                "status": True,
                "end_date": datetime.utcnow() + timedelta(days=60)
            }
        ]
        
        project_objects = []
        for proj_data in projects:
            proj = ProjectModel(**proj_data)
            db.add(proj)
            project_objects.append(proj)
        
        db.flush()
        
        # Create some assignments
        assignments = [
            # E-Commerce Platform
            {"emp": dev_emp_objects[0], "project": project_objects[0], "hours": 120},
            {"emp": dev_emp_objects[1], "project": project_objects[0], "hours": 100},
            {"emp": frontend_emp_objects[0], "project": project_objects[0], "hours": 150},
            
            # Mobile Banking App
            {"emp": dev_emp_objects[2], "project": project_objects[1], "hours": 200},
            {"emp": frontend_emp_objects[1], "project": project_objects[1], "hours": 180},
            
            # Healthcare Portal
            {"emp": dev_emp_objects[3], "project": project_objects[2], "hours": 150},
            {"emp": frontend_emp_objects[2], "project": project_objects[2], "hours": 120},
        ]
        
        for assign_data in assignments:
            assignment = AssignedProjectModel(
                emp_id=assign_data["emp"].emp_id,
                project_id=assign_data["project"].project_id,
                allotted_hours=assign_data["hours"]
            )
            db.add(assignment)
        
        db.commit()
        
        print("\n✅ Test data populated successfully!")
        print("\n📊 Summary:")
        print(f"  - 1 Admin created")
        print(f"  - 2 Managers created")
        print(f"  - 7 Employees created")
        print(f"  - 4 Projects created")
        print(f"  - 7 Assignments created")
        
        print("\n🔑 Login Credentials:")
        print("\n  Admin:")
        print("    Email: Admin.User@gyansys.com")
        print("    Password: Admin123@")
        print("\n  Manager 1 (Development):")
        print("    Email: John.Manager@gyansys.com")
        print("    Password: Manager123@")
        print("\n  Manager 2 (Frontend):")
        print("    Email: Sarah.Lead@gyansys.com")
        print("    Password: Manager123@")
        print("\n  All Employees:")
        print("    Password: Employee123@")
        
    except Exception as e:
        db.rollback()
        print(f"❌i  Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    populate_data()

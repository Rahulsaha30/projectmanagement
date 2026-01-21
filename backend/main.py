from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .app.DataBase import engine, Base
from .app.Routes.AuthRoutes import router as auth_router
from .app.Routes.ManagerRoutes import router as manager_router
from .app.Routes.AdminRoutes import router as admin_router
from .app.Routes.AssignProjectRoutes import router as assignment_router
from .app.Routes.EmployeeRoutes import router as employee_router
from .app.Core.Logger import setup_logging

# Import all models to ensure they are registered with SQLAlchemy
from .app.Model.EmployeeModel import EmployeeModel
from .app.Model.ProjectModel import ProjectModel
from .app.Model.AssignedProjectModel import AssignedProjectModel
from .app.Model.Role import RoleEnum

# Setup logging
logger = setup_logging()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(manager_router)
app.include_router(admin_router)
app.include_router(assignment_router)
app.include_router(employee_router)

logger.info("FastAPI app started")


@app.get("/")
async def read():
    logger.debug("Root endpoint accessed")
    return {"message": "Hello World"}

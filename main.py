from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.DataBase import engine, Base
from app.Routes.AuthRoutes import router as auth_router

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

@app.get("/")
async def read():
    return {"message": "Hello World"}
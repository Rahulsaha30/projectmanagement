# Project Management System

A full-stack project management application with **FastAPI** backend and **React** frontend for managing employees, projects, and assignments with role-based access control.

---

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Security](#security)

---

## 🎯 Overview

This system provides a comprehensive solution for project and employee management with:
- **JWT-based Authentication**: Secure login with access and refresh tokens
- **Role-Based Access Control**: Admin, Manager, and Employee roles
- **Employee Management**: CRUD operations for employee data
- **Assignment Tracking**: Link employees to projects with hour allocation
- **Modern UI**: React-based responsive frontend with beautiful gradient design

---

## ✨ Features

### Authentication
- ✅ User signup with role-specific PINs
- ✅ JWT token-based login
- ✅ Forgot password with PIN verification
- ✅ Access & refresh tokens

### Employee Management (Manager/Admin)
- ✅ Add, view, update, and deactivate employees
- ✅ Track skills, experience, department, billable hours
- ✅ Filter by department and role
- ✅ Soft delete functionality

### Assignment Management (Manager/Admin)
- ✅ Assign employees to projects
- ✅ Track allocated hours
- ✅ Update and delete assignments
- ✅ Filter by employee or project

### Security & Validation
- ✅ Email validation: `@gyansys.com` domain only
- ✅ Name format: `First.Last` (e.g., John.Doe)
- ✅ Strong password requirement (8+ chars, letters, digits, special chars)
- ✅ Bcrypt password hashing
- ✅ CORS enabled for frontend

---

## 🛠 Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database
- **JWT (python-jose)** - Authentication
- **Bcrypt** - Password hashing
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

### Frontend
- **React** - UI library
- **JavaScript (ES6+)** - Programming language
- **CSS3** - Styling with gradients and animations
- **Fetch API** - HTTP requests

---

## 📁 Project Structure

```
gyansys-project1/
├── projectmanagement/          # Backend (FastAPI)
│   ├── app/
│   │   ├── Core/
│   │   │   ├── Config.py       # Environment configuration
│   │   │   ├── Logger.py       # Logging setup
│   │   │   ├── Security.py     # JWT & password hashing
│   │   │   └── Rolemanage.py   # Role utilities
│   │   ├── Model/
│   │   │   ├── EmployeeModel.py    # Employee schema
│   │   │   ├── ProjectModel.py     # Project schema
│   │   │   ├── AssignedProjectModel.py  # Assignment schema
│   │   │   └── Role.py             # Role enum
│   │   ├── Routes/
│   │   │   ├── AuthRoutes.py       # Auth endpoints
│   │   │   └── ManagerRoutes.py    # Manager endpoints
│   │   ├── Controllers/
│   │   │   └── ManagerController.py  # Business logic
│   │   └── DataBase.py         # DB connection
│   ├── main.py                 # App entry point
│   ├── requirements.txt        # Dependencies
│   ├── .env                    # Environment vars (SECRET!)
│   └── README.md
│
└── frontend/                   # Frontend (React)
    ├── src/
    │   ├── App.js              # Main component
    │   ├── App.css             # Styles
    │   └── index.js
    ├── public/
    ├── package.json
    └── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Python** 3.9+
- **Node.js** 14+ and npm
- **Git**

### Backend Setup

```bash
# Clone repository
git clone https://github.com/Rahulsaha30/projectmanagement.git
cd projectmanagement/projectmanagement

# Create virtual environment (optional but recommended)
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy .env.example or create with:
DataBase_URL=sqlite:///./projectmanagement.db
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRY_MIN=30
REFRESH_TOKEN_EXPIRY_DAYS=7
```

### Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

---

## 🏃 Running the Application

### Start Backend

```powershell
cd projectmanagement
$env:PYTHONPATH = "C:\path\to\projectmanagement"
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

**Access**: 
- API: http://localhost:8000
- Swagger: http://localhost:8000/docs

### Start Frontend

```bash
cd frontend
npm start
```

**Access**: http://localhost:3000

---

## 📚 API Documentation

### Authentication

#### Signup
```http
POST /auth/signup
Content-Type: application/json

{
  "emp_name": "John.Doe",
  "email": "john.doe@gyansys.com",
  "password": "Secure123!",
  "role": "manager",
  "pin": "mgr456"
}
```

**Role PINs**:
- Admin: `adm789`
- Manager: `mgr456`
- Employee: `emp123`

#### Login
```http
POST /auth/login
Content-Type: application/x-www-form-urlencoded

username=john.doe@gyansys.com&password=Secure123!
```

**Response**:
```json
{
  "access_token": "eyJhbGci...",
  "refresh_token": "eyJhbGci...",
  "token_type": "bearer"
}
```

#### Forgot Password
```http
PUT /auth/forgot-password
Content-Type: application/json

{
  "email": "john.doe@gyansys.com",
  "pin": "mgr456",
  "new_password": "NewPassword123!"
}
```

### Manager Endpoints

**Authorization**: `Authorization: Bearer <token>`

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/manager/employees` | GET | List employees | Manager/Admin |
| `/api/manager/employees` | POST | Add employee | Manager/Admin |
| `/api/manager/employees/{id}` | GET | Get employee | Manager/Admin |
| `/api/manager/employees/{id}` | PUT | Update employee | Manager/Admin |
| `/api/manager/employees/{id}` | DELETE | Deactivate employee | Manager/Admin |
| `/api/manager/assignments` | GET | List assignments | Manager/Admin |
| `/api/manager/assignments` | POST | Create assignment | Manager/Admin |
| `/api/manager/assignments/{id}` | PUT | Update assignment | Manager/Admin |
| `/api/manager/assignments/{id}` | DELETE | Delete assignment | Manager/Admin |

---

## 🧪 Testing

### Swagger UI (Recommended)

1. Open http://localhost:8000/docs
2. Click **"Authorize"** button
3. Enter credentials:
   - username: `your.email@gyansys.com`
   - password: `YourPassword123!`
4. Click "Authorize" → "Close"
5. Test any endpoint

### Postman

1. **Login** to get token
2. Copy `access_token`
3. Set Authorization → Bearer Token → Paste token
4. Make requests

### Sample Test Flow

```bash
# 1. Signup
POST /auth/signup
{
  "emp_name": "Alice.Manager",
  "email": "alice.manager@gyansys.com",
  "password": "Alice123!",
  "role": "manager",
  "pin": "mgr456"
}

# 2. Login
POST /auth/login
username=alice.manager@gyansys.com
password=Alice123!

# 3. Use token to access protected endpoints
GET /api/manager/employees
Authorization: Bearer eyJhbGci...
```

---

## 🔒 Security

### Implemented Measures

- **Password Hashing**: Bcrypt with salt
- **JWT Tokens**: 
  - Access: 30 min expiry
  - Refresh: 7 days expiry
- **Input Validation**:
  - Email: `@gyansys.com` only
  - Name: `First.Last` format
  - Password: 8+ chars, letters, digits, special chars
- **Role-Based Access**: Manager/Admin restricted endpoints
- **CORS**: Configured for localhost:3000
- **Environment Secrets**: `.env` not in version control

---

## 🗄️ Database Schema

### Employees
```sql
- emp_id (PK)
- emp_name
- email (UNIQUE)
- hashed_password
- role (admin/manager/employee)
- billable_work_hours
- skills
- experience
- dept
- is_active
```

### Projects
```sql
- project_id (PK)
- name
- client
- expected_hours
- status
- start_date
- end_date
```

### Assignments
```sql
- assign_id (PK)
- emp_id (FK)
- project_id (FK)
- assigned_at
- allotted_hours
- UNIQUE(emp_id, project_id)
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error**: `ModuleNotFoundError: No module named 'app'`
```powershell
$env:PYTHONPATH = "C:\Users\...\projectmanagement"
```

**Error**: `bcrypt error`
```bash
pip install bcrypt --upgrade
```

### Frontend Issues

**Error**: `CORS policy`
- Ensure backend is running on port 8000
- Check `main.py` CORS middleware

**Error**: `Failed to fetch`
- Backend not running
- Check URL in `App.js` (http://localhost:8000)

---

## 📝 Key Terminology

- **JWT (JSON Web Token)**: Secure token format for authentication
- **RBAC (Role-Based Access Control)**: Permissions based on user roles
- **ORM (Object-Relational Mapping)**: SQLAlchemy maps Python objects to database tables
- **CRUD**: Create, Read, Update, Delete operations
- **MVC (Model-View-Controller)**: Architectural pattern (Model=DB, View=Routes, Controller=Logic)
- **CORS (Cross-Origin Resource Sharing)**: Allows frontend-backend communication
- **Bcrypt**: Hashing algorithm for password security
- **Soft Delete**: Mark as inactive instead of actual deletion

---

## 👥 Contributors

Development Team @ Gyansys

---

## 📄 License

Internal Project - All Rights Reserved

---

## 🔄 Version

**v0.1.0** (2026-01-18)
- Initial release
- Authentication system
- Employee & Assignment management
- React frontend
- Role-based access control

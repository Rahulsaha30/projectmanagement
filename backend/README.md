# Project Management System

A comprehensive project management application built with FastAPI, SQLAlchemy, and JWT authentication. This system allows managing employees, projects, and project assignments with role-based access control.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: JWT-based authentication with access and refresh tokens
- **Role-Based Access Control**: Admin, Manager, and Employee roles
- **Employee Management**: CRUD operations for employee data
- **Project Management**: Create and manage projects with assignments
- **Project Assignments**: Assign employees to projects with time tracking
- **RESTful API**: Well-documented API endpoints
- **CORS Support**: Ready for frontend integration (React, etc.)
- **Logging**: Comprehensive logging system with file and console output
- **Database**: SQLite database with SQLAlchemy ORM

## Project Scope

### Current Scope

The Project Management System provides a robust backend API for managing organizational projects, employees, and assignments. Key functionalities include:

#### Core Features Implemented
- **Authentication System**: Secure login with JWT tokens and refresh mechanism
- **User Management**: Employee registration, profile management, and role assignment
- **Project Lifecycle**: Project creation, status tracking, and time management
- **Resource Allocation**: Employee-to-project assignments with hour tracking
- **Data Integrity**: Comprehensive database relationships and constraints
- **API Documentation**: Auto-generated Swagger/OpenAPI documentation
- **Security**: Password hashing, CORS protection, and input validation

#### Technical Scope
- **Backend Architecture**: Modular FastAPI application with clear separation of concerns
- **Database Design**: Normalized relational database schema with proper indexing
- **Authentication Flow**: Stateless JWT-based authentication with role permissions
- **Logging Infrastructure**: Multi-level logging for debugging and monitoring
- **Configuration Management**: Environment-based configuration with Pydantic
- **API Design**: RESTful endpoints with proper HTTP status codes and error handling

### Future Enhancements

#### Planned Features
- **Advanced Reporting**: Dashboard analytics, project progress reports, and KPI tracking
- **Time Tracking**: Detailed time entry system with approval workflows
- **Notification System**: Email/SMS notifications for project updates and deadlines
- **File Management**: Document upload and sharing for project deliverables
- **Calendar Integration**: Project milestone and deadline synchronization
- **Mobile API**: Optimized endpoints for mobile application integration
- **Audit Trail**: Complete activity logging for compliance and tracking

#### Technical Improvements
- **Microservices Architecture**: Break down into smaller, independent services
- **GraphQL API**: Flexible query interface alongside REST endpoints
- **Real-time Updates**: WebSocket integration for live notifications
- **Caching Layer**: Redis integration for improved performance
- **API Rate Limiting**: Request throttling and abuse prevention
- **Database Migration**: Automated schema versioning and updates
- **Container Orchestration**: Kubernetes deployment configuration

### Recommendations

#### Development Recommendations
- **Code Quality**: Implement comprehensive unit and integration tests
- **Documentation**: Maintain up-to-date API documentation and code comments
- **Version Control**: Use feature branches and pull request workflows
- **Code Reviews**: Mandatory peer reviews for all code changes
- **Continuous Integration**: Set up automated testing and deployment pipelines

#### Security Recommendations
- **Environment Security**: Use environment-specific configurations
- **Secret Management**: Implement proper secret storage (Vault, AWS Secrets Manager)
- **HTTPS Enforcement**: Always use SSL/TLS in production
- **Regular Audits**: Periodic security assessments and dependency updates
- **Access Control**: Implement principle of least privilege
- **Data Encryption**: Encrypt sensitive data at rest and in transit

#### Deployment Recommendations
- **Production Database**: Migrate from SQLite to PostgreSQL/MySQL for scalability
- **Load Balancing**: Implement reverse proxy (Nginx) for high availability
- **Monitoring**: Set up application monitoring (Prometheus, Grafana)
- **Backup Strategy**: Regular database backups with disaster recovery plan
- **Scaling**: Horizontal scaling with container orchestration
- **CDN Integration**: Static asset delivery optimization

#### Performance Recommendations
- **Database Optimization**: Query optimization and indexing strategies
- **Caching Strategy**: Implement appropriate caching layers
- **Async Processing**: Background job processing for heavy operations
- **API Optimization**: Response compression and pagination
- **Resource Monitoring**: Track memory, CPU, and database connection usage

#### Maintenance Recommendations
- **Dependency Updates**: Regular security updates and dependency management
- **Database Maintenance**: Regular cleanup and performance tuning
- **Log Management**: Centralized logging and log rotation policies
- **Backup Verification**: Regular backup testing and restoration drills
- **Documentation Updates**: Keep all documentation current with changes

## Architecture

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │   FastAPI       │    │   SQLite        │
│   (Port 3000)   │◄──►│   Backend       │◄──►│   Database      │
│                 │    │   (Port 8000)   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────────┐
                    │   JWT Authentication│
                    │   & Authorization   │
                    └─────────────────────┘
```

### Application Structure

```
projectmanagement/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── __init__.py
├── app/
│   ├── Core/
│   │   ├── Config.py       # Application configuration
│   │   ├── Security.py     # JWT token handling
│   │   ├── Logger.py       # Logging configuration
│   │   └── Role.py         # Role enumerations
│   ├── DataBase.py         # Database connection and session
│   ├── Model/
│   │   ├── EmployeeModel.py    # Employee data model
│   │   ├── ProjectModel.py     # Project data model
│   │   └── AssignedProjectModel.py # Assignment model
│   └── Routes/
│       └── AuthRoutes.py   # Authentication endpoints
└── projectmanagement.db    # SQLite database file
```

### Data Flow

1. **Authentication Flow**:
   - User submits credentials via `/auth/login`
   - System validates credentials against database
   - JWT tokens are generated and returned
   - Subsequent requests include Bearer token in headers

2. **API Request Flow**:
   - Request → CORS Middleware → Authentication Middleware → Route Handler → Database → Response

## Technologies Used

- **Backend Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (JSON Web Tokens) with python-jose
- **Password Hashing**: PassLib with bcrypt
- **API Documentation**: Auto-generated Swagger UI
- **Logging**: Python logging module
- **Configuration**: Pydantic settings
- **CORS**: FastAPI CORS middleware
- **Development Server**: Uvicorn

## Database Schema

### Employees Table
```sql
CREATE TABLE employees (
    emp_id INTEGER PRIMARY KEY,
    emp_name VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    billable_work_hours INTEGER DEFAULT 0,
    skills VARCHAR,
    experience INTEGER,
    dept VARCHAR,
    role ENUM('admin', 'manager', 'employee') DEFAULT 'employee',
    is_active BOOLEAN DEFAULT TRUE
);
```

### Projects Table
```sql
CREATE TABLE projects (
    project_id INTEGER PRIMARY KEY,
    name VARCHAR NOT NULL,
    client VARCHAR NOT NULL,
    expected_hours INTEGER,
    status BOOLEAN DEFAULT TRUE,
    start_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    end_date DATETIME
);
```

### Assigned Projects Table
```sql
CREATE TABLE assigned_projects (
    assign_id INTEGER PRIMARY KEY,
    emp_id INTEGER REFERENCES employees(emp_id),
    project_id INTEGER REFERENCES projects(project_id),
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    allotted_hours INTEGER NOT NULL,
    UNIQUE(emp_id, project_id)
);
```

### Relationships
- Employee ↔ AssignedProject (One-to-Many)
- Project ↔ AssignedProject (One-to-Many)

## Installation

### Prerequisites
- Python 3.8 or higher
- Git

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rahulsaha30/projectmanagement.git
   cd projectmanagement
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   DataBase_URL=sqlite:///./projectmanagement.db
   SECRET_KEY=your-super-secret-key-change-this-in-production
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRY_MIN=30
   REFRESH_TOKEN_EXPIRY_DAYS=7
   ```

## Configuration

The application uses Pydantic settings for configuration. Key settings:

- `DataBase_URL`: Database connection string
- `SECRET_KEY`: JWT secret key (change in production)
- `ALGORITHM`: JWT algorithm (HS256)
- `ACCESS_TOKEN_EXPIRY_MIN`: Access token validity in minutes
- `REFRESH_TOKEN_EXPIRY_DAYS`: Refresh token validity in days

## Running the Application

### Development Mode
```bash
uvicorn main:app --reload
```

The application will be available at:
- API: http://127.0.0.1:8000
- Documentation: http://127.0.0.1:8000/docs
- Alternative Docs: http://127.0.0.1:8000/redoc

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Documentation

### Authentication Endpoints

#### POST /auth/login
Authenticate user and get tokens.

**Request Body**:
```json
{
  "username": "user@example.com",
  "password": "password"
}
```

**Response**:
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer"
}
```

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "eyJ..."
}
```

**Response**:
```json
{
  "access_token": "eyJ...",
  "token_type": "bearer"
}
```

### Protected Endpoints
All other endpoints require Bearer token authentication:
```
Authorization: Bearer <access_token>
```

## Testing

### Running Tests
```bash
pytest
```

### Manual Testing
Use the Swagger UI at `/docs` or tools like Postman/cURL.

Example login request:
```bash
curl -X POST "http://127.0.0.1:8000/auth/login" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "username=user@example.com&password=password"
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables for Production
- Set strong `SECRET_KEY`
- Use production database (PostgreSQL recommended)
- Configure proper logging
- Set up HTTPS

## Logging

The application includes comprehensive console logging:

- **Console Logging**: All log levels displayed in terminal
- **Log Levels**: DEBUG, INFO, WARNING, ERROR, CRITICAL
- **Format**: `timestamp - logger - level - message`

To change log level, modify the console handler level in `app/Core/Logger.py`.

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Follow PEP 8
- Use type hints
- Write docstrings
- Add tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email dipanwita.sen@gyansys.com or create an issue in the repository.

---

**Note**: This is a development version. For production use, ensure proper security configurations and database setup.
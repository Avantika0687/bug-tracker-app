# Bug Tracker App

A simple Bug Tracker application built for learning frontend development, backend API development, SQLite database persistence, and GitHub workflow.

## Project Overview

This project allows different users to manage software bugs through role-based dashboards.

The application supports:

- Tester login
- Developer login
- Manager login
- Create bug
- View bugs
- Edit bug
- Delete bug
- Change bug status
- Developer-wise assigned bug view
- Dashboard bug summary
- FastAPI backend APIs
- SQLite database persistence

## Tech Stack

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Python
- FastAPI
- Uvicorn
- SQLite

### Tools

- VS Code
- Git
- GitHub
- Swagger UI

## Folder Structure

```text
bug-tracker-app
├── backend
│   ├── main.py
│   ├── bugs.db
│   ├── requirements.txt
│   └── venv
├── frontend
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

## User Logins

### Tester

```text
Username: tester
Password: tester123
```

### Developer 1

```text
Username: developer1
Password: developer123
```

### Developer 2

```text
Username: developer2
Password: developer123
```

### Developer 3

```text
Username: developer3
Password: developer123
```

### Manager

```text
Username: manager
Password: manager123
```

## Main Features

### Tester

- Can create bugs
- Can view all bugs
- Can edit bugs
- Can delete bugs
- Can change bug status
- Can assign bugs to developers

### Developer

- Can log in as Developer 1, Developer 2, or Developer 3
- Can view bugs assigned to them
- Can change bug status

### Manager

- Can view all bugs
- Can see dashboard summary

## Bug Status Values

```text
Open
In Progress
Fixed
Closed
```

## Backend APIs

### Health Check

```text
GET /
```

Used to check whether the backend is running.

### Get All Bugs

```text
GET /bugs
```

Returns all bugs from the SQLite database.

### Create Bug

```text
POST /bugs
```

Sample request body:

```json
{
  "title": "Login issue",
  "description": "Login button is not working",
  "severity": "High",
  "priority": "High",
  "assigned_to": "Developer 1"
}
```

### Update Bug

```text
PUT /bugs/{bug_id}
```

Sample request body:

```json
{
  "title": "Login issue updated",
  "description": "Login button does not respond",
  "severity": "Critical",
  "priority": "Urgent",
  "assigned_to": "Developer 2"
}
```

### Update Bug Status

```text
PUT /bugs/{bug_id}/status
```

Sample request body:

```json
{
  "status": "In Progress"
}
```

### Delete Bug

```text
DELETE /bugs/{bug_id}
```

Deletes a bug by ID.

## How to Run Backend

Go to the backend folder:

```powershell
cd backend
```

Activate virtual environment:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies if needed:

```powershell
pip install -r requirements.txt
```

Run backend:

```powershell
uvicorn main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

## How to Run Frontend

Open this file in browser:

```text
frontend/index.html
```

Make sure the backend is running before using frontend API features.

## Database

The project uses SQLite.

Database file:

```text
backend/bugs.db
```

This stores bugs permanently, so bug data remains available after backend restart.

## Current Status

Completed:

- Frontend UI
- Role-based login
- Bug creation
- Bug listing
- Bug editing
- Bug deletion
- Status update
- Developer assigned bug filtering
- Dashboard summary
- FastAPI backend
- SQLite database
- Frontend connected to backend API
- GitHub repository setup

## Future Improvements

Possible future improvements:

- Better UI styling
- Search and filter bugs
- API error handling
- Real user authentication
- Store users in database
- Playwright automation tests
- GitHub Actions CI/CD pipeline
- Deployment to cloud platform
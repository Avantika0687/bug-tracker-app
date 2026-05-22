from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_NAME = "bugs.db"


def get_db_connection():
    connection = sqlite3.connect(DATABASE_NAME)
    connection.row_factory = sqlite3.Row
    return connection


def create_bugs_table():
    connection = get_db_connection()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS bugs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            severity TEXT NOT NULL,
            priority TEXT NOT NULL,
            assigned_to TEXT NOT NULL,
            created_by TEXT NOT NULL,
            status TEXT NOT NULL
        )
    """)

    connection.commit()
    connection.close()


create_bugs_table()


class BugCreate(BaseModel):
    title: str
    description: str
    severity: str
    priority: str
    assigned_to: str


class BugUpdate(BaseModel):
    title: str
    description: str
    severity: str
    priority: str
    assigned_to: str


class BugStatusUpdate(BaseModel):
    status: str


@app.get("/")
def home():
    return {"message": "Bug Tracker Backend is running"}


@app.get("/bugs")
def get_bugs():
    connection = get_db_connection()

    rows = connection.execute("SELECT * FROM bugs").fetchall()

    connection.close()

    bugs = []

    for row in rows:
        bugs.append(dict(row))

    return bugs


@app.post("/bugs")
def create_bug(bug: BugCreate):
    connection = get_db_connection()

    cursor = connection.execute(
        """
        INSERT INTO bugs (title, description, severity, priority, assigned_to, created_by, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            bug.title,
            bug.description,
            bug.severity,
            bug.priority,
            bug.assigned_to,
            "Tester",
            "Open"
        )
    )

    connection.commit()

    new_bug_id = cursor.lastrowid

    connection.close()

    return {
        "id": new_bug_id,
        "title": bug.title,
        "description": bug.description,
        "severity": bug.severity,
        "priority": bug.priority,
        "assigned_to": bug.assigned_to,
        "created_by": "Tester",
        "status": "Open"
    }


@app.put("/bugs/{bug_id}")
def update_bug(bug_id: int, updated_bug: BugUpdate):
    connection = get_db_connection()

    existing_bug = connection.execute(
        "SELECT * FROM bugs WHERE id = ?",
        (bug_id,)
    ).fetchone()

    if existing_bug is None:
        connection.close()
        return {"message": "Bug not found"}

    connection.execute(
        """
        UPDATE bugs
        SET title = ?, description = ?, severity = ?, priority = ?, assigned_to = ?
        WHERE id = ?
        """,
        (
            updated_bug.title,
            updated_bug.description,
            updated_bug.severity,
            updated_bug.priority,
            updated_bug.assigned_to,
            bug_id
        )
    )

    connection.commit()

    updated_row = connection.execute(
        "SELECT * FROM bugs WHERE id = ?",
        (bug_id,)
    ).fetchone()

    connection.close()

    return dict(updated_row)


@app.put("/bugs/{bug_id}/status")
def update_bug_status(bug_id: int, status_update: BugStatusUpdate):
    connection = get_db_connection()

    existing_bug = connection.execute(
        "SELECT * FROM bugs WHERE id = ?",
        (bug_id,)
    ).fetchone()

    if existing_bug is None:
        connection.close()
        return {"message": "Bug not found"}

    connection.execute(
        """
        UPDATE bugs
        SET status = ?
        WHERE id = ?
        """,
        (
            status_update.status,
            bug_id
        )
    )

    connection.commit()

    updated_row = connection.execute(
        "SELECT * FROM bugs WHERE id = ?",
        (bug_id,)
    ).fetchone()

    connection.close()

    return dict(updated_row)


@app.delete("/bugs/{bug_id}")
def delete_bug(bug_id: int):
    connection = get_db_connection()

    existing_bug = connection.execute(
        "SELECT * FROM bugs WHERE id = ?",
        (bug_id,)
    ).fetchone()

    if existing_bug is None:
        connection.close()
        return {"message": "Bug not found"}

    connection.execute(
        "DELETE FROM bugs WHERE id = ?",
        (bug_id,)
    )

    connection.commit()
    connection.close()

    return {"message": "Bug deleted successfully"}
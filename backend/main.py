"""
Extempore Olympiad — FastAPI backend entry point.

Run locally:
    uvicorn main:app --reload --port 8000
"""

import uuid

from fastapi import Depends, FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Submission

app = FastAPI(
    title="Extempore Olympiad API",
    description="Backend for student audio submission and grading.",
    version="0.1.0",
)

# Allow the Vite dev server to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def create_tables() -> None:
    """Auto-create ORM tables in MySQL on application startup."""
    Base.metadata.create_all(bind=engine)


@app.get("/")
def health_check():
    """Simple health endpoint to verify the API is running."""
    return {"status": "ok", "message": "Extempore Olympiad API is running"}


@app.post("/api/submit-exam/")
async def submit_exam(
    grade_level: str = Form(...),
    round_number: int = Form(...),
    audio_file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Accept a single round audio recording and persist it to MySQL.

    Form fields:
        - grade_level: e.g. "Class 6"
        - round_number: 1, 2, or 3
        - audio_file: WebM/MP3 audio blob from the student's microphone
    """
    if round_number not in (1, 2, 3):
        raise HTTPException(
            status_code=400,
            detail="round_number must be 1, 2, or 3",
        )

    audio_bytes = await audio_file.read()
    if not audio_bytes:
        raise HTTPException(status_code=400, detail="audio_file is empty")

    submission = Submission(
        # Auto-generated until the frontend sends a stable student identifier.
        student_id=str(uuid.uuid4()),
        grade_level=grade_level,
        round_number=round_number,
        audio_data=audio_bytes,
    )

    db.add(submission)
    db.commit()
    db.refresh(submission)

    return {
        "message": "Submission saved successfully",
        "submission_id": submission.id,
        "student_id": submission.student_id,
        "grade_level": submission.grade_level,
        "round_number": submission.round_number,
        "audio_size_bytes": len(audio_bytes),
    }

"""
Extempore Olympiad — FastAPI backend entry point.

Run locally:
    uvicorn main:app --reload --port 8000
"""

import uuid
from pathlib import Path
from typing import Optional

from fastapi import BackgroundTasks, Depends, FastAPI, File, Form, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Submission
from transcription import transcribe_audio_task

BASE_DIR = Path(__file__).resolve().parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

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

app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")


@app.on_event("startup")
def create_tables() -> None:
    """Auto-create ORM tables in MySQL on application startup."""
    Base.metadata.create_all(bind=engine)
    _sync_submission_schema()


def _sync_submission_schema() -> None:
    inspector = inspect(engine)
    if "submissions" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("submissions")}
    column_definitions = {
        "audio_url": "ALTER TABLE submissions ADD COLUMN audio_url VARCHAR(255) NOT NULL AFTER round_number",
        "transcript": "ALTER TABLE submissions ADD COLUMN transcript TEXT NULL AFTER audio_url",
        "ai_feedback": "ALTER TABLE submissions ADD COLUMN ai_feedback TEXT NULL AFTER transcript",
        "ai_score": "ALTER TABLE submissions ADD COLUMN ai_score FLOAT NULL AFTER ai_feedback",
        "final_score": "ALTER TABLE submissions ADD COLUMN final_score FLOAT NULL AFTER ai_score",
        "status": "ALTER TABLE submissions ADD COLUMN status VARCHAR(32) NOT NULL DEFAULT 'PENDING' AFTER final_score",
    }

    with engine.begin() as connection:
        for column_name, alter_statement in column_definitions.items():
            if column_name not in existing_columns:
                connection.execute(text(alter_statement))

        if "audio_data" in existing_columns:
            connection.execute(
                text(
                    "ALTER TABLE submissions MODIFY COLUMN audio_data LONGBLOB NULL DEFAULT NULL"
                )
            )


@app.get("/")
def health_check():
    """Simple health endpoint to verify the API is running."""
    return {"status": "ok", "message": "Extempore Olympiad API is running"}


@app.get("/api/submissions")
def list_submissions(db: Session = Depends(get_db)):
    """Return all submissions with the most recent rows first."""
    submissions = db.query(Submission).order_by(Submission.id.desc()).all()
    return [submission.to_dict() for submission in submissions]


class SubmissionUpdate(BaseModel):
    status: Optional[str] = None
    final_score: Optional[float] = None
    ai_feedback: Optional[str] = None
    transcript: Optional[str] = None
    ai_score: Optional[float] = None


@app.patch("/api/submissions/{submission_id}")
def update_submission(
    submission_id: int,
    payload: SubmissionUpdate,
    db: Session = Depends(get_db),
):
    """Update review fields for a submission and persist them in MySQL."""
    submission = db.get(Submission, submission_id)
    if submission is None:
        raise HTTPException(status_code=404, detail="Submission not found")

    if payload.status is not None:
        submission.status = payload.status.strip().upper()
    if payload.final_score is not None:
        submission.final_score = payload.final_score
    if payload.ai_feedback is not None:
        submission.ai_feedback = payload.ai_feedback.strip()
    if payload.transcript is not None:
        submission.transcript = payload.transcript.strip()
    if payload.ai_score is not None:
        submission.ai_score = payload.ai_score

    db.commit()
    db.refresh(submission)
    return submission.to_dict()


def _pick_upload_field(
    audio: Optional[UploadFile], audio_file: Optional[UploadFile]
) -> UploadFile:
    upload = audio or audio_file
    if upload is None:
        raise HTTPException(status_code=400, detail="An audio file is required")
    return upload


def _build_audio_url(request: Request, filename: str) -> str:
    base_url = str(request.base_url).rstrip("/")
    return f"{base_url}/uploads/{filename}"


def _save_audio_file(upload: UploadFile) -> str:
    original_name = upload.filename or "recording.webm"
    suffix = Path(original_name).suffix.lower()
    if suffix not in {".webm", ".wav", ".mp3", ".ogg", ".m4a", ".mp4"}:
        suffix = ".webm"

    filename = f"{uuid.uuid4().hex}{suffix}"
    file_path = UPLOAD_DIR / filename

    upload.file.seek(0)
    with file_path.open("wb") as destination:
        destination.write(upload.file.read())

    return filename


def _create_submission_record(
    *,
    db: Session,
    request: Request,
    student_id: str,
    grade_level: str,
    round_number: int,
    upload: UploadFile,
):
    if not student_id.strip():
        raise HTTPException(status_code=400, detail="student_id is required")
    if not grade_level.strip():
        raise HTTPException(status_code=400, detail="grade_level is required")
    if round_number <= 0:
        raise HTTPException(status_code=400, detail="round_number must be positive")

    filename = _save_audio_file(upload)
    audio_url = _build_audio_url(request, filename)
    file_path = UPLOAD_DIR / filename

    submission = Submission(
        student_id=student_id.strip(),
        grade_level=grade_level.strip(),
        round_number=round_number,
        audio_url=audio_url,
        transcript=None,
        ai_feedback=None,
        ai_score=None,
        final_score=None,
        status="PENDING",
    )

    try:
        db.add(submission)
        db.commit()
        db.refresh(submission)
    except Exception:
        db.rollback()
        file_path = UPLOAD_DIR / filename
        if file_path.exists():
            file_path.unlink()
        raise

    return submission, file_path


@app.post("/api/submissions")
@app.post("/api/submit-exam/")
async def submit_submission(
    background_tasks: BackgroundTasks,
    request: Request,
    student_id: str = Form(...),
    grade_level: str = Form(...),
    round_number: int = Form(...),
    audio: Optional[UploadFile] = File(None),
    audio_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    """
    Accept a round audio recording and persist it to MySQL.

    The endpoint accepts either `audio` or the legacy `audio_file` field.
    """
    upload = _pick_upload_field(audio, audio_file)
    submission, file_path = _create_submission_record(
        db=db,
        request=request,
        student_id=student_id,
        grade_level=grade_level,
        round_number=round_number,
        upload=upload,
    )
    background_tasks.add_task(transcribe_audio_task, submission.id, str(file_path))
    return submission.to_dict()

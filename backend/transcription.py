"""
Background audio transcription helpers for Extempore Olympiad.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Submission

# Load environment variables
backend_dir = Path(__file__).resolve().parent
dotenv_path = backend_dir.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)


def transcribe_audio_task(submission_id: int, file_path: str) -> None:
    """
    Transcribe an uploaded audio file and persist the transcript to MySQL.
    """
    audio_path = Path(file_path)
    if not audio_path.exists():
        return

    # Initialize OpenAI client (lazy load to prevent import errors if API key is missing on startup)
    client = OpenAI()

    try:
        with open(audio_path, "rb") as audio_file:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format="text"
            )
        transcript = (transcript or "").strip()
    except Exception as e:
        print(f"❌ Error transcribing submission {submission_id} via Whisper API: {e}")
        # Mark submission status as failed or raise depending on preference
        db: Session = SessionLocal()
        try:
            submission = db.get(Submission, submission_id)
            if submission:
                submission.status = "FAILED"
                db.commit()
        except Exception:
            db.rollback()
        finally:
            db.close()
        raise

    db: Session = SessionLocal()
    try:
        submission = db.get(Submission, submission_id)
        if submission is None:
            return

        submission.transcript = transcript
        # Update status if necessary, e.g. from PENDING to COMPLETED or leave it to other agents
        # Here we just save the transcript
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
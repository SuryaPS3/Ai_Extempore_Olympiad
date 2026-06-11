"""
Background audio transcription helpers for Extempore Olympiad.
"""

from functools import lru_cache
from pathlib import Path

from sqlalchemy.orm import Session

from database import SessionLocal
from models import Submission


@lru_cache(maxsize=1)
def _get_whisper_model():
    import whisper

    return whisper.load_model("base")


def transcribe_audio_task(submission_id: int, file_path: str) -> None:
    """
    Transcribe an uploaded audio file and persist the transcript to MySQL.
    """
    audio_path = Path(file_path)
    if not audio_path.exists():
        return

    model = _get_whisper_model()
    result = model.transcribe(str(audio_path))
    transcript = (result.get("text") or "").strip()

    db: Session = SessionLocal()
    try:
        submission = db.get(Submission, submission_id)
        if submission is None:
            return

        submission.transcript = transcript
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
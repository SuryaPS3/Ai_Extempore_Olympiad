"""
SQLAlchemy ORM models for the Extempore Olympiad platform.
"""

from sqlalchemy import Column, Integer, LargeBinary, String

from database import Base


class Submission(Base):
    """
    Stores a single round audio response submitted by a student.

    Each exam attempt may produce up to three Submission rows
    (one per round: Warm Up, Creative, Challenge).
    """

    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(64), nullable=False, index=True)
    grade_level = Column(String(32), nullable=False)
    round_number = Column(Integer, nullable=False)
    # LONGBLOB-compatible column for raw WebM/MP3 audio bytes.
    audio_data = Column(LargeBinary, nullable=False)

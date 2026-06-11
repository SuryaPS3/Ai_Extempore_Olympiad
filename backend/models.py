"""
SQLAlchemy ORM models for the Extempore Olympiad platform.
"""

from sqlalchemy import Column, Float, Integer, String, Text

from database import Base


class Submission(Base):
    """
    Stores a single round audio response submitted by a student.
    """

    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    student_id = Column(String(64), nullable=False, index=True)
    grade_level = Column(String(32), nullable=False)
    round_number = Column(Integer, nullable=False)
    audio_url = Column(String(255), nullable=False)
    transcript = Column(Text, nullable=True)
    ai_feedback = Column(Text, nullable=True)
    ai_score = Column(Float, nullable=True)
    final_score = Column(Float, nullable=True)
    status = Column(String(32), nullable=False, default="PENDING")

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "student_id": self.student_id,
            "grade_level": self.grade_level,
            "round_number": self.round_number,
            "audio_url": self.audio_url,
            "transcript": self.transcript,
            "ai_feedback": self.ai_feedback,
            "ai_score": self.ai_score,
            "final_score": self.final_score,
            "status": self.status,
        }

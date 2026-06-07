"""
Database configuration for the Extempore Olympiad API.

Uses a synchronous SQLAlchemy engine connected to the local MySQL
instance (extempore_db).
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# MySQL connection string for local development.
DATABASE_URL = (
    "mysql+pymysql://root:password123@localhost:3306/extempore_db"
)

# Synchronous engine — suitable for standard FastAPI dependency injection.
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
)

# Factory for request-scoped database sessions.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for SQLAlchemy ORM models.
Base = declarative_base()


def get_db():
    """
    Yield a database session and ensure it is closed after the request.
    Use with FastAPI Depends(get_db).
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

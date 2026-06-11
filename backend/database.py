"""
Database configuration for the Extempore Olympiad API.

Uses a synchronous SQLAlchemy engine connected to a local MySQL
instance. Defaults are provided for development, but the connection can
be overridden with environment variables.
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


def _build_database_url() -> str:
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        return database_url

    mysql_user = os.getenv("MYSQL_USER", "root")
    mysql_password = os.getenv("MYSQL_PASSWORD", "password123")
    mysql_host = os.getenv("MYSQL_HOST", "localhost")
    mysql_port = os.getenv("MYSQL_PORT", "3306")
    mysql_database = os.getenv("MYSQL_DATABASE", "extempore_db")

    return (
        f"mysql+pymysql://{mysql_user}:{mysql_password}"
        f"@{mysql_host}:{mysql_port}/{mysql_database}"
    )


DATABASE_URL = _build_database_url()

# Synchronous engine suitable for standard FastAPI dependency injection.
engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)

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

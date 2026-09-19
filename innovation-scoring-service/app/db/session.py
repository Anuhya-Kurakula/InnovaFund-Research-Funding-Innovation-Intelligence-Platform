"""
Database Session Management
Provides SQLAlchemy engine, sessionmaker, and get_db dependency.
Auto-creates tables on startup for SQLite environments.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings
from app.db.models import Base

try:
    from database import engine as db_engine, SessionLocal as db_SessionLocal, get_db as db_get_db
    engine = db_engine
    SessionLocal = db_SessionLocal
    get_db = db_get_db
except Exception:
    database_url = settings.DATABASE_URL
    connect_args = {}
    if database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    engine = create_engine(
        database_url,
        connect_args=connect_args,
        pool_pre_ping=True
    )
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

    def get_db():
        db = SessionLocal()
        try:
            yield db
        finally:
            db.close()

def init_db(target_engine=None):
    """Initializes tables for standalone execution and SQLite environments."""
    from app.db.models import Base
    eng = target_engine or engine
    Base.metadata.create_all(bind=eng)

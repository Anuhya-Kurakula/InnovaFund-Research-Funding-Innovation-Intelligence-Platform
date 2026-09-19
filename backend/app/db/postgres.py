from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from app.core.config import get_settings

class Base(DeclarativeBase):
    pass

settings = get_settings()
engine = create_engine(settings.database_url, pool_pre_ping=True, connect_args={"check_same_thread": False} if settings.database_url.startswith("sqlite") else {})
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from sqlalchemy import inspect, text

def init_db():
    import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    try:
        inspector = inspect(engine)
        if "funding_opportunities" in inspector.get_table_names():
            columns = [c["name"] for c in inspector.get_columns("funding_opportunities")]
            if "source_type" not in columns:
                with engine.begin() as conn:
                    conn.execute(text("DROP TABLE IF EXISTS profile_funding CASCADE;"))
                    conn.execute(text("DROP TABLE IF EXISTS funding_opportunities CASCADE;"))
                Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database schema auto-check note: {e}")

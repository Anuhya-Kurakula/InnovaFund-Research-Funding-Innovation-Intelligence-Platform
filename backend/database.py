import logging
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from pymongo import MongoClient
from app.db.postgres import Base, engine, SessionLocal, get_db
try:
    from config import settings
except ImportError:
    from app.core.config import settings

logger = logging.getLogger(__name__)

def auto_migrate_schema(target_engine):
    """Auto-healing schema migration for developer SQLite & PostgreSQL environments"""
    try:
        with target_engine.connect() as conn:
            # Check source_id on funding_opportunities
            try:
                conn.execute(text("SELECT source_id FROM funding_opportunities LIMIT 1"))
            except Exception:
                try:
                    conn.execute(text("ALTER TABLE funding_opportunities ADD COLUMN source_id INTEGER REFERENCES funding_sources(id) ON DELETE SET NULL"))
                    if hasattr(conn, 'commit'):
                        conn.commit()
                    logger.info("Auto-healing schema migration: Successfully added 'source_id' column to funding_opportunities.")
                except Exception as ex:
                    logger.debug(f"Migration note source_id: {ex}")

            # Check source_type on funding_sources
            try:
                conn.execute(text("SELECT source_type FROM funding_sources LIMIT 1"))
            except Exception:
                try:
                    conn.execute(text("ALTER TABLE funding_sources ADD COLUMN source_type VARCHAR(100) DEFAULT 'Grant'"))
                    if hasattr(conn, 'commit'):
                        conn.commit()
                    logger.info("Auto-healing schema migration: Successfully added 'source_type' column to funding_sources.")
                except Exception as ex:
                    logger.debug(f"Migration note source_type: {ex}")
    except Exception:
        pass

auto_migrate_schema(engine)

# MongoDB PyMongo Client
try:
    mongo_client = MongoClient(settings.MONGO_URL, serverSelectionTimeoutMS=1000)
    mongo_client.admin.command('ping')
    mongo_db = mongo_client[settings.MONGO_DB_NAME]
    logger.info("Connected to MongoDB database successfully.")
except Exception:
    logger.info("MongoDB service not detected on port 27017. Running in standalone SQLite mode.")
    mongo_client = None
    mongo_db = None

def get_mongo_db():
    return mongo_db

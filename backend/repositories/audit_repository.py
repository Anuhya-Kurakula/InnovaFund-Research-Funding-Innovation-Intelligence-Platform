from sqlalchemy.orm import Session
from typing import Optional, List
from models import AuditLog
from database import get_mongo_db

class AuditRepository:
    def __init__(self, db: Session):
        self.db = db
        self.mongo_db = get_mongo_db()

    def log_action(self, user_id: Optional[int], action: str, resource: str, details: Optional[str] = None) -> AuditLog:
        # Save to PostgreSQL
        log_entry = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            details=details
        )
        self.db.add(log_entry)
        self.db.commit()
        self.db.refresh(log_entry)

        # Dual save to MongoDB document store for high-throughput security event stream
        if self.mongo_db is not None:
            try:
                self.mongo_db["audit_events"].insert_one({
                    "pg_log_id": log_entry.id,
                    "user_id": user_id,
                    "action": action,
                    "resource": resource,
                    "details": details,
                    "timestamp": log_entry.created_at.isoformat() if log_entry.created_at else None
                })
            except Exception:
                pass

        return log_entry

    def list_logs(self, skip: int = 0, limit: int = 100) -> List[AuditLog]:
        return self.db.query(AuditLog).order_by(AuditLog.created_at.desc()).offset(skip).limit(limit).all()

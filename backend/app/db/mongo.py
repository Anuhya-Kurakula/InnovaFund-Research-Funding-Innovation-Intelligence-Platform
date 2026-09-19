from app.core.config import get_settings
try:
    from pymongo import MongoClient
except ImportError:
    MongoClient = None
settings = get_settings()
_client = None
def get_mongo_client():
    global _client
    if MongoClient is None: raise RuntimeError("pymongo is not installed")
    if _client is None: _client = MongoClient(settings.mongodb_url, serverSelectionTimeoutMS=1500)
    return _client
def get_mongo_db(): return get_mongo_client()[settings.mongodb_database]
def ping_mongo():
    try:
        if MongoClient is None: return False
        get_mongo_client().admin.command("ping"); return True
    except Exception: return False

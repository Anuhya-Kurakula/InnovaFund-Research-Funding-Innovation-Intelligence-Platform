from datetime import datetime, timedelta, timezone
from typing import Optional
import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

try:
    from config import settings
except ImportError:
    from app.core.config import settings

ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return ph.verify(hashed_password, plain_password)
    except (VerifyMismatchError, ValueError, Exception):
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=getattr(settings, 'ACCESS_TOKEN_EXPIRE_MINUTES', getattr(settings, 'access_token_expire_minutes', 1440)))
    to_encode.update({"exp": expire})
    secret = getattr(settings, 'SECRET_KEY', getattr(settings, 'jwt_secret', 'dev-secret-key-innovafund-2026'))
    algo = getattr(settings, 'ALGORITHM', getattr(settings, 'jwt_algorithm', 'HS256'))
    return jwt.encode(to_encode, secret, algorithm=algo)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        secret = getattr(settings, 'SECRET_KEY', getattr(settings, 'jwt_secret', 'dev-secret-key-innovafund-2026'))
        algo = getattr(settings, 'ALGORITHM', getattr(settings, 'jwt_algorithm', 'HS256'))
        payload = jwt.decode(token, secret, algorithms=[algo])
        return payload
    except Exception:
        return None
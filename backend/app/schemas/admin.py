from pydantic import BaseModel
from app.models.user import Role
class RoleUpdate(BaseModel):
    role: Role
class UserStatusUpdate(BaseModel):
    is_active: bool

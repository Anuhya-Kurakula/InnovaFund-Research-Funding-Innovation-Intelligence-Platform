import os,sys
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from app.db.postgres import SessionLocal, init_db
from app.models.user import User, Role
from app.models.profile import UserProfile
from app.core.security import hash_password
init_db()
email=os.environ.get('ADMIN_EMAIL'); password=os.environ.get('ADMIN_PASSWORD'); name=os.environ.get('ADMIN_NAME','Platform Administrator')
if not email or not password: raise SystemExit('Set ADMIN_EMAIL and ADMIN_PASSWORD in your shell; do not commit them.')
db=SessionLocal()
try:
    u=db.query(User).filter(User.email==email.lower()).first()
    if u: u.role=Role.ADMINISTRATOR;u.is_active=True
    else:
        u=User(email=email.lower(),full_name=name,password_hash=hash_password(password),role=Role.ADMINISTRATOR);u.profile=UserProfile();db.add(u)
    db.commit();print('Administrator ready:',u.email)
finally: db.close()

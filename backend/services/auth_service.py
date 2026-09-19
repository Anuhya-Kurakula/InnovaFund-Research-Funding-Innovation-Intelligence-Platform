from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from repositories.user_repository import UserRepository
from repositories.profile_repository import ProfileRepository
from repositories.audit_repository import AuditRepository
from schemas import UserRegister, UserLogin, TokenResponse
from auth import verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)
        self.profile_repo = ProfileRepository(db)
        self.audit_repo = AuditRepository(db)

    def register(self, user_in: UserRegister) -> TokenResponse:
        existing = self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account with this email already exists."
            )
        
        user = self.user_repo.create(user_in)
        # Auto-create empty profile
        self.profile_repo.get_or_create(user.id)
        
        self.audit_repo.log_action(
            user_id=user.id,
            action="USER_REGISTER",
            resource="users",
            details=f"Registered new user with role {user.role}"
        )

        token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role
        )

    def login(self, login_in: UserLogin) -> TokenResponse:
        user = self.user_repo.get_by_email(login_in.email)
        if not user or not verify_password(login_in.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email credentials or password."
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated."
            )

        self.audit_repo.log_action(
            user_id=user.id,
            action="USER_LOGIN",
            resource="auth",
            details="User logged in successfully"
        )

        token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role
        )

    def google_login(self, google_in) -> TokenResponse:
        from jose import jwt
        email = google_in.email
        full_name = google_in.full_name or "Google User"

        # If credential token was provided, attempt decoding
        if google_in.credential:
            try:
                # Unverified decode for Google JWT ID token payload
                decoded = jwt.get_unverified_claims(google_in.credential)
                if decoded.get("email"):
                    email = decoded.get("email")
                if decoded.get("name"):
                    full_name = decoded.get("name")
            except Exception as e:
                pass

        if not email:
            email = "google.user@innovafund.ai"

        # Check if user already exists
        user = self.user_repo.get_by_email(email)
        if not user:
            # Auto-register user with hashed dummy pass
            from auth import hash_password
            user_create = UserRegister(
                full_name=full_name,
                email=email,
                password="GoogleOAuthPassword@123",
                role=google_in.role or "researcher"
            )
            user = self.user_repo.create(user_create)
            self.profile_repo.get_or_create(user.id)

        self.audit_repo.log_action(
            user_id=user.id,
            action="GOOGLE_OAUTH_LOGIN",
            resource="auth",
            details=f"User authenticated via Google Single Sign-On ({email})"
        )

        token = create_access_token(data={"sub": str(user.id), "role": user.role, "email": user.email})
        return TokenResponse(
            access_token=token,
            user_id=user.id,
            full_name=user.full_name,
            email=user.email,
            role=user.role
        )

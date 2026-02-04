from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.user import User
from app.schemas.user import UserCreate


def get_user_by_email(session: Session, email: str) -> User | None:
    return session.query(User).filter(User.email == email).first()


def create_user(session: Session, user_in: UserCreate) -> User:
    user = User(
        name=user_in.name,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role=user_in.role,
    )
    session.add(user)
    try:
        session.commit()
        session.refresh(user)
    except Exception:
        session.rollback()
        raise
    return user


def list_users(session: Session) -> list[User]:
    return session.query(User).order_by(User.id.asc()).all()

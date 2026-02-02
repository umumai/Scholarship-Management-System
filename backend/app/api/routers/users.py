from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_user, require_role
from app.crud.users import create_user, get_user_by_email, list_users
from app.schemas.user import UserCreate, UserPublic

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserPublic)
def get_me(current_user=Depends(get_current_user)) -> UserPublic:
    return current_user


@router.get("/", response_model=list[UserPublic])
def get_users(
    db: Session = Depends(get_db),
    _admin=Depends(require_role("admin")),
) -> list[UserPublic]:
    return list_users(db)


@router.get("/role/{role}", response_model=list[UserPublic])
def get_users_by_role(
    role: str,
    db: Session = Depends(get_db),
    _staff=Depends(require_role("committee", "admin")),
) -> list[UserPublic]:
    return [user for user in list_users(db) if user.role == role]


@router.post("/", response_model=UserPublic)
def create_user_account(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    _admin=Depends(require_role("admin")),
) -> UserPublic:
    existing = get_user_by_email(db, user_in.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_user(db, user_in)

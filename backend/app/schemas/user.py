from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "student"


class UserCreate(UserBase):
    password: str


class UserPublic(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

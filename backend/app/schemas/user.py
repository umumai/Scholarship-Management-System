from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(..., max_length=120)
    email: EmailStr = Field(..., max_length=255)
    role: str = Field(default="student", max_length=30)


class UserCreate(UserBase):
    password: str = Field(..., max_length=255)


class UserPublic(UserBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# app/db/schemas/users.py

from pydantic import BaseModel, Field
from datetime import datetime, timezone


class UserBase(BaseModel):
    email: str
    username: str
    password: str


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str | None = None
    is_verified: bool | None = None


class UserSchemas(UserBase):
    user_id: int
    is_verified: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str

class UserSignUp(UserBase):
    pass

class UserResponse(BaseModel):
    email: str
    username: str
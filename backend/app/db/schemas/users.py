from zoneinfo import ZoneInfo
from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime, date, timezone


class UserBase(BaseModel):
    email: str
    username: str
    password: str
    gender: str | None = None
    birthdate: date | None = None
    profile_url: HttpUrl | None = None  # 프로필 사진 URL (유효한 URL인지 검증)


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    email: str | None = None
    username: str | None = None
    password: str | None = None
    is_verified: bool | None = None
    gender: str | None = None
    birthdate: date | None = None
    profile_url: HttpUrl | None = None
    refresh_token: str | None = None


class UserSchemas(UserBase):
    user_id: int
    is_verified: bool = False
    refresh_token: str | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(ZoneInfo("Asia/Seoul"))
    )

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


class profileResponse(BaseModel):
    email: str
    username: str
    gender: str | None = None
    birthdate: date | None = None
    profile_url: HttpUrl | None = None


class profileUpdate(BaseModel):
    username: str | None = None
    gender: str | None = None
    birthdate: date | None = None
    profile_url: HttpUrl | None = None

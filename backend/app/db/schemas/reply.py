from pydantic import BaseModel
from datetime import datetime


class ReplyBase(BaseModel):
    comment_id: int
    content: str


class ReplyCreate(ReplyBase):
    pass


class ReplyUpdate(BaseModel):
    reply_id: int
    content: str


class ReplySchemas(ReplyBase):
    reply_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ReplyResponse(ReplySchemas):
    username: str
    like_count: int = 0
    has_liked: bool = False

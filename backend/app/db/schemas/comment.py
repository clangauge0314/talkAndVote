from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    topic_id: int
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    user_id: int
    comment_id: int
    created_at: datetime

    class Config:
        from_attributes = True
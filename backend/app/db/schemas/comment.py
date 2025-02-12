from pydantic import BaseModel
from datetime import datetime

class CommentBase(BaseModel):
    user_id: int
    topic_id: int
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    comment_id: int
    created_at: datetime

    class Config:
        from_attributes = True
from pydantic import BaseModel
from datetime import datetime

from app.db.schemas.reply import ReplyResponse

class CommentBase(BaseModel):
    topic_id: int
    content: str

class CommentCreate(CommentBase):
    pass



class CommentSchemas(CommentBase):
    user_id: int
    comment_id: int
    created_at: datetime

    class Config:
        from_attributes = True
        
class CommentResponse(CommentSchemas):
    username: str
    like_count: int = 0
    has_liked: bool = False
    reply: list[ReplyResponse]

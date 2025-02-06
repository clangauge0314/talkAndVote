from pydantic import BaseModel
from datetime import datetime

# Topic (투표 주제)
class TopicBase(BaseModel):
    title: str
    description: str | None = None

class TopicCreate(TopicBase):
    pass

class TopicResponse(TopicBase):
    topic_id: int
    created_at: datetime

    class Config:
        from_attributes = True

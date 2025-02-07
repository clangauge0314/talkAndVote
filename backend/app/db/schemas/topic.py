from pydantic import BaseModel
from datetime import datetime

# Topic (투표 주제)
class TopicBase(BaseModel):
    title: str
    vote_option: list[str]
    description: str | None = None

class TopicCreate(TopicBase):
    pass

class TopicSchemas(TopicBase):
    topic_id: int
    created_at: datetime

    class Config:
        from_attributes = True
        
class TopicResponse(TopicSchemas):
    vote: int | None = None

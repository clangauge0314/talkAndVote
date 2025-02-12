from pydantic import BaseModel
from datetime import datetime

# Topic (투표 주제)
class TopicBase(BaseModel):
    title: str
    category: str = "기타"
    vote_options: list[str]
    description: str | None = None

class TopicCreate(TopicBase):
    pass

class TopicSchemas(TopicBase):
    topic_id: int
    created_at: datetime
    user_id: int

    class Config:
        from_attributes = True
        
class TopicResponse(TopicSchemas):
    user_id: int
    has_voted: bool = False
    user_vote_index: int | None = None
    like_count: int = 0
    has_liked: bool = False
    vote_results: list[int] = []
    total_vote: int = 0

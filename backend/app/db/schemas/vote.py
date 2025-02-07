from pydantic import BaseModel
from datetime import datetime

class VoteBase(BaseModel):
    topic_id: int
    vote_index: int
    user_id: int

class VoteCreate(VoteBase):
    pass

class VoteResponse(VoteBase):
    vote_id: int
    created_at: datetime

    class Config:
        from_attributes = True
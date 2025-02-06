from pydantic import BaseModel
from datetime import datetime

class VoteBase(BaseModel):
    topic_id: int
    vote_option: str

class VoteCreate(VoteBase):
    pass

class VoteResponse(VoteBase):
    vote_id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
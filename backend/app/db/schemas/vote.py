from pydantic import BaseModel
from datetime import datetime

# ✅ 투표 기본 스키마
class VoteBase(BaseModel):
    topic_id: int
    vote_index: int

# ✅ 투표 생성 요청 스키마
class VoteCreate(VoteBase):
    pass

# ✅ 투표 응답 스키마
class VoteResponse(VoteBase):
    user_id: int
    vote_id: int
    created_at: datetime

    class Config:
        from_attributes = True  # ORM 객체에서 데이터 변환 허용

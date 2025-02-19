from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func, text
from app.db.models import Vote
from app.db.schemas.vote import VoteCreate

class VoteCrud:
    @staticmethod
    async def create(db: AsyncSession, vote_data: VoteCreate, user_id: int):
        vote = Vote(user_id=user_id, **vote_data.model_dump())
        db.add(vote)
        await db.commit()
        await db.refresh(vote)
        return vote

    @staticmethod
    async def get_votes_by_topic(db: AsyncSession, topic_id: int):
        """ 특정 주제의 투표 데이터를 시간별로 가져오기 """
        result = await db.execute(select(Vote).filter(Vote.topic_id == topic_id))
        return result.scalars().all()
    
    @staticmethod
    async def get_votes_by_user(db: AsyncSession, user_id: int):
        result = await db.execute(select(Vote).filter(Vote.user_id == user_id))
        return result.scalars().all()

    # ✅ 특정 유저가 특정 주제에 투표했는지 확인하는 메서드
    @staticmethod
    async def get_vote_by_topic_and_user(db: AsyncSession, topic_id: int, user_id: int):
        result = await db.execute(
            select(Vote).filter((Vote.topic_id == topic_id) & (Vote.user_id == user_id))
        )
        return result.scalar_one_or_none()  # 투표 기록이 없으면 None 반환


    @staticmethod
    async def get_votes_in_range(db: AsyncSession,topic_id:int ,start_time: datetime):
        now = datetime.now(timezone.utc)
        
        query = select(Vote).where(Vote.created_at.between(start_time, now)).filter(Vote.topic_id == topic_id)
        result = await db.execute(query)
        votes = result.scalars().all()
        
        return votes
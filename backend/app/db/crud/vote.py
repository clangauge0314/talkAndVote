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
    async def get_votes_by_topic(db: AsyncSession, topic_id: int, time_range: str | None = None):
        """ 특정 주제의 투표 데이터를 시간별로 가져오기 """

        now = datetime.now(timezone.utc)
        time_map = {
            "1h": now - timedelta(hours=1),
            "6h": now - timedelta(hours=6),
            "1d": now - timedelta(days=1),
            "1w": now - timedelta(weeks=1),
            "1m": now - timedelta(days=30),
        }
        start_time = time_map.get(time_range)

        # ✅ MySQL에서 `date_trunc` 대신 `DATE_FORMAT()` 사용
        query = select(
            text("DATE_FORMAT(votes.created_at, '%Y-%m-%d %H:00:00') AS time"),
            Vote.vote_index,
            func.count(Vote.vote_id).label("vote_count")
        ).where(Vote.topic_id == topic_id)

        # ✅ time_range가 있으면 기간 필터 추가
        if start_time:
            query = query.where(Vote.created_at >= start_time)

        query = query.group_by(text("time"), Vote.vote_index).order_by(text("time"))

        result = await db.execute(query)
        return result.fetchall()
    
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

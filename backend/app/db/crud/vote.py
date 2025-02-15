from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
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
        """ 특정 주제의 투표 내역 조회 (시간 범위 필터링 가능) """

        query = select(Vote).where(Vote.topic_id == topic_id)

        # ✅ 시간 필터링 추가 (time_range가 있을 경우)
        if time_range:
            now = datetime.now(timezone.utc)()
            time_map = {
                "1h": now - timedelta(hours=1),
                "6h": now - timedelta(hours=6),
                "1d": now - timedelta(days=1),
                "1w": now - timedelta(weeks=1),
                "1m": now - timedelta(days=30),
            }
            start_time = time_map.get(time_range)
            if start_time:
                query = query.where(Vote.created_at >= start_time)

        result = await db.execute(query)
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
    async def get_vote_time_series(db: AsyncSession, topic_id: int, start_time: datetime):
        """
        특정 주제(topic_id)의 투표 데이터를 주어진 시간 범위(start_time부터 현재까지) 내에서 그룹화하여 가져옴.
        """
        result = await db.execute(
            select(
                func.date_trunc('hour', Vote.created_at).label("time"),  # ✅ 시간 단위로 그룹화
                Vote.vote_index,
                func.count(Vote.vote_id).label("vote_count")
            )
            .where(Vote.topic_id == topic_id)
            .where(Vote.created_at >= start_time)  # ✅ 선택한 시간 범위 내에서 필터링
            .group_by("time", Vote.vote_index)
            .order_by("time")
        )
        return result.fetchall()
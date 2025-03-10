from datetime import datetime
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.topic import Topic
from app.db.schemas.topic import TopicCreate


class TopicCrud:
    @staticmethod
    async def create(db: AsyncSession, topic_data: TopicCreate, user_id: int) -> Topic:
        topic_dict = topic_data.model_dump()

        # 2. user_id 추가
        topic_dict["user_id"] = user_id

        # 3. SQLAlchemy 모델에 동적 필드 매핑
        new_topic = Topic(**topic_dict)

        # 4. DB에 추가
        db.add(new_topic)
        return new_topic

    @staticmethod
    async def get_all(db: AsyncSession):
        result = await db.execute(select(Topic))
        return result.scalars().all()

    @staticmethod
    async def get(db: AsyncSession, topic_id: int):
        return await db.get(Topic, topic_id)

    @staticmethod
    async def delete(db: AsyncSession, topic_id: int):
        topic = await db.get(Topic, topic_id)
        if topic:
            await db.delete(topic)
            await db.commit()
        return topic

    @staticmethod
    async def get_post_count_by_month(
        db: AsyncSession, user_id: int, start_of_month: datetime
    ) -> int:
        """
        ✅ 특정 유저가 이번 달 작성한 게시물 개수를 조회
        """
        result = await db.execute(
            select(func.count()).where(
                (Topic.user_id == user_id) & (Topic.created_at >= start_of_month)
            )
        )
        return result.scalar() or 0  # 만약 None이면 0 반환

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.topic import Topic
from app.db.schemas.topic import TopicCreate

class TopicCrud:
    @staticmethod
    async def create(db: AsyncSession, topic_data: TopicCreate):
        topic = Topic(**topic_data.model_dump())
        db.add(topic)
        await db.commit()
        await db.refresh(topic)
        return topic

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
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
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
        result = await db.execute(select(Vote).filter(Vote.topic_id == topic_id))
        return result.scalars().all()
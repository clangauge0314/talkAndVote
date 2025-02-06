from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Comment
from app.db.schemas.comment import CommentCreate

class CommentCrud:
    @staticmethod
    async def create(db: AsyncSession, comment_data: CommentCreate, user_id: int):
        comment = Comment(user_id=user_id, **comment_data.model_dump())
        db.add(comment)
        await db.commit()
        await db.refresh(comment)
        return comment

    @staticmethod
    async def get_by_topic(db: AsyncSession, topic_id: int):
        result = await db.execute(select(Comment).filter(Comment.topic_id == topic_id))
        return result.scalars().all()

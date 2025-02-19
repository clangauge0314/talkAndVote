from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Reply
from app.db.schemas.reply import ReplyCreate

class ReplyCrud:
    @staticmethod
    async def create(db: AsyncSession, reply_data: ReplyCreate, user_id: int):
        reply = Reply(user_id=user_id, **reply_data.model_dump())
        db.add(reply)
        await db.commit()
        await db.refresh(reply)
        return reply
    
    @staticmethod
    async def get_by_comment(db: AsyncSession, comment_id: int):
        result = await db.execute(select(Reply).filter(Reply.comment_id == comment_id))
        return result.scalars().all()

    @staticmethod
    async def delete(db: AsyncSession, reply_id: int):
        comment = await db.get(Reply, reply_id)
        if comment:
            await db.delete(comment)
            await db.commit()
        return comment
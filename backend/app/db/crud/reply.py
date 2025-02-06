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
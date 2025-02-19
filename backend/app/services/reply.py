
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models import Reply
from app.db.crud.like import LikeCrud
from app.db.crud import UserCrud, ReplyCrud
from app.db.schemas.reply import ReplyResponse

class ReplyService:
    @staticmethod
    async def get_reply_response(db:AsyncSession,comment_id:int, user_id: int | None = None) -> list[ReplyResponse]:
        
        replys = await ReplyCrud.get_by_comment(db=db, comment_id=comment_id)
        reply_responses = [await ReplyService.reply_to_response(db,reply,user_id) for reply in replys ]

        return reply_responses
    
    @staticmethod
    async def reply_to_response(db:AsyncSession, reply: Reply, user_id: int | None = None):
        like_count = await LikeCrud.get_reply_like_count(db, reply.reply_id)
        user = await UserCrud.get(db=db, user_id=reply.user_id)
    

        topic_response = ReplyResponse(
            comment_id= reply.comment_id,
            topic_id= reply.reply_id,
            user_id=reply.user_id,
            content=reply.content,
            username = user.username,
            created_at=reply.created_at,
            like_count=like_count,
            has_liked= False,
        )
        
        if user_id is not None:
            has_liked = await LikeCrud.is_reply_liked_by_user(db, reply.reply_id, user_id)
            
            topic_response.has_liked = has_liked
                
        return topic_response
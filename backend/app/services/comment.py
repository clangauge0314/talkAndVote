
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud.comment import CommentCrud
from app.db.crud.like import LikeCrud
from app.db.schemas.comment import CommentResponse
from app.db.crud.user import UserCrud
from backend.app.db.crud.reply import ReplyCrud

class CommentService:
    @staticmethod
    async def get_comment_response(db:AsyncSession,topic_id:int, user_id: int | None = None) -> list[CommentResponse]:
        
        comments = await CommentCrud.get_by_topic(db=db, topic_id=topic_id)
        comment_responses = []
        
        for comment in comments:
            like_count = await LikeCrud.get_comment_like_count(db,comment.comment_id)
            user = await UserCrud.get(db=db, user_id=comment.user_id)

        
        

            topic_response = CommentResponse(
                comment_id= comment.comment_id,
                topic_id= comment.topic_id,
                user_id=comment.user_id,
                content=comment.content,
                username = user.username,
                created_at=comment.created_at,
                like_count=like_count,
                has_liked= False,
            )
            
            if user_id is not None:
                has_liked = await LikeCrud.is_comment_liked_by_user(db, comment.comment_id, user_id)
                
                topic_response.has_liked = has_liked
                
            comment_responses.append(topic_response)

        return comment_responses
    
    @staticmethod
    async def comment_to_response(db:AsyncSession, comment, user_id: int | None = None):
        like_count = await LikeCrud.get_comment_like_count(db,comment.comment_id)
        user = await UserCrud.get(db=db, user_id=comment.user_id)

        # replys = await ReplyCrud.get_by_comment(db, comment_i)
    

        topic_response = CommentResponse(
            comment_id= comment.comment_id,
            topic_id= comment.topic_id,
            user_id=comment.user_id,
            content=comment.content,
            username = user.username,
            created_at=comment.created_at,
            like_count=like_count,
            has_liked= False,
        )
        
        if user_id is not None:
            has_liked = await LikeCrud.is_comment_liked_by_user(db, comment.comment_id, user_id)
            
            topic_response.has_liked = has_liked
                
        return topic_response
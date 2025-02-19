from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func  # 집계 함수 (count)
from app.db.models.like import TopicLike, CommentLike, ReplyLike

class LikeCrud:
    @staticmethod
    async def toggle_topic_like(db: AsyncSession, user_id: int, topic_id: int):
        existing_like = await db.execute(
            select(TopicLike).where((TopicLike.user_id == user_id) & (TopicLike.topic_id == topic_id))
        )
        like = existing_like.scalar_one_or_none()

        if like:
            await db.delete(like)
            await db.commit()
            return False  # 좋아요 취소됨
        else:
            new_like = TopicLike(user_id=user_id, topic_id=topic_id)
            db.add(new_like)
            await db.commit()
            return True  # 좋아요 추가됨

    @staticmethod
    async def toggle_comment_like(db: AsyncSession, user_id: int, comment_id: int):
        existing_like = await db.execute(
            select(CommentLike).where((CommentLike.user_id == user_id) & (CommentLike.comment_id == comment_id))
        )
        like = existing_like.scalar_one_or_none()

        if like:
            await db.delete(like)
            await db.commit()
            return False  # 좋아요 취소됨
        else:
            new_like = CommentLike(user_id=user_id, comment_id=comment_id)
            db.add(new_like)
            await db.commit()
            return True  # 좋아요 추가됨

    @staticmethod
    async def toggle_reply_like(db: AsyncSession, user_id: int, reply_id: int):
        existing_like = await db.execute(
            select(ReplyLike).where((ReplyLike.user_id == user_id) & (ReplyLike.reply_id == reply_id))
        )
        like = existing_like.scalar_one_or_none()

        if like:
            await db.delete(like)
            await db.commit()
            return False  # 좋아요 취소됨
        else:
            new_like = ReplyLike(user_id=user_id, reply_id=reply_id)
            db.add(new_like)
            await db.commit()
            return True  # 좋아요 추가됨

    # ✅ 주제(Topic) 좋아요 개수 가져오기
    @staticmethod
    async def get_topic_like_count(db: AsyncSession, topic_id: int) -> int:
        result = await db.execute(
            select(func.count(TopicLike.like_id)).where(TopicLike.topic_id == topic_id)
        )
        like_count = result.scalar()
        return like_count

    # ✅ 댓글(Comment) 좋아요 개수 가져오기
    @staticmethod
    async def get_comment_like_count(db: AsyncSession, comment_id: int) -> int:
        result = await db.execute(
            select(func.count(CommentLike.like_id)).where(CommentLike.comment_id == comment_id)
        )
        like_count = result.scalar()
        return like_count

    # ✅ 답글(Reply) 좋아요 개수 가져오기
    @staticmethod
    async def get_reply_like_count(db: AsyncSession, reply_id: int) -> int:
        result = await db.execute(
            select(func.count(ReplyLike.like_id)).where(ReplyLike.reply_id == reply_id)
        )
        like_count = result.scalar()
        return like_count

    @staticmethod
    async def is_topic_liked_by_user(db: AsyncSession, topic_id: int, user_id: int) -> bool:
        result = await db.execute(
            select(TopicLike).where((TopicLike.topic_id == topic_id) & (TopicLike.user_id == user_id))
        )
        like = result.scalar_one_or_none()
        return like is not None
    
    @staticmethod
    async def is_comment_liked_by_user(db: AsyncSession, comment_id: int, user_id: int) -> bool:
        result = await db.execute(
            select(CommentLike).where((CommentLike.comment_id == comment_id) & (CommentLike.user_id == user_id))
        )
        like = result.scalar_one_or_none()
        return like is not None
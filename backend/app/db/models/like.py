from sqlalchemy import Column, Integer, ForeignKey, TIMESTAMP, func, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.database import Base

class TopicLike(Base):
    __tablename__ = "topic_likes"
    
    like_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.topic_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    __table_args__ = (UniqueConstraint('user_id', 'topic_id', name='unique_topic_like'),)
    topic = relationship("Topic", back_populates="likes")


class CommentLike(Base):
    __tablename__ = "comment_likes"
    
    like_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("comments.comment_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    __table_args__ = (UniqueConstraint('user_id', 'comment_id', name='unique_comment_like'),)
    comment = relationship("Comment", back_populates="likes")

class ReplyLike(Base):
    __tablename__ = "reply_likes"
    
    like_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    reply_id = Column(Integer, ForeignKey("replies.reply_id"), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint('user_id', 'reply_id', name='unique_reply_like'),)
    
    reply = relationship("Reply", back_populates="likes")
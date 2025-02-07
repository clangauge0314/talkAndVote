from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Reply(Base):
    __tablename__ = "replies"
    
    reply_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    comment_id = Column(Integer, ForeignKey("comments.comment_id"), nullable=False)
    content = Column(String(500), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    comment = relationship("Comment", back_populates="replies")
    likes = relationship("ReplyLike", back_populates="reply", cascade="all, delete-orphan")
from sqlalchemy import JSON, Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Topic(Base):
    __tablename__ = "topics"
    
    topic_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(String(500), nullable=True)
    vote_options = Column(JSON, nullable=False) 
    category = Column(String(255), nullable=False, default="기타")
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    votes = relationship("Vote", back_populates="topic", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="topic", cascade="all, delete-orphan")
    likes = relationship("TopicLike", back_populates="topic", cascade="all, delete-orphan")

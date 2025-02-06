from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, TIMESTAMP, func
from sqlalchemy.orm import relationship
from app.db.database import Base

class Vote(Base):
    __tablename__ = "votes"
    
    vote_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    topic_id = Column(Integer, ForeignKey("topics.topic_id"), nullable=False)
    vote_option = Column(String(100), nullable=False)  # 예: "찬성", "반대" 또는 선택지 ID
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    
    topic = relationship("Topic", back_populates="votes")
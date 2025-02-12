from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    TIMESTAMP,
    func,
    Date
)
from sqlalchemy.orm import relationship
from app.db.database import Base


class User(Base):
    __tablename__ = "users"
    
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=False)
    refresh_token = Column(String(255), nullable=True)
    gender = Column(String(10), nullable=True)
    birthdate = Column(Date, nullable=True)
    profile_url = Column(String(255), nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=True)
    topics = relationship("Topic", back_populates="user", cascade="all, delete-orphan")

# app/db/model/users.py

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    TIMESTAMP,
    func,
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
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=True)

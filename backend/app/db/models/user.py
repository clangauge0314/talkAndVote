from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    TIMESTAMP,
    func,
    Date,
    Enum,
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

    # ✅ 유저 등급 (멤버십 레벨)
    membership_level = Column(
        Enum("bronze", "silver", "gold", "vip", name="membership_levels"),
        default="bronze",
        nullable=False,
    )

    # ✅ 한 달 동안 작성 가능한 게시물 개수 제한 (등급에 따라 다름)
    post_limit_per_month = Column(
        Integer, default=10, nullable=False
    )  # 기본값: 브론즈 등급 10개 제한

    # ✅ 마지막 게시물 작성한 달 (월별 제한 적용)
    last_post_month = Column(DateTime, nullable=True)

    topics = relationship("Topic", back_populates="user", cascade="all, delete-orphan")
    payments = relationship(
        "Payment", back_populates="user", cascade="all, delete-orphan"
    )

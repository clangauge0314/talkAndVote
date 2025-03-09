from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    merchant_uid = Column(String(100), unique=True, index=True)
    amount = Column(Integer, nullable=False)
    status = Column(
        String(50), default="pending"
    )  # 결제 상태 (paid, failed, cancelled)
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", back_populates="payments")

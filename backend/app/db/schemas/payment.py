from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class PaymentCreate(BaseModel):
    user_id: int
    merchant_uid: str
    amount: int
    status: str = "pending"  # 기본값 "pending"


class PaymentUpdate(BaseModel):
    status: Optional[str] = None


class PaymentResponse(BaseModel):
    id: int
    user_id: int
    merchant_uid: str
    amount: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# 📌 4️⃣ 결제 취소 API
class CancelRequest(BaseModel):
    imp_uid: str
    reason: str


# 📌 5️⃣ 웹훅(Webhook) 처리 API
class WebhookData(BaseModel):
    imp_uid: str
    status: str
    merchant_uid: str

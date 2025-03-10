from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.services.payment import PaymentService
from app.core.portone_client import PortOneClient
import portone_server_sdk as portone
from app.core.auth import get_user_id

router = APIRouter()
payment_service = PaymentService()
portone_client = PortOneClient()


@router.post("/api/payment/complete")
async def complete_payment(
    payment_id: str,
    db: AsyncSession = Depends(get_db),
):
    """
    결제 완료 후 PortOne과 동기화
    """
    payment = await payment_service.sync_payment(db, payment_id)
    if not payment:
        return {"message": "결제 동기화 실패"}, 400
    return payment


@router.post("/api/payment/webhook")
async def receive_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    """
    PortOne 웹훅 처리
    """
    raw_body = await request.body()
    webhook = portone_client.verify_webhook(raw_body.decode("utf-8"), request.headers)

    if isinstance(webhook, dict) or not isinstance(
        webhook.data, portone.webhook.WebhookTransactionData
    ):
        return {"message": "Invalid Webhook"}, 400

    # 웹훅에서 받은 결제 ID로 동기화
    await payment_service.sync_payment(db, webhook.data.payment_id)

    return {"message": "Webhook Processed Successfully"}

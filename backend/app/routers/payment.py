from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.models import Payment
import httpx
import os

from app.core.config import Config
from app.db.schemas.payment import (
    CancelRequest,
    PaymentCreate,
    PaymentResponse,
    WebhookData,
)
from backend.app.db.crud import PaymentCrud

router = APIRouter()


@router.post("/payment/create", response_model=PaymentResponse)
async def create_payment(
    payment_data: PaymentCreate,
    db: AsyncSession = Depends(get_db),
    user_id: int = Depends(get_user_id),
):
    """
    결제 요청을 저장
    """
    new_payment = await PaymentCrud.create(db, payment_data)
    return new_payment


@router.post("/payment/cancel")
async def cancel_payment(cancel_data: CancelRequest):
    """
    사용자가 결제 취소를 요청하면 PortOne을 통해 결제 취소
    """
    access_token = await get_access_token()
    url = f"{Config.PORTONE_BASE_URL}/v2/payments/cancel"
    headers = {
        "Authorization": f"PortOne {access_token}",
        "Content-Type": "application/json",
    }
    data = {"imp_uid": cancel_data.imp_uid, "reason": cancel_data.reason}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="결제 취소 실패")

    return {"message": "결제 취소 성공"}


@router.post("/payment/webhook")
async def webhook_handler(
    webhook_data: WebhookData, db: AsyncSession = Depends(get_db)
):
    """
    PortOne에서 결제 상태 변경 시 호출되는 웹훅 API
    """
    # 결제 상태 업데이트 (DB 저장)
    payment = await db.execute(
        f"SELECT * FROM payments WHERE merchant_uid = '{webhook_data.merchant_uid}'"
    )
    payment = payment.scalar_one_or_none()

    if payment:
        payment.status = webhook_data.status
        await db.commit()
        await db.refresh(payment)

    return {"message": "웹훅 처리 완료", "status": webhook_data.status}


async def get_access_token():
    url = f"{Config.PORTONE_BASE_URL}/login/api-secret"
    headers = {"Content-Type": "application/json"}
    data = {"api_secret": Config.PORTONE_API_SECRET}

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json().get("response", {}).get("access_token")
    raise HTTPException(status_code=500, detail="PortOne 토큰 발급 실패")


@router.get("/payment/verify/{imp_uid}")
async def verify_payment(imp_uid: str):
    access_token = await get_access_token()
    url = f"{Config.PORTONE_BASE_URL}/v2/payments/{imp_uid}"
    headers = {"Authorization": f"PortOne {access_token}"}

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="결제 검증 실패")

    return response.json().get("response", {})

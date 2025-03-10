from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.schemas.payment import CancelRequest, PaymentCreate, PaymentResponse
from app.services.payment import PaymentService

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
    payment_data.user_id = user_id
    new_payment = await PaymentService.create_payment(db, payment_data)
    return new_payment


@router.post("/payment/cancel")
async def cancel_payment(
    cancel_data: CancelRequest, db: AsyncSession = Depends(get_db)
):
    """
    사용자가 결제 취소 요청 시 PortOne을 통해 처리
    """
    return await PaymentService.cancel_payment(
        db, cancel_data.imp_uid, cancel_data.reason
    )


@router.get("/payment/verify/{imp_uid}")
async def verify_payment(imp_uid: str, db: AsyncSession = Depends(get_db)):
    """
    PortOne을 통해 결제 검증 후 DB 상태 업데이트
    """
    return await PaymentService.verify_payment(db, imp_uid)

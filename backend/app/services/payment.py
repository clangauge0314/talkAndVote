from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud.payment import PaymentCrud
from app.db.schemas.payment import PaymentCreate, PaymentUpdate
from app.core.http_client import PortOneClient


class PaymentService:
    @staticmethod
    async def create_payment(db: AsyncSession, payment_data: PaymentCreate):
        """
        새로운 결제 요청을 저장
        """
        return await PaymentCrud.create(db, payment_data)

    @staticmethod
    async def cancel_payment(db: AsyncSession, imp_uid: str, reason: str):
        """
        PortOne을 통해 결제 취소 및 DB 상태 업데이트
        """
        # PortOne에서 결제 취소 요청
        cancel_response = await PortOneClient.cancel_payment(imp_uid, reason)

        # DB에서도 결제 상태를 업데이트
        payment = await PaymentCrud.get_by_merchant_uid(db, imp_uid)
        if not payment:
            raise HTTPException(status_code=404, detail="결제 정보를 찾을 수 없음")

        payment.status = "cancelled"
        await db.commit()
        await db.refresh(payment)

        return cancel_response

    @staticmethod
    async def verify_payment(db: AsyncSession, imp_uid: str):
        """
        PortOne을 통해 결제 검증 후, DB 상태 업데이트
        """
        payment_data = await PortOneClient.verify_payment(imp_uid)

        # ✅ PaymentCrud를 호출하여 DB 업데이트 (직접 수정 X)
        updated_payment = await PaymentCrud.update_status(
            db, imp_uid, payment_data["status"]
        )
        if not updated_payment:
            raise HTTPException(status_code=404, detail="결제 정보를 찾을 수 없음")

        return updated_payment

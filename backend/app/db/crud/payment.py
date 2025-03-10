from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.payment import Payment
from app.db.schemas.payment import PaymentCreate


class PaymentCrud:
    @staticmethod
    async def get_by_merchant_uid(
        db: AsyncSession, merchant_uid: str
    ) -> Payment | None:
        """
        주문 고유번호(merchant_uid)로 결제 조회
        """
        result = await db.execute(
            select(Payment).filter(Payment.merchant_uid == merchant_uid)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, payment: PaymentCreate) -> Payment:
        """
        새로운 결제 정보 생성
        """
        db_payment = Payment(**payment.model_dump())
        db.add(db_payment)
        await db.commit()
        await db.refresh(db_payment)
        return db_payment

    @staticmethod
    async def update_status(
        db: AsyncSession, merchant_uid: str, status: str
    ) -> Payment | None:
        """
        결제 상태 업데이트 (예: paid, cancelled 등)
        """
        payment = await PaymentCrud.get_by_merchant_uid(db, merchant_uid)
        if payment:
            payment.status = status
            await db.commit()
            await db.refresh(payment)
            return payment
        return None

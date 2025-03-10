from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models.payment import Payment
from app.db.schemas.payment import PaymentCreate, PaymentUpdate


class PaymentCrud:
    @staticmethod
    async def get(db: AsyncSession, payment_id: int) -> Payment | None:
        result = await db.execute(select(Payment).filter(Payment.id == payment_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def get_by_merchant_uid(
        db: AsyncSession, merchant_uid: str
    ) -> Payment | None:
        result = await db.execute(
            select(Payment).filter(Payment.merchant_uid == merchant_uid)
        )
        return result.scalar_one_or_none()

    @staticmethod
    async def create(db: AsyncSession, payment: PaymentCreate) -> Payment:
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

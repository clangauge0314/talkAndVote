from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.models import Payment
from app.db.schemas.payment import PaymentCreate, PaymentUpdate


class PaymentCrud:
    @staticmethod
    async def get(db: AsyncSession, payment_id: int) -> Payment | None:
        """
        특정 결제 정보를 ID로 조회
        """
        result = await db.execute(select(Payment).filter(Payment.id == payment_id))
        return result.scalar_one_or_none()

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
    async def update(
        db: AsyncSession, payment_id: int, payment: PaymentUpdate
    ) -> Payment | None:
        """
        결제 정보 업데이트
        """
        db_payment = await db.get(Payment, payment_id)
        if db_payment:
            update_data = payment.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_payment, key, value)
            await db.commit()
            await db.refresh(db_payment)
            return db_payment
        return None

    @staticmethod
    async def delete(db: AsyncSession, payment_id: int) -> Payment | None:
        """
        결제 정보 삭제
        """
        db_payment = await db.get(Payment, payment_id)
        if db_payment:
            await db.delete(db_payment)
            await db.commit()
            return db_payment
        return None

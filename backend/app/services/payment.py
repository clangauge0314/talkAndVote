import json
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud.payment import PaymentCrud
from app.db.schemas.payment import PaymentCreate, PaymentResponse
from app.core.portone_client import PortOneClient
import portone_server_sdk as portone
import logging

logger = logging.getLogger(__name__)


class PaymentService:
    def __init__(self):
        self.portone_client = PortOneClient()

    async def sync_payment(self, db: AsyncSession, payment_id: str):
        """
        PortOne의 결제 정보와 로컬 DB 동기화
        """
        # PortOne에서 실제 결제 정보 가져오기
        actual_payment = self.portone_client.get_payment(payment_id)
        logger.error(actual_payment)
        # 결제가 완료된 경우 검증
        if isinstance(actual_payment, portone.payment.PaidPayment):
            if not self.verify_payment(actual_payment):
                raise HTTPException(status_code=400, detail="결제 검증 실패")
            # DB에서 결제 정보 조회 (없으면 생성)
            logger.info(actual_payment)
            payment = await PaymentCrud.get_by_merchant_uid(db, payment_id)
            if not payment:
                payment = await PaymentCrud.create(
                    db,
                    PaymentCreate(
                        merchant_uid=payment_id,
                        status="PENDING",
                        user_id=1,
                        amount=1000,
                    ),
                )

            if payment.status == "PAID":
                return payment

            # DB 상태 업데이트
            updated_payment = await PaymentCrud.update_status(db, payment_id, "PAID")
            logger.error(updated_payment)
            return updated_payment

        return None

    @staticmethod
    def verify_payment(payment: portone.payment.PaidPayment):
        """
        PortOne에서 받은 결제 정보 검증
        """
        if payment.custom_data is None:
            return False

        try:
            custom_data = json.loads(payment.custom_data)
        except json.JSONDecodeError:
            return False

        logger.error(custom_data)
        return True

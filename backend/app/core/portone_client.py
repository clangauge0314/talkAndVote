import json
import os
import portone_server_sdk as portone
from fastapi import HTTPException


class PortOneClient:
    def __init__(self):
        self.client = portone.PaymentClient(secret=os.getenv("V2_API_SECRET"))

    def get_payment(self, payment_id: str):
        """
        PortOne에서 결제 정보를 가져옴
        """
        try:
            return self.client.get_payment(payment_id=payment_id)
        except portone.payment.GetPaymentError:
            raise HTTPException(
                status_code=400, detail="결제 정보를 가져올 수 없습니다."
            )

    def verify_webhook(self, raw_body: str, headers: dict):
        """
        PortOne 웹훅 검증
        """
        try:
            return portone.webhook.verify(
                os.getenv("V2_WEBHOOK_SECRET"),
                raw_body,
                headers,
            )
        except portone.webhook.WebhookVerificationError:
            raise HTTPException(status_code=400, detail="웹훅 검증 실패")

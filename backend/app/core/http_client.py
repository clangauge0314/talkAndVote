import httpx
from fastapi import HTTPException
from app.core.config import Config


class PortOneClient:
    @staticmethod
    async def get_access_token():
        """
        PortOne API Secret을 사용하여 Access Token 발급
        """
        url = f"{Config.PORTONE_BASE_URL}/login/api-secret"
        headers = {"Content-Type": "application/json"}
        data = {"api_secret": Config.PORTONE_API_SECRET}

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)
        if response.status_code == 200:
            return response.json().get("response", {}).get("access_token")

        raise HTTPException(status_code=500, detail="PortOne 토큰 발급 실패")

    @staticmethod
    async def cancel_payment(imp_uid: str, reason: str):
        """
        PortOne API를 사용하여 결제 취소
        """
        access_token = await PortOneClient.get_access_token()
        url = f"{Config.PORTONE_BASE_URL}/v2/payments/cancel"
        headers = {
            "Authorization": f"PortOne {access_token}",
            "Content-Type": "application/json",
        }
        data = {"imp_uid": imp_uid, "reason": reason}

        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=data, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="결제 취소 실패"
            )

        return response.json()

    @staticmethod
    async def verify_payment(imp_uid: str):
        """
        PortOne API를 사용하여 결제 검증
        """
        access_token = await PortOneClient.get_access_token()
        url = f"{Config.PORTONE_BASE_URL}/v2/payments/{imp_uid}"
        headers = {"Authorization": f"PortOne {access_token}"}

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code, detail="결제 검증 실패"
            )

        return response.json().get("response", {})

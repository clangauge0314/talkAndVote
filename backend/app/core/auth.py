# app/core/auth.py

from fastapi import Request, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud.user import UserCrud
from app.db.database import get_db
from app.core.config import Config
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
import logging


logger = logging.getLogger(__name__)

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=int(Config.ACCESS_TOKEN_EXPIRE.total_seconds()),  # 쿠키 만료 시간 설정
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite=None,
        max_age=int(Config.REFRESH_TOKEN_EXPIRE.total_seconds()),  # 쿠키 만료 시간 설정
    )


async def get_user_id(request: Request) -> int:
    access_token = request.cookies.get("access_token")

    if not access_token:
        raise HTTPException(status_code=401, detail="Access token missing")

    user_id = await verify_token(access_token)
    if user_id:
        return user_id
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired access token")

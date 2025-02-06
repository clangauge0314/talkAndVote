# app/core/auth.py

from fastapi import Request, Response, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import Config
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    verify_token,
)
import logging


logger = logging.getLogger(__name__)


async def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=int(Config.ACCESS_TOKEN_EXPIRE.total_seconds()),  # 쿠키 만료 시간 설정
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=int(Config.REFRESH_TOKEN_EXPIRE.total_seconds()),  # 쿠키 만료 시간 설정
    )


async def get_user_id(db: AsyncSession, request: Request, response: Response) -> int:
    access_token = request.cookies.get("access_token")
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        logger.warning("Missing refresh token")
        raise HTTPException(status_code=401, detail="User Unauthorized")

    if access_token:
        user_id = await verify_token(access_token)
        if user_id:
            return user_id

    user_id = await verify_token(refresh_token)
    if user_id is None:
        logger.warning("Invalid refresh token")
        raise HTTPException(status_code=401, detail="User Unauthorized")

    # 새로운 access token 및 refresh token 생성
    new_access_token = await create_access_token(user_id)
    new_refresh_token = await create_refresh_token(user_id)
    await set_auth_cookies(
        response=response,
        access_token=new_access_token,
        refresh_token=new_refresh_token,
    )
    return user_id

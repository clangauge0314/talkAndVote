# app/utils/jwt_handler.py

import os
import uuid
import jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from app.core.config import Config

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


async def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_token(uid: int, expires_delta: timedelta, **kwargs):
    to_encode = kwargs.copy()
    expire = datetime.now(timezone.utc) + expires_delta  # UTC 시간대 사용
    to_encode.update({"exp": expire, "uid": uid})
    encoded_jwt = jwt.encode(
        to_encode, Config.SECRET_KEY, algorithm=Config.JWT_ALGORITHM
    )
    return encoded_jwt


def create_access_token(uid: int):
    return create_token(uid=uid, expires_delta=Config.ACCESS_TOKEN_EXPIRE)


def create_refresh_token(uid: int):
    return create_token(uid=uid, jti=str(uuid.uuid4()), expires_delta=Config.REFRESH_TOKEN_EXPIRE)

def decode_token(token):
    try:
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=[Config.JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def verify_token(token):
    payload = decode_token(token=token)
    if payload is None:
        return None
    user_id = payload["uid"]
    exp = payload["exp"]
    if datetime.fromtimestamp(exp, timezone.utc) < datetime.now(timezone.utc):
        return None
    return user_id


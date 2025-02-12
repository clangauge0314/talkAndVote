# app/main.py

import os
import uvicorn
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from dotenv import load_dotenv
from fastapi.concurrency import asynccontextmanager
from app.db.database import Base, async_engine, get_db
from app.routers import user, auth, profile, topic, like, comment, vote
from app.core.jwt_handler import create_access_token, create_refresh_token, verify_token
from app.db.crud.user import UserCrud

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await async_engine.dispose()

app = FastAPI(lifespan=lifespan)

class TokenRefreshMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        access_token = request.cookies.get("access_token")
        refresh_token = request.cookies.get("refresh_token")
        
        # 액세스 토큰이 유효한 경우: 아무 작업 필요 없음
        if access_token:
            user_id = verify_token(access_token)
            if user_id:
                return response
        
        # 액세스 토큰이 만료된 경우: 리프레시 토큰 검증
        if refresh_token:
            user_id = verify_token(refresh_token)
            if user_id:
                # 새 액세스 토큰 및 리프레시 토큰 발급
                new_access_token = create_access_token(user_id)
                new_refresh_token = create_refresh_token(user_id)
                db_gen = get_db()                   # 비동기 제너레이터 생성
                db = await anext(db_gen)  
                await UserCrud.update_refresh_token(db, user_id, new_refresh_token)
                await db.commit()
                # 새 토큰을 쿠키에 설정
                response.set_cookie("access_token", new_access_token, httponly=True, samesite="Strict", secure=True)
                response.set_cookie("refresh_token", new_refresh_token, httponly=True, samesite="Strict", secure=True)
        
        return response

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TokenRefreshMiddleware)

# 라우터 추가
app.include_router(user.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(topic.router)
app.include_router(like.router)
app.include_router(comment.router)
app.include_router(vote.router)


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

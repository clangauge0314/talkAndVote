# app/db/database.py

import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from app.core.config import Config

# 비동기 엔진 생성
async_engine = create_async_engine(Config.DATABASE_URL, echo=False)
AsyncSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=async_engine, class_=AsyncSession
)

# 동기 엔진 생성 (Alembic용)
sync_engine = create_engine(Config.SYNC_DATABASE_URL, pool_pre_ping=True)

Base = declarative_base()


# 비동기 세션 함수
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session

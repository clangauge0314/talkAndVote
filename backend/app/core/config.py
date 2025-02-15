from datetime import timedelta
import os
from dotenv import load_dotenv
import logging

logger = logging.getLogger(__name__)

# .env 파일 로드
load_dotenv()

class Config:
    # 데이터베이스 설정
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "1521")  # Oracle 기본 포트
    DB_NAME = os.getenv("DB_NAME")  # 서비스 이름 또는 SID

    # Oracle 연결 문자열 구성
    TMP_DB = f"{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    DATABASE_URL = f"mysql+asyncmy://{TMP_DB}"  
    SYNC_DATABASE_URL = f"mysql+pymysql://{TMP_DB}"  
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
    


    # JWT 설정
    SECRET_KEY = os.getenv("SECRET_KEY", "your_default_secret")
    JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE = timedelta(minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15)))
    REFRESH_TOKEN_EXPIRE = timedelta(days=int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7)))

    # 이메일 설정
    SMTP_HOST = os.getenv("SMTP_HOST")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USER = os.getenv("SMTP_USER")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    EMAIL_FROM = os.getenv("EMAIL_FROM")
    EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "FastAPI App")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
    BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8000")

# 설정 인스턴스 생성
config = Config()

# app/services/auth.py

from app.core.jwt_handler import create_access_token, verify_token
from app.db.crud.user import UserCrud
from app.db.schemas.users import UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from core.email_utils import generate_verification_email
class AuthServices:
    
    @staticmethod
    async def register_user(db: AsyncSession, email: str):
        user = await UserCrud.get_by_email(db, email)
        if user:
            return None
        
        # 이메일 인증 토큰 생성
        token = create_access_token(user.user_id)
        html_content = generate_verification_email(email, token)
        return html_content
    
    @staticmethod
    async def verify_email(db: AsyncSession, token: str):
        user_id = verify_token(token)
        await UserCrud.update(db, user_id, UserUpdate(is_verified=True))
        return True
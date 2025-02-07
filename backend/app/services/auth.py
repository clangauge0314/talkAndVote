# app/services/auth.py

from app.core.jwt_handler import create_access_token, verify_token
from app.db.crud.user import UserCrud
from app.db.schemas.users import UserUpdate
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.email_utils import generate_verification_email
import logging
from app.core.utils import to_dict

logger = logging.getLogger(__name__)
class AuthServices:
    
    @staticmethod
    async def register_user(db: AsyncSession, email: str):
        user = await UserCrud.get_by_email(db, email)
        if not user:
            logger.error(await to_dict(user, db=db))
            return None
        
        # 이메일 인증 토큰 생성
        token = create_access_token(user.user_id)
        html_content = generate_verification_email(email, token)
        return html_content
    
    @staticmethod
    async def verify_email(db: AsyncSession, token: str):
        user_id = await verify_token(token)
        db_user = await UserCrud.update(db, user_id, UserUpdate(is_verified=True))
        await db.flush()
        await db.commit()
        await db.refresh(db_user)
        return True
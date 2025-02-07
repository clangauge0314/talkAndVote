# app/services/user.py


from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud.user import UserCrud
from app.db.schemas.users import UserCreate, UserLogin, UserSignUp
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)
import logging
from app.core.utils import to_dict
from app.core.email_utils import generate_verification_email

logger = logging.getLogger(__name__)


class UserService:
    @staticmethod
    async def login(db: AsyncSession, user: UserLogin) -> tuple:
        db_user = await UserCrud.get_by_username(db=db, username=user.username)
        
        if not db_user:
            return None
        
        if not db_user.is_verified:
            return None
        
        if not await verify_password(user.password, db_user.password):
            return None

        access_token = create_access_token(db_user.user_id)
        refresh_token = create_refresh_token(db_user.user_id)
        
        return (access_token, refresh_token)
            

    @staticmethod
    async def signup(db: AsyncSession, user: UserSignUp) -> tuple:
        if await UserCrud.get_by_username(db=db, username=user.username):
            logger.error(await to_dict(await UserCrud.get_by_username(db=db, username=user.username), db))
            return None
        user_info = UserCreate(
            username=user.username, password=await get_password_hash(user.password), email=user.email
        )
        try:
            db_user = await UserCrud.create(db=db, user=user_info)
            await db.flush()
            await db.commit()
            await db.refresh(db_user)
            access_token = create_access_token(db_user.user_id)
            refresh_token = create_refresh_token(db_user.user_id)
            email_token = create_access_token(db_user.user_id)
            html_content = generate_verification_email(user.email, email_token)
            
            return (access_token, refresh_token, html_content)
        except Exception as e:
            await db.rollback()
            raise e

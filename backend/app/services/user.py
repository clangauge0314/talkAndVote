# app/services/user.py

from sqlalchemy.ext.asyncio import AsyncSession
import logging

from app.db.crud.user import UserCrud
from app.db.schemas.users import UserCreate, UserLogin, UserSignUp
from app.core.jwt_handler import (
    create_access_token,
    create_refresh_token,
    get_password_hash,
    verify_password,
)

logger = logging.getLogger(__name__)


class UserService:

    @staticmethod
    async def login(db: AsyncSession, user: UserLogin) -> tuple:
        db_user = await UserCrud.get_by_username(db=db, username=user.username)
        if db_user and await verify_password(user.password, db_user.password):
            access_token = create_access_token(db_user.user_id)
            refresh_token = create_refresh_token(db_user.user_id)
            
            return (access_token, refresh_token)
            
        return None

    @staticmethod
    async def signup(db: AsyncSession, user: UserSignUp) -> tuple:
        if await UserCrud.get_by_username(db=db, username=user.username):
            return None
        user_info = UserCreate(
            username=user.username, password=await get_password_hash(user.password)
        )
        try:
            db_user = await UserCrud.create(db=db, user=user_info)
            await db.flush()
            await db.commit()
            await db.refresh(db_user)
            access_token = await create_access_token(db_user.user_id)
            refresh_token = await create_refresh_token(db_user.user_id)
            return (access_token, refresh_token)
        except Exception as e:
            await db.rollback()
            raise e

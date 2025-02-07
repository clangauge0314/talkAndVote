# app/routers/user.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, set_auth_cookies
from app.services.user import UserService
from app.db.schemas.users import UserLogin, UserResponse, UserSchemas, UserSignUp
from app.core.email_utils import send_email
from app.db.crud.user import UserCrud
from app.core.jwt_handler import create_access_token, create_refresh_token, verify_password

router = APIRouter() 

@router.post("/users/login", response_model=UserResponse)
async def login_user_route(
    user: UserLogin, response: Response, db: AsyncSession = Depends(get_db)
):

    db_user = await UserCrud.get_by_email(db=db, email=user.email)
    
    if not db_user or not await verify_password(user.password, db_user.password):
        raise HTTPException(
        status_code=401,
        detail="Incorrect email or password",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    if not db_user.is_verified:
        raise HTTPException(
        status_code=401,
        detail="이메일 인증 안됨",
        headers={"WWW-Authenticate": "Bearer"},
    )
    

    access_token = create_access_token(db_user.user_id)
    refresh_token = create_refresh_token(db_user.user_id)
    
    await set_auth_cookies(response=response, access_token=access_token, refresh_token=refresh_token)
    return db_user


@router.post("/users/signup", response_model=str, status_code=status.HTTP_201_CREATED)
async def create_user_route(
    user: UserSignUp, response: Response, db: AsyncSession = Depends(get_db)
):
    result = await UserService.signup(db=db, user=user)
    if result:
        access_token, refresh_token, html_content = result
        await set_auth_cookies(
            response=response, access_token=access_token, refresh_token=refresh_token
        )
        await send_email(user.email, "Verify your email", html_content)
        return "user created successfully"
    raise HTTPException(
        status_code=401,
        detail="실패!",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.post("/users/logout/", response_model=str, include_in_schema=False)
async def logout_user_route(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return "Logout successful"

@router.delete("/users")
async def delete_user_route(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    user_id = await get_user_id(db, request, response)
    db_user = await UserCrud.delete(db,user_id)
    await db.commit()
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
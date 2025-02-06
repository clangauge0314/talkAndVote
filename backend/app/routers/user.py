# app/routers/user.py

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, set_auth_cookies
from app.services.user import UserService
from app.db.schemas.users import UserLogin, UserSignUp

router = APIRouter() 

@router.post("/users/login", response_model=str)
async def login_user_route(
    user: UserLogin, response: Response, db: AsyncSession = Depends(get_db)
):
    result = await UserService.login(db=db, user=user)
    if result:
        access_token, refresh_token = result
        await set_auth_cookies(
            response=response, access_token=access_token, refresh_token=refresh_token
        )
        return "Login successful"
    raise HTTPException(
        status_code=401,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.post("/users/signup", response_model=str)
async def create_user_route(
    user: UserSignUp, response: Response, db: AsyncSession = Depends(get_db)
):
    result = await UserService.signup(db=db, user=user)
    if result:
        access_token, refresh_token = result
        await set_auth_cookies(
            response=response, access_token=access_token, refresh_token=refresh_token
        )
        return "user created successfully"
    raise HTTPException(
        status_code=401,
        detail="Invalid username",
        headers={"WWW-Authenticate": "Bearer"},
    )


@router.delete("/users/logout", response_model=str)
async def logout_user_route(
    request: Request, response: Response, db: AsyncSession = Depends(get_db)
):
    user_id = await get_user_id(db=db, request=request, response=response)
    response.delete_cookie(key="access_token")
    response.delete_cookie(key="refresh_token")
    return "Logout successful"

# app/routers/auth.py


from fastapi import APIRouter, Depends, HTTPException, Request, Response
from app.services.auth import AuthServices
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, set_auth_cookies
from app.core.email_utils import send_email


router = APIRouter()

@router.get("/auth", response_model=bool)
async def auth_user_route(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    user_id = await get_user_id(db=db, request=request, response=response)
    return True


@router.post("/register")
async def register_user(email: str, db: AsyncSession = Depends(get_db)):
    result = await AuthServices.register_user(db, email)
    if not result:
        raise HTTPException(status_code=400, detail="User already exists")
    
    await send_email(email, "Verify your email", result)
    return {"msg": "Verification email sent"}

@router.get("/verify-email")
async def verify_email(request: Request, response: Response,token:str ,db: AsyncSession = Depends(get_db)):
    result = await AuthServices.verify_email(db, token)
    if not result:
        raise HTTPException(status_code=400, detail="User already exists")
    return True

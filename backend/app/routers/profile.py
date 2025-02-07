from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.schemas.users import profileResponse, profileUpdate
from app.db.crud.user import UserCrud

router = APIRouter() 

@router.get("/profile", response_model=profileResponse)
async def get_profile_route(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    user_id = await get_user_id(db, request, response)
    db_user = await UserCrud.get(db,user_id)
    if not db_user:
        raise HTTPException(
        status_code=404,
        detail="유저 없",
        headers={"WWW-Authenticate": "Bearer"},
    )
    return db_user

@router.put("/profile", response_model=profileResponse)
async def update_profile_route(profileUpdate: profileUpdate, request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    user_id = await get_user_id(db, request, response)
    db_user = await UserCrud.update(db,user_id,profileUpdate)
    await db.commit()
    await db.refresh(db_user)
    return db_user
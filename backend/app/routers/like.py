from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.crud import LikeCrud

router = APIRouter() 

@router.put("/like/topic/{topic_id}", response_model=bool)
async def update_like_topic_route(topic_id:int, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    result = await LikeCrud.toggle_topic_like(db,user_id=user_id, topic_id=topic_id)
    return result

@router.put("/like/comment/{comment_id}", response_model=bool)
async def update_profile_route(comment_id:int, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    result = await LikeCrud.toggle_comment_like(db,user_id=user_id, comment_id=comment_id)
    return result

@router.put("/like/reply/{reply_id}", response_model=bool)
async def update_profile_route(reply_id:int, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    result = await LikeCrud.toggle_reply_like(db,user_id=user_id, reply_id=reply_id)
    return result
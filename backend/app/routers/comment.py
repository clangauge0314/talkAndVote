from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.crud import CommentCrud
from app.db.schemas.comment import CommentCreate, CommentResponse

router = APIRouter()

@router.post("/comment/{topic_id}", response_model=CommentResponse)
async def create_comment_router(topic_id:int, content: str, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    result = await CommentCrud.create(db=db, comment_data=CommentCreate(user_id=user_id,topic_id=topic_id, content=content))
    return result

@router.get("/comment/{topic_id}", response_model=list[CommentResponse])
async def get_comment_router(topic_id:int, db: AsyncSession = Depends(get_db)):
    result = await CommentCrud.get_by_topic(db=db, topic_id=topic_id)
    return result
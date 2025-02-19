from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, get_user_id_optional
from app.db.crud import CommentCrud
from app.db.schemas.comment import CommentCreate, CommentResponse
from app.services import CommentService

router = APIRouter()

@router.post("/comment", response_model=CommentResponse)
async def create_comment_router(comment_data:CommentCreate, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    result = await CommentCrud.create(db=db, comment_data=comment_data, user_id= user_id)
    return await CommentService.comment_to_response(db,result,user_id)

@router.get("/comment/{topic_id}", response_model=list[CommentResponse])
async def get_comment_router(topic_id:int, user_id: int = Depends(get_user_id_optional),db: AsyncSession = Depends(get_db)):
    result = await CommentService.get_comment_response(db=db, topic_id=topic_id, user_id=user_id)
    return result

@router.delete("/comment/{comment_id}")
async def delete_comment_router(comment_id:int, db: AsyncSession = Depends(get_db)):
    result = await CommentCrud.delete(db=db, comment_id=comment_id)
    return result

from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, get_user_id_optional
from app.db.crud import CommentCrud
from app.db.schemas.comment import CommentCreate, CommentResponse, CommentUpdate
from app.services import CommentService

router = APIRouter()


@router.post("/comment", response_model=CommentResponse)
async def create_comment_router(
    comment_data: CommentCreate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await CommentCrud.create(db=db, comment_data=comment_data, user_id=user_id)
    return await CommentService.comment_to_response(db, result, user_id)


@router.get("/comment/{topic_id}", response_model=list[CommentResponse])
async def get_comment_router(
    topic_id: int,
    user_id: int = Depends(get_user_id_optional),
    db: AsyncSession = Depends(get_db),
):
    result = await CommentService.get_comment_response(
        db=db, topic_id=topic_id, user_id=user_id
    )
    return result


@router.put("/comment", response_model=CommentResponse)
async def update_comment_router(
    comment_data: CommentUpdate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await CommentCrud.get(db=db, comment_id=comment_data.comment_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="댓글 없",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if result.user_id != user_id:
        raise HTTPException(
            status_code=401,
            detail="니 댓글 아님",
            headers={"WWW-Authenticate": "Bearer"},
        )

    db_commnet = await CommentCrud.update(db=db, comment_data=comment_data)
    return await CommentService.comment_to_response(db, db_commnet, user_id)

@router.delete("/comment/{comment_id}")
async def delete_comment_router(
    comment_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await CommentCrud.get(db=db, comment_id=comment_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="댓글 없",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if result.user_id != user_id:
        raise HTTPException(
            status_code=401,
            detail="니 댓글 아님",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return await CommentCrud.delete(db=db, comment_id=comment_id)

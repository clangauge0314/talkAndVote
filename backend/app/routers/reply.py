from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, get_user_id_optional
from app.db.crud import ReplyCrud
from app.db.schemas.reply import ReplyCreate, ReplyResponse, ReplyUpdate
from app.services import ReplyService

router = APIRouter()


@router.post("/reply", response_model=ReplyResponse)
async def create_comment_router(
    reply_data: ReplyCreate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await ReplyCrud.create(db=db, reply_data=reply_data, user_id=user_id)
    return await ReplyService.reply_to_response(db, result, user_id)


@router.put("/reply", response_model=ReplyResponse)
async def update_comment_router(
    reply_data: ReplyUpdate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):
    result = await ReplyCrud.get(db=db, reply_id=reply_data.reply_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="대댓글 없",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if result.user_id != user_id:
        raise HTTPException(
            status_code=401,
            detail="니 대댓글 아님",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await ReplyCrud.update(
        db=db, reply_id=reply_data.reply_id, reply_data=reply_data
    )
    return await ReplyService.reply_to_response(db, result, user_id)


@router.delete("/reply/{reply_id}")
async def delete_comment_router(
    reply_id: int,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):

    result = await ReplyCrud.get(db=db, reply_id=reply_id)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="대댓글 없",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if result.user_id != user_id:
        raise HTTPException(
            status_code=401,
            detail="니 대댓글 아님",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await ReplyCrud.delete(db=db, reply_id=reply_id)
    return result

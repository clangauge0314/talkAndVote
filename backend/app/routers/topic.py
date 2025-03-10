from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id, get_user_id_optional
from app.db.crud import TopicCrud, UserCrud
from app.db.schemas.topic import TopicCreate, TopicResponse, TopicSchemas
from app.services import TopicService

router = APIRouter()


@router.get("/topics", response_model=list[TopicResponse])
async def get_topics_route(
    user_id: int | None = Depends(get_user_id_optional),
    db: AsyncSession = Depends(get_db),
):
    topics = await TopicService.get_topics_with_filters(db=db)

    topic_response = await TopicService.get_topics_to_responses(db, topics, user_id)

    return topic_response


@router.post("/topic", response_model=TopicSchemas)
async def create_topic_route(
    topic: TopicCreate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db),
):

    db_user = await UserCrud.get(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    now = datetime.now(ZoneInfo("Asia/Seoul"))
    current_month = now.replace(day=1)  # 이번 달 1일 (YYYY-MM-01)

    db_topic_count = await TopicCrud.get_post_count_by_month(
        db=db, user_id=user_id, start_of_month=current_month
    )

    if db_topic_count >= 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You can't create more than 5 topics in a month",
        )

    db_topic = await TopicCrud.create(db=db, topic_data=topic, user_id=user_id)
    await db.commit()
    await db.refresh(db_topic)
    return db_topic


@router.get("/topic/{topic_id}", response_model=TopicResponse)
async def get_topic(
    topic_id: int,
    user_id: int | None = Depends(get_user_id_optional),
    db: AsyncSession = Depends(get_db),
):
    topic = await TopicService.get_topic(db, topic_id, user_id)
    if not topic:
        raise HTTPException(
            status_code=404,
            detail="Topic not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return topic

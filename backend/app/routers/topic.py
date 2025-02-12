from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.crud import TopicCrud
from app.db.schemas.topic import TopicCreate, TopicResponse, TopicSchemas
from app.services import TopicService

router = APIRouter() 

@router.get("/topics", response_model=list[TopicResponse])
async def get_topics_route(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    topics = await TopicService.get_topics_with_filters(db=db)
    
    try:
        # ✅ 로그인한 유저: user_id 가져오기
        user_id = await get_user_id(db,request,response)

        # 로그인한 유저: 좋아요 여부, 투표 여부 포함해서 주제 반환
        topic_response = await TopicService.get_topics_to_responses(db,topics ,user_id)
    except HTTPException:
        # 🚫 로그인하지 않은 유저: 기본 주제 정보만 반환
        topic_response = await TopicService.get_topics_to_responses(db, topics)

    return topic_response

@router.post("/topic", response_model=TopicSchemas)
async def create_topic_route(topic: TopicCreate, user_id: int = Depends(get_user_id), db: AsyncSession = Depends(get_db)):
    db_topic = await TopicCrud.create(db=db, topic_data=topic)
    await db.commit()
    await db.refresh(db_topic)
    return db_topic
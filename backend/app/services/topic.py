
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.crud import VoteCrud, TopicCrud, LikeCrud
from app.db.schemas.topic import TopicResponse
from sqlalchemy import select, desc, func
from app.db.models import Topic, Vote, TopicLike

class TopicService:
    
    @staticmethod
    def get_topic(db, user_id):
        topics = TopicCrud.get_all()
        
        topics
    
    async def get_topic_response(db: AsyncSession, topic_id: int, user_id: int) -> TopicResponse:
        topic = await TopicCrud.get(db, topic_id)
        like_count = await LikeCrud.get_topic_like_count(db, topic_id)
        is_liked = await LikeCrud.is_topic_liked_by_user(db, topic_id, user_id)
        vote = await VoteCrud.get_vote_by_topic_and_user(db, topic_id, user_id)
        has_voted = vote is not None
        user_vote_index = vote.vote_index if has_voted else None
        # 4. TopicResponse 스키마로 데이터 반환
        topic_response = TopicResponse(
            user_id=topic.user_id,
            topic_id=topic.topic_id,
            title=topic.title,
            description=topic.description,
            vote_options=topic.vote_options,
            created_at=topic.created_at,
            like_count=like_count,
            has_liked=is_liked,
            has_voted=has_voted,
            user_vote_index=user_vote_index
        )

        return topic_response
    
    
    @staticmethod
    async def get_topics_with_filters(
        db: AsyncSession,
        user_id: int | None = None,
        order_by: str = "created_at",  # 기본 정렬 기준
        limit: int = 10,               # 기본 가져올 개수
        offset: int = 0                # 기본 시작 위치
    ):
        # 1. 기본 쿼리 생성
        query = select(Topic)

        # 2. 정렬 조건 설정
        if order_by == "created_at":
            query = query.order_by(desc(Topic.created_at))  # 최신순
        elif order_by == "like_count":
            query = (
                select(Topic, func.count(TopicLike.like_id).label("like_count"))
                .outerjoin(TopicLike, Topic.topic_id == TopicLike.topic_id)
                .group_by(Topic.topic_id)
                .order_by(desc("like_count"))
            )
        elif order_by == "vote_count":
            query = (
                select(Topic, func.count(Vote.vote_id).label("vote_count"))
                .outerjoin(Vote, Topic.topic_id == Vote.topic_id)
                .group_by(Topic.topic_id)
                .order_by(desc("vote_count"))
            )

        # 3. LIMIT 및 OFFSET 적용
        query = query.limit(limit).offset(offset)

        # 4. 쿼리 실행
        result = await db.execute(query)
        topics: list[Topic] = result.scalars().all()

        return topics

    async def get_topics_to_responses(db: AsyncSession, topics: list[Topic], user_id: int | None = None) -> list[TopicResponse]:
        topic_responses = []
        for topic in topics:
            like_count = await LikeCrud.get_topic_like_count(db, topic.topic_id)
            votes = await VoteCrud.get_votes_by_topic(db, topic.topic_id)
            vote_results = [0] * len(topic.vote_options)  # 투표 옵션 수만큼 0으로 초기화
            for vote in votes:
                if 0 <= vote.vote_index < len(vote_results):
                    vote_results[vote.vote_index] += 1

            topic_response = TopicResponse(
                user_id=topic.user_id,
                topic_id=topic.topic_id,
                title=topic.title,
                description=topic.description,
                vote_options=topic.vote_options,
                created_at=topic.created_at,
                vote_results= vote_results,
                like_count=like_count,
                total_vote=len(votes)
            )
            
            if user_id is not None:
                has_liked = await LikeCrud.is_topic_liked_by_user(db, topic.topic_id, user_id)
                vote = await VoteCrud.get_vote_by_topic_and_user(db, topic.topic_id, user_id)
                has_voted = vote is not None
                user_vote_index = vote.vote_index if vote else None
                
                topic_response.has_voted = has_voted
                topic_response.user_vote_index = user_vote_index
                topic_response.has_liked = has_liked
                
            topic_responses.append(topic_response)

        return topic_responses
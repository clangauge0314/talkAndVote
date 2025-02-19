import json
import random
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.db.crud import VoteCrud
import logging
import collections

from app.core.redis import RedisClient
from app.db.schemas.vote import VoteCreate

logger = logging.getLogger(__name__)

class VoteService:
    @staticmethod
    async def get_vote(db: AsyncSession, topic_id: int, time_range: str | None = None):
        """ 시간별 투표 데이터를 가져와 {vote_index: {퍼센트, 개수}} 형식으로 변환 """
        
        votes = await VoteCrud.get_votes_by_topic(db, topic_id, time_range)

        data = {}
        for time_str, vote_index, vote_count in votes:
            # ✅ 문자열을 datetime으로 변환
            time_obj = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
            formatted_time = time_obj.strftime("%Y-%m-%d %H:%M:%S")  # 다시 포맷팅

            if formatted_time not in data:
                data[formatted_time] = {}

            data[formatted_time][vote_index] = {
                "count": vote_count,
                "percent": 0  # 퍼센트 계산 후 업데이트
            }

        # ✅ 퍼센트 계산
        for time_str, vote_data in data.items():
            total_votes = sum(v["count"] for v in vote_data.values())
            if total_votes > 0:
                for vote_index in vote_data:
                    vote_data[vote_index]["percent"] = round((vote_data[vote_index]["count"] / total_votes) * 100, 2)

        return data
    
    
    @staticmethod
    async def generate_large_votes(db: AsyncSession, topic_id: int, num_votes: int = 1000):
        """ 특정 주제(topic_id)에 대해 대량의 테스트용 투표 데이터 생성 """
        
        now = datetime.now(timezone.utc)
        redis = await RedisClient.get_redis()

        for _ in range(num_votes):
            # ✅ 랜덤한 시간대 설정 (최근 30일 내)
            random_time = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))

            # ✅ 랜덤한 사용자 ID 및 선택지
            user_id = random.randint(1, 3)  # 가상의 유저 ID
            vote_index = random.randint(0, 3)  # 최대 4개의 투표 옵션 중 하나 선택

            # ✅ DB에 저장
            vote_data = VoteCreate(topic_id=topic_id, vote_index=vote_index, user_id=user_id)

            new_vote = await VoteCrud.create(db=db, vote_data=vote_data, user_id=user_id)

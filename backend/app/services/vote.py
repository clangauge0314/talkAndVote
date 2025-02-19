import json
import random
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.db.crud import VoteCrud
import logging
import collections

from app.core.redis import RedisClient
from app.db.schemas.vote import VoteCreate
from app.db.models.vote import Vote

logger = logging.getLogger(__name__)

class VoteService:
    @staticmethod
    async def get_vote(db: AsyncSession, topic_id: int, time_range: str | None = None):
        """ 
        특정 시간 범위 내에서 각 투표 옵션별 개수와 비율을 반환
        반환 형식: { 시간: { vote_index: { "count": 개수, "percent": 비율 } } }
        """
        # ✅ `time_range`에 따라 필터링 기준 설정
        time_filters = {
            "1h": (datetime.now(timezone.utc)  - timedelta(hours=1), "%Y-%m-%d %H:%M"),   # 1분 단위
            "6h": (datetime.now(timezone.utc)  - timedelta(hours=6), "%Y-%m-%d %H:%M"),   # 10분 단위
            "1d": (datetime.now(timezone.utc)  - timedelta(days=1), "%Y-%m-%d %H:00"),    # 1시간 단위
            "1w": (datetime.now(timezone.utc)  - timedelta(weeks=1), "%Y-%m-%d"),         # 1일 단위
            "1m": (datetime.now(timezone.utc) - timedelta(days=30), "%Y-%m-%d"),         # 1일 단위
        }
        
        time_filter, time_format = time_filters.get(time_range, (None, "%Y-%m-%d %H:%M:%S"))  # 기본값: 초 단위

        votes = await VoteCrud.get_votes_by_topic(db, topic_id)

        data = {}

        for time_str, vote_index, vote_count in votes:
            # ✅ MySQL이 반환한 문자열을 datetime으로 변환
            time_obj = datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
            formatted_time = time_obj.strftime(time_format)  # 설정한 단위로 포맷

            if formatted_time not in data:
                data[formatted_time] = {}

            data[formatted_time][vote_index] = {
                "count": vote_count,
                "percent": 0  # 퍼센트는 나중에 계산
            }

        # ✅ 각 시간대별로 퍼센트 계산
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
        votes = []

        for i in range(num_votes):
            # ✅ 랜덤한 시간대 설정 (최근 30일 내)
            random_time = now - timedelta(days=random.randint(0, 30), hours=random.randint(0, 23))

            # ✅ 랜덤한 사용자 ID 및 선택지
            vote_index = random.randint(0, 3)  # 최대 4개의 투표 옵션 중 하나 선택

            # ✅ DB에 저장
            vote_data = VoteCreate(topic_id=topic_id, vote_index=vote_index)

            vote = Vote(user_id=i,created_at = random_time , **vote_data.model_dump())
            db.add(vote)
            votes.append(vote)
        
        await db.flush()  # 세션에 반영
        for vote in votes:
            await db.refresh(vote)  # ✅ 커밋 전에 refresh 수행

        await db.commit()  # 🔥 최종적으로 커밋

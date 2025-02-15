from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.db.crud import VoteCrud
import logging

logger = logging.getLogger(__name__)

class VoteService:
    @staticmethod
    async def get_vote_time_series(db: AsyncSession, topic_id: int, time_range: str):
        """
        주어진 시간 범위(time_range)에 따라 해당 주제(topic_id)의 투표 데이터를 가져옴.
        """
        # ✅ 현재 시간 기준으로 시작 시간 계산
        now = datetime.now(timezone.utc())
        time_map = {
            "1h": now - timedelta(hours=1),
            "6h": now - timedelta(hours=6),
            "1d": now - timedelta(days=1),
            "1w": now - timedelta(weeks=1),
            "1m": now - timedelta(days=30),  # 1달을 30일로 설정
        }
        
        if time_range not in time_map:
            raise ValueError("Invalid time_range. Choose from ['1h', '6h', '1d', '1w', '1m']")
        
        start_time = time_map[time_range]

        # ✅ VoteCrud에서 데이터 가져오기
        votes = await VoteCrud.get_vote_time_series(db, topic_id, start_time)

        logger.info(votes)
        # ✅ 데이터를 JSON 형태로 변환
        data = {}
        for time, vote_index, vote_count in votes:
            time_str = time.strftime("%Y-%m-%d %H:%M:%S")  # 시간 포맷 변환
            if time_str not in data:
                data[time_str] = {}
            data[time_str][vote_index] = vote_count

        return data

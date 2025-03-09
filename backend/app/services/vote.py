import json
import random
import re
from zoneinfo import ZoneInfo
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timedelta, timezone
from app.db.crud import VoteCrud
import logging
import collections

from app.core.redis import RedisClient
from app.db.schemas.vote import VoteCreate
from app.db.models.vote import Vote
from app.db.crud.topic import TopicCrud

logger = logging.getLogger(__name__)


class VoteService:
    @staticmethod
    async def get_vote(db: AsyncSession, topic_id: int, interval: str, time_range: str):
        """
        특정 시간 범위 내에서 각 투표 옵션별 **누적** 개수와 비율을 반환
        반환 형식:
        {
          "2025-02-19T10:00:00+00:00": {
              0: {"count": 누적개수, "percent": 비율},
              1: {"count": 누적개수, "percent": 비율},
              ...
          },
          "2025-02-19T10:10:00+00:00": { ... },
          ...
        }

        - time_range: "1h", "3d", "1w", "1m" 등 (여기서 "m"은 30일 기준 한 달)
        - interval: 구간 단위, 예) "10m", "1h", "1d", "1w" (여기서 "m"은 분 단위)
        """
        now = datetime.now(ZoneInfo("Asia/Seoul"))

        time_delta = VoteService.parse_interval(time_range)
        interval_delta = VoteService.parse_interval(interval)

        start_time = now - time_delta

        # Topic 정보를 가져와 투표 옵션의 개수 확인
        topic = await TopicCrud.get(db=db, topic_id=topic_id)
        vote_option_len = len(topic.vote_options)

        # start_time부터 now까지의 투표 조회
        votes = await VoteCrud.get_votes_in_range(db, topic_id, delta=time_delta)

        # 투표를 생성 시간 기준으로 정렬 (누적 계산에 용이)
        votes_sorted: list[Vote] = sorted(votes, key=lambda vote: vote.created_at)
        n_votes = len(votes_sorted)
        pointer = 0  # 정렬된 리스트에서 현재 위치

        # 누적 결과를 저장할 딕셔너리 (각 옵션별 누적 카운스)
        cumulative_counts = {i: 0 for i in range(vote_option_len)}
        result = {}
        current_time = start_time

        # start_time부터 now까지 interval 단위로 구간을 순회
        while current_time < now:
            next_time = current_time + interval_delta

            # 현재 구간에 포함되는 투표들을 누적하여 카운트 갱신
            while (
                pointer < n_votes
                and votes_sorted[pointer].created_at.replace(
                    tzinfo=ZoneInfo("Asia/Seoul")
                )
                < next_time
            ):

                vote = votes_sorted[pointer]
                cumulative_counts[vote.vote_index] += 1
                pointer += 1

            total = sum(cumulative_counts.values())
            stats = {}
            for i in range(vote_option_len):
                count = cumulative_counts[i]
                percent = round((count / total * 100), 2) if total > 0 else 0
                stats[i] = {"count": count, "percent": percent}

            result[current_time.strftime("%Y-%m-%d %H:%M")] = stats

            current_time = next_time

        return result

    async def get_votes_all(db: AsyncSession, topic_id: int):
        votes = await VoteCrud.get_votes_by_topic(db=db, topic_id=topic_id)
        topic = await TopicCrud.get(db=db, topic_id=topic_id)
        vote_option_len = len(topic.vote_options)
        return VoteService.aggregate_votes(votes, vote_option_len)

    async def get_votes_range(db: AsyncSession, topic_id: int, time_range: str):
        votes = await VoteCrud.get_votes_in_range(
            db=db, topic_id=topic_id, delta=VoteService.parse_interval(time_range)
        )
        topic = await TopicCrud.get(db=db, topic_id=topic_id)
        vote_option_len = len(topic.vote_options)
        return VoteService.aggregate_votes(votes, vote_option_len)

    @staticmethod
    def aggregate_votes(votes: list[Vote], vote_option_len: int):
        """옵션별 개수와 백분율을 계산하는 함수"""
        counts = {i: 0 for i in range(vote_option_len)}
        for vote in votes:
            counts[vote.vote_index] += 1

        total = sum(counts.values())
        return {
            str(i): {
                "count": counts.get(i, 0),
                "percent": (counts.get(i, 0) / total * 100) if total > 0 else 0,
            }
            for i in range(len(counts))
        }

    @staticmethod
    def parse_interval(interval_str: str) -> timedelta:
        match = re.match(r"(\d+)([mhdws])$", interval_str)
        if not match:
            raise HTTPException(
                status_code=400,
                detail="Invalid interval format. Use '10m', '1h', '1d', or '1w'.",
            )

        value, unit = match.groups()
        value = int(value)
        return {
            "s": timedelta(seconds=value),
            "m": timedelta(minutes=value),
            "h": timedelta(hours=value),
            "d": timedelta(days=value),
            "w": timedelta(weeks=value),
        }[unit]

    @staticmethod
    async def generate_large_votes(
        db: AsyncSession, topic_id: int, num_votes: int = 1000
    ):
        """특정 주제(topic_id)에 대해 대량의 테스트용 투표 데이터 생성"""

        now = datetime.now(ZoneInfo("Asia/Seoul"))
        votes = []

        for i in range(num_votes):
            # ✅ 랜덤한 시간대 설정 (최근 30일 내)
            random_time = now - timedelta(
                days=random.randint(0, 30),
                hours=random.randint(0, 23),
                minutes=random.randint(0, 59),
                seconds=random.randint(0, 59),
            )

            # ✅ 랜덤한 사용자 ID 및 선택지
            vote_index = random.randint(0, 3)  # 최대 4개의 투표 옵션 중 하나 선택

            # ✅ DB에 저장
            vote_data = VoteCreate(topic_id=topic_id, vote_index=vote_index)

            vote = Vote(user_id=i, created_at=random_time, **vote_data.model_dump())
            db.add(vote)
            votes.append(vote)

        await db.flush()  # 세션에 반영
        for vote in votes:
            await db.refresh(vote)  # ✅ 커밋 전에 refresh 수행

        await db.commit()  # 🔥 최종적으로 커밋

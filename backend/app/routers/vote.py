from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.crud import VoteCrud
from app.db.schemas.vote import VoteCreate, VoteResponse
from app.services import VoteService

router = APIRouter(prefix="/vote", tags=["Vote"])

# ✅ 1. 투표 생성 (POST /vote/)
@router.post("/", response_model=VoteResponse)
async def create_vote(
    vote_data: VoteCreate,
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db)
):
    # 유저가 이미 해당 주제에 투표했는지 확인
    existing_vote = await VoteCrud.get_vote_by_topic_and_user(db, vote_data.topic_id, user_id)
    if existing_vote:
        raise HTTPException(status_code=400, detail="You have already voted for this topic.")
    
    # 투표 생성
    new_vote = await VoteCrud.create(db=db, vote_data=vote_data, user_id=user_id)
    return new_vote

@router.get("/topic/{topic_id}")
async def get_votes_by_topic(
    topic_id: int,
    time_range: str | None = Query(None, description="조회할 기간 (예: 1h, 6h, 1d, 1w, 1m, 2d, 3w)"),
    interval: str | None = Query(None, description="데이터를 그룹화할 단위 시간 (예: 5m, 1h, 6h, 1d)"),
    db: AsyncSession = Depends(get_db)
):
    """
    특정 주제의 투표 데이터를 가져옴.
    - `time_range`: 조회할 기간 (예: `1h`, `3d`, `2w`)
    - `interval`: 데이터를 그룹화할 단위 시간 (예: `5m`, `1h`, `1d`)
    """

    if not time_range:
        votes = await VoteService.get_votes_all(db, topic_id)
    elif interval:
        votes = await VoteService.get_vote(db, topic_id, interval, time_range)
    else:
        votes = await VoteService.get_votes_range(db, topic_id, time_range)

    return votes


# ✅ 3. 특정 유저의 투표 내역 조회 (GET /vote/user/{user_id})
@router.get("/user", response_model=list[VoteResponse])
async def get_votes_by_user(
    user_id: int = Depends(get_user_id),
    db: AsyncSession = Depends(get_db)
):
    votes = await VoteCrud.get_votes_by_user(db, user_id)
    return votes

@router.post("/generate/{topic_id}")
async def generate_large_votes(
    topic_id: int,
    num_votes: int = 1000,  # 기본적으로 1000개의 투표 생성
    db: AsyncSession = Depends(get_db)
):
    return await VoteService.generate_large_votes(db, topic_id, num_votes)
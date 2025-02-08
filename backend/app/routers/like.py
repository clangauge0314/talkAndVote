from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.core.auth import get_user_id
from app.db.crud.topic import TopicCrud
from app.db.schemas.topic import TopicCreate, TopicResponse, TopicSchemas
from app.services.topic import TopicService

router = APIRouter() 
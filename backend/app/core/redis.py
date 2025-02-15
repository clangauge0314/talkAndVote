import aioredis
import os
from app.core.config import Config

class RedisClient:
    _redis = None

    @classmethod
    async def get_redis(cls):
        if cls._redis is None:
            cls._redis = await aioredis.from_url(Config.REDIS_URL, decode_responses=True)
        return cls._redis

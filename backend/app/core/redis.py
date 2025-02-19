import redis.asyncio as redis

class RedisClient:
    _redis = None

    @staticmethod
    async def get_redis():
        """ Redis 클라이언트 인스턴스를 반환 (싱글톤) """
        if RedisClient._redis is None:
            RedisClient._redis = redis.Redis(
                host="redis",  # Docker Compose에서 Redis 서비스 이름
                port=6379,
                decode_responses=True
            )
        return RedisClient._redis

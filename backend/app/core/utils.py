from sqlalchemy.ext.declarative import DeclarativeMeta
from sqlalchemy.ext.asyncio import AsyncSession


async def to_dict(instance, db: AsyncSession):
    if isinstance(instance.__class__, DeclarativeMeta):
        await db.refresh(instance)
        return {c.name: getattr(instance, c.name) for c in instance.__table__.columns}
    else:
        try:
            return dict(instance)
        except TypeError:
            try:
                return vars(instance)
            except TypeError:
                return instance

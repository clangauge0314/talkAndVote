import jwt
from django.conf import settings
from datetime import datetime, timedelta, timezone


def generate_email_token(user):
    payload = {
        "user_id": user.id,
        "exp": datetime.now(timezone.utc) + timedelta(hours=24),  # 24시간 유효
        "iat": datetime.now(timezone.utc),
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")
    return token

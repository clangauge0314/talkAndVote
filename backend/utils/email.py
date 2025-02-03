from django.conf import settings
from django.core.mail import send_mail
from utils.config import Config


def send_verification_email(email: str, token: str) -> None:
    """사용자에게 이메일 인증 링크 전송"""
    verification_url = f"{Config.BACKEND_URL}/auth/verify-email/?token={token}"

    send_mail(
        "이메일 인증을 완료해주세요",
        f"아래 링크를 클릭하여 이메일 인증을 완료하세요: {verification_url}",
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )

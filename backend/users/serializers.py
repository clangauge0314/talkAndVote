from typing import Any
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer, CharField, EmailField
from django.core.mail import send_mail
from utils.token import generate_email_token

User = get_user_model()


# Signup Serializer and View
class SignupSerializer(Serializer):
    username: CharField = CharField(max_length=150)
    email: EmailField = EmailField()
    password: CharField = CharField(write_only=True)

    def validate_email(self, email: str) -> str:
        if User.objects.filter(email=email).exists():
            raise ValidationError("이미 가입된 이메일입니다.")  # ✅ 메시지만 반환
        return email

    def validate_username(self, username: str) -> str:
        if User.objects.filter(username=username).exists():
            raise ValidationError("이미 있는 유저 이름입니다.")  # ✅ 메시지만 반환
        return username

    def create(self, validated_data: dict[str, Any]):
        """사용자 생성 + 이메일 인증 메일 발송"""
        user = User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
            is_active=False,  # 이메일 인증 전까지 비활성화 상태
        )

        # 이메일 인증 토큰 생성
        token = generate_email_token(user)

        # 이메일 전송
        self.send_verification_email(user.email, token)

        return user

    def send_verification_email(self, email: str, token: str) -> None:
        """사용자에게 이메일 인증 링크 전송"""
        verification_url = f"http://localhost:8000/api/auth/verify-email/?token={token}"

        send_mail(
            "이메일 인증을 완료해주세요",
            f"아래 링크를 클릭하여 이메일 인증을 완료하세요: {verification_url}",
            settings.EMAIL_HOST_USER,
            [email],
            fail_silently=False,
        )


class LoginSerializer(Serializer):
    email = EmailField()
    password = CharField(write_only=True)

    def validate(self, data: dict[str, Any]):
        email = data.get("email")
        password = data.get("password")

        # 사용자 존재 여부 확인
        user = User.objects.filter(email=email).first()
        if not user:
            raise ValidationError("사용자를 찾을 수 없습니다.")  # ✅ 메시지만 반환

        # 사용자 계정 활성화 상태 확인
        if not user.is_active:
            raise ValidationError("계정이 비활성화되었습니다.")  # ✅ 메시지만 반환

        # 비밀번호 확인
        if not user.check_password(password):
            raise ValidationError("잘못된 비밀번호입니다.")  # ✅ 메시지만 반환

        return user

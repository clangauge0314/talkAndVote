from typing import Any
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer, CharField, EmailField

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
        return User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
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

        # 로그인 상태 확인 (is_logged_in 필드가 있다고 가정)
        if hasattr(user, "is_logged_in") and user.is_logged_in:
            raise ValidationError("이미 로그인된 사용자입니다.")  # ✅ 메시지만 반환

        # 비밀번호 확인
        if not user.check_password(password):
            raise ValidationError("잘못된 비밀번호입니다.")  # ✅ 메시지만 반환

        return user

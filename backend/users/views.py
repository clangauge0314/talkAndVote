from typing import Any
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import Serializer, CharField, EmailField
from rest_framework.permissions import AllowAny, IsAuthenticated

User = get_user_model()


# Helper function to get client IP
def get_client_ip(request: Request) -> str:
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0]
    return request.META.get("REMOTE_ADDR")


# Signup Serializer and View
class SignupSerializer(Serializer):
    username: CharField = CharField(max_length=150)
    email: EmailField = EmailField()
    password: CharField = CharField(write_only=True)

    def validate_email(self, email: str) -> str:
        if User.objects.filter(email=email).exists():
            raise ValidationError("이미 가입된 이메일입니다.")
        return email

    def validate_username(self, username: str) -> str:
        if User.objects.filter(username=username).exists():
            raise ValidationError("이미 사용된 사용자 이름입니다.")
        return username

    def create(self, validated_data: dict[str, Any]):
        return User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
        )


class SignupView(APIView):
    permission_classes = [AllowAny]  # 로그인은 누구나 접근 가능

    def post(self, request: Request) -> Response:
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "회원가입이 완료되었습니다."},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Login Serializer and View
class LoginSerializer(Serializer):
    email: EmailField = EmailField()
    password: CharField = CharField(write_only=True)

    def validate(self, data: dict[str, Any]):
        email: str = data.get("email")
        password: str = data.get("password")

        user = User.objects.filter(email=email).first()
        if not user:
            raise ValidationError({"email": "사용자를 찾을 수 없습니다."})
        if not user.is_active:
            raise ValidationError({"email": "계정이 비활성화되었습니다."})
        if user.is_logged_in:
            raise ValidationError({"email": "이미 로그인된 사용자입니다."})
        if not user.check_password(password):
            raise ValidationError({"password": "잘못된 비밀번호입니다."})

        return user


class LoginView(APIView):
    permission_classes = [AllowAny]  # 로그인은 누구나 접근 가능

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh: RefreshToken = RefreshToken.for_user(user)
            ip_address: str = get_client_ip(request)

            # Update user login status
            user.is_logged_in = True
            user.ip_address = ip_address
            user.save()

            # Set cookies for access and refresh tokens
            response = Response(
                {
                    "message": "로그인 성공",
                },
                status=status.HTTP_200_OK,
            )
            response.set_cookie(
                key="access_token",
                value=str(refresh.access_token),
                httponly=True,
                secure=True,
                samesite="Strict",
            )
            response.set_cookie(
                key="refresh_token",
                value=str(refresh),
                httponly=True,
                secure=True,
                samesite="Strict",
            )
            return response

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Logout View
class LogoutView(APIView):
    def post(self, request: Request) -> Response:
        if request.user.is_authenticated:
            user = request.user
            user.is_logged_in = False
            user.save()

            response = Response({"message": "로그아웃 성공"}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response

        return Response(
            {"message": "로그인된 사용자가 아닙니다."}, status=status.HTTP_403_FORBIDDEN
        )

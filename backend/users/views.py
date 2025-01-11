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

def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


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


class LoginSerializer(Serializer):
    email = EmailField()
    password = CharField(write_only=True)

    def validate(self, data: dict[str, Any]):
        email = data.get("email")
        password = data.get("password")

        # 사용자 존재 여부 확인
        user = User.objects.filter(email=email).first()
        if not user:
            raise ValidationError(
                {"email": "사용자를 찾을 수 없습니다."}, code="user_not_found"
            )

        # 사용자 계정 활성화 상태 확인
        if not user.is_active:
            raise ValidationError(
                {"email": "계정이 비활성화되었습니다."}, code="inactive_account"
            )

        # 로그인 상태 확인
        if user.is_logged_in:
            raise ValidationError(
                {"email": "이미 로그인된 사용자입니다."}, code="already_logged_in"
            )

        # 비밀번호 확인
        if not user.check_password(password):
            raise ValidationError(
                {"password": "잘못된 비밀번호입니다."}, code="invalid_password"
            )

        return user


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            ip_address = get_client_ip(request)

            # 사용자 상태 업데이트
            user.is_logged_in = True
            user.ip_address = ip_address
            user.save()

            # 쿠키에 토큰 설정
            response = Response({"message": "로그인 성공"}, status=status.HTTP_200_OK)
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
                max_age=86400,
            )
            return response

        # 에러 응답 처리
        error_response = {
            "status_code": status.HTTP_400_BAD_REQUEST,
            "error": "ValidationError",
            "message": "입력값이 유효하지 않습니다.",
            "details": serializer.errors,
        }
        if serializer.errors.get("non_field_errors"):
            error_response["error"] = "AuthenticationError"
            error_response["message"] = serializer.errors["non_field_errors"][0]

        return Response(error_response, status=status.HTTP_400_BAD_REQUEST)


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

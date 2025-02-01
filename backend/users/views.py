from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from users.serializers import LoginSerializer, SignupSerializer

User = get_user_model()


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip


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

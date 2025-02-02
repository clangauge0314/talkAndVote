import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from users.serializers import LoginSerializer, SignupSerializer
from jwt.exceptions import ExpiredSignatureError, DecodeError

User = get_user_model()


def get_client_ip(request):
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    return (
        x_forwarded_for.split(",")[0]
        if x_forwarded_for
        else request.META.get("REMOTE_ADDR")
    )


class SignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = SignupSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

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

            user.is_logged_in = True
            user.ip_address = ip_address
            user.save()

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

        return Response(
            {"error": "입력값이 유효하지 않습니다.", "details": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


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


class VerifyEmailView(APIView):
    def get(self, request):
        token = request.GET.get("token")

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=payload["user_id"])

            if not user.is_active:
                user.is_active = True
                user.save()
                return Response(
                    {"message": "이메일 인증이 완료되었습니다."},
                    status=status.HTTP_200_OK,
                )

            return Response(
                {"message": "이미 인증된 이메일입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        except ExpiredSignatureError:
            return Response(
                {"error": "인증 링크가 만료되었습니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except DecodeError:
            return Response(
                {"error": "유효하지 않은 토큰입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "유효하지 않은 사용자입니다."},
                status=status.HTTP_400_BAD_REQUEST,
            )

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
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


class VerifyTokensView(APIView):
    """JWT AccessToken & RefreshToken 검증 + 자동 로그아웃"""

    def post(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        if not access_token:
            return self.logout_response("AccessToken이 없습니다.")

        try:
            # AccessToken 검증
            decoded_access = AccessToken(access_token)
            user = User.objects.get(id=decoded_access["user_id"])
            return Response(
                {"message": "AccessToken이 유효합니다.", "user": user.email},
                status=status.HTTP_200_OK,
            )

        except ExpiredSignatureError:
            # AccessToken 만료 → RefreshToken 검증 시도
            if not refresh_token:
                return self.logout_response(
                    "RefreshToken이 없습니다. 다시 로그인하세요."
                )

            try:
                decoded_refresh = RefreshToken(refresh_token)
                user = User.objects.get(id=decoded_refresh["user_id"])

                # 새로운 AccessToken 발급
                new_access_token = str(AccessToken.for_user(user))

                response = Response(
                    {
                        "message": "AccessToken이 만료되어 RefreshToken으로 갱신되었습니다.",
                        "access_token": new_access_token,
                    },
                    status=status.HTTP_200_OK,
                )
                response.set_cookie(
                    "access_token",
                    new_access_token,
                    httponly=True,
                    secure=True,
                    samesite="Strict",
                )
                return response

            except ExpiredSignatureError:
                return self.logout_response(
                    "RefreshToken이 만료되었습니다. 다시 로그인하세요."
                )
            except DecodeError:
                return self.logout_response("유효하지 않은 RefreshToken입니다.")

        except DecodeError:
            return self.logout_response("유효하지 않은 AccessToken입니다.")

    def logout_response(self, error_message):
        """JWT 검증 실패 시 자동 로그아웃 응답"""
        response = Response(
            {"error": error_message}, status=status.HTTP_401_UNAUTHORIZED
        )
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response

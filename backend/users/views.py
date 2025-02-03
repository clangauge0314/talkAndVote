import jwt
from django.conf import settings
from django.contrib.auth import get_user_model, login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from users.serializers import LoginSerializer, SignupSerializer
from jwt.exceptions import ExpiredSignatureError, DecodeError
from utils.utils import jwt_required

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
            backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user, backend=backend)
            
            user.is_logged_in = True
            user.save()
            
            refresh = RefreshToken.for_user(user)
            response = Response({
                'message': '로그인 성공',
                'user': {
                    'email': user.email,
                    'username': user.username,
                    'is_logged_in': user.is_logged_in,
                }
            }, status=status.HTTP_200_OK)
            
            response.set_cookie(
                'refresh_token',
                str(refresh),
                httponly=True,
                samesite='Lax'
            )
            response.set_cookie(
                'access_token',
                str(refresh.access_token),
                httponly=True,
                samesite='Lax'
            )
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    @jwt_required
    def post(self, request: Request) -> Response:
        try:
            access_token = request.COOKIES.get('access_token')
            if access_token:
                user = request.user
                user.is_logged_in = False
                user.save()

            response = Response({"message": "로그아웃 성공"}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
            
        except Exception:
            response = Response({"message": "로그아웃 성공"}, status=status.HTTP_200_OK)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response


class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

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
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpRequest
from rest_framework_simplejwt.tokens import RefreshToken
import json

User = get_user_model()


@csrf_exempt
def signup(req: HttpRequest):
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            username = data.get("username")
            email = data.get("email")
            password = data.get("password")

            if not email or not password or not username:
                return JsonResponse(
                    {"message": "올바르지 않은 입력입니다"},
                    status=400,
                )

            if User.objects.filter(email=email).exists():
                return JsonResponse(
                    {"message": "이미 가입된 이메일입니다."}, status=400
                )

            if User.objects.filter(username=username).exists():
                return JsonResponse(
                    {"message": "이미 사용된 사용자 이름입니다."}, status=400
                )

            user = User.objects.create(
                username=username, password=make_password(password), email=email
            )
            return JsonResponse({"message": "회원가입이 완료되었습니다."}, status=201)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    return JsonResponse({"message": "잘못된 요청 방법입니다."}, status=405)


@csrf_exempt
def login(req: HttpRequest):
    if req.method == "POST":
        try:
            data = json.loads(req.body)
            email = data.get("email")
            password = data.get("password")

            if not email or not password:
                return JsonResponse(
                    {"message": "이메일 또는 비밀번호는 필수입니다."},
                    status=400,
                )

            # 1. JWT 절대로 사용자한테 보내지말고 cookie로 localStorage 안되면
            # 2. user 모델 isActive 활/비활 boolean, failedLoginAttempts = 0 1 2 3 4 5
            # 3. 비밀번호 5회 틀리면 비활
            # 4. ipAddress 저장
            # 5. 로그인 성공 시 isLoggedIn = true, 중복 로그인 방지
            # 6. 여론조사 모델 까지만
            user = User.objects.filter(email=email).first()
            if user and user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return JsonResponse(
                    {
                        "message": "로그인 성공",
                        "access_token": str(refresh.access_token),
                        "refresh_token": str(refresh),
                    },
                    status=200,
                )
            else:
                return JsonResponse({"message": "잘못된 비밀번호입니다."}, status=401)
        except Exception as e:
            return JsonResponse({"message": str(e)}, status=500)
    return JsonResponse({"message": "잘못된 요청 방법입니다."}, status=405)

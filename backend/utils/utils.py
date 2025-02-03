import jwt
from django.conf import settings
from django.http import JsonResponse
from users.models import User

def jwt_required(view_func):
    def wrapper(request, *args, **kwargs):
        try:
            token = request.COOKIES.get('access_token')
            if not token:
                return JsonResponse({'error': '토큰이 없습니다.'}, status=401)

            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
            user = User.objects.get(id=payload["user_id"])
            request.user = user  

            return view_func(request, *args, **kwargs)
        
        except jwt.ExpiredSignatureError:
            return JsonResponse({'error': '토큰이 만료되었습니다.'}, status=401)
        except jwt.DecodeError:
            return JsonResponse({'error': '유효하지 않은 토큰입니다.'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': '사용자를 찾을 수 없습니다.'}, status=404)

    return wrapper

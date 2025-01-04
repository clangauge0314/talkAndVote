from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.permissions import AllowAny


class PingView(APIView):
    permission_classes = [AllowAny]  # 로그인은 누구나 접근 가능

    def post(self, request: Request) -> Response:
        data = {"message": "ping!"}
        return Response(data)


def test(request):
    if request.method == "GET":
        data = {
            "message": "Hello, this is a GET response!",
        }
        return JsonResponse(data)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

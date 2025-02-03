from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .profile_serializers import ProfileSerializer, ProfileUpdateSerializer
from utils.utils import jwt_required

User = get_user_model()

class ProfileView(APIView):
    @jwt_required
    def get(self, request):
        """프로필 조회"""
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)

    @jwt_required
    def put(self, request):
        """프로필 수정"""
        serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(ProfileSerializer(request.user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @jwt_required
    def delete(self, request):
        """회원 탈퇴"""
        user = request.user
        user.is_active = False
        user.save()
        return Response({"message": "회원 탈퇴가 완료되었습니다."}, status=status.HTTP_200_OK)

class UserProfileView(APIView):
    """다른 사용자의 프로필 조회"""
    @jwt_required
    def get(self, request, username):
        try:
            user = User.objects.get(username=username, is_active=True)
            serializer = ProfileSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response(
                {"error": "사용자를 찾을 수 없습니다."}, 
                status=status.HTTP_404_NOT_FOUND
            )

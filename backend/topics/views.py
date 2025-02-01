from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Topic, Comment, Reply
from .serializers import TopicSerializer, CommentSerializer, ReplySerializer


# ✅ 토론 주제 CRUD
class TopicListCreateView(generics.ListCreateAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [
        IsAuthenticatedOrReadOnly
    ]  # 읽기 가능, 작성은 인증된 사용자만 가능


class TopicDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]  # 수정/삭제는 인증된 사용자만 가능


# ✅ 댓글 CRUD
class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


# ✅ 대댓글 CRUD
class ReplyListCreateView(generics.ListCreateAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ReplyDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

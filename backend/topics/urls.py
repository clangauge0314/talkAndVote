from django.urls import path
from topics.views import (
    TopicListCreateView,
    TopicDetailView,
    CommentListCreateView,
    CommentDetailView,
    ReplyListCreateView,
    ReplyDetailView,
)

urlpatterns = [
    # ✅ 토론 주제 API
    path("topics/", TopicListCreateView.as_view(), name="topic-list"),
    path("topics/<int:pk>/", TopicDetailView.as_view(), name="topic-detail"),
    # ✅ 댓글 API
    path("comments/", CommentListCreateView.as_view(), name="comment-list"),
    path("comments/<int:pk>/", CommentDetailView.as_view(), name="comment-detail"),
    # ✅ 대댓글 API
    path("replies/", ReplyListCreateView.as_view(), name="reply-list"),
    path("replies/<int:pk>/", ReplyDetailView.as_view(), name="reply-detail"),
]

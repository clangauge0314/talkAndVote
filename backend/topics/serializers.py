from rest_framework import serializers
from .models import Topic, Comment, Reply


# 토론 주제 직렬화기
class TopicSerializer(serializers.ModelSerializer):
    total_comments = serializers.ReadOnlyField()
    total_votes = serializers.ReadOnlyField()
    pros = serializers.ReadOnlyField()
    cons = serializers.ReadOnlyField()
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Topic
        fields = "__all__"


# 댓글 직렬화기
class CommentSerializer(serializers.ModelSerializer):
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Comment
        fields = "__all__"


# 대댓글 직렬화기
class ReplySerializer(serializers.ModelSerializer):
    total_likes = serializers.ReadOnlyField()

    class Meta:
        model = Reply
        fields = "__all__"

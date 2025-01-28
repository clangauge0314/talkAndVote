from django.db import models
from django.conf import settings


# Create your models here.
class Topic(models.Model):
    """
    토론 주제를 저장하는 모델
    """

    title = models.CharField(max_length=255)  # 토론 제목
    description = models.TextField(blank=True, null=True)  # 설명
    created_at = models.DateTimeField(auto_now_add=True)  # 생성 시간
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_topics",
    )  # 토론 생성자

    def __str__(self):
        return self.title

    @property
    def total_votes(self):
        return self.votes.count()

    @property
    def pros(self):
        return self.votes.filter(choice="pro").count()

    @property
    def cons(self):
        return self.votes.filter(choice="con").count()

    def total_comments(self):
        """
        총 댓글 수 (대댓글 포함)
        """
        return self.comments.count()

    def total_likes(self):
        """
        총 좋아요 수
        """
        return self.likes.count()


class Vote(models.Model):
    """
    사용자 투표를 저장하는 모델
    """

    CHOICES = [
        ("pro", "찬성"),
        ("con", "반대"),
    ]

    topic = models.ForeignKey(
        Topic, on_delete=models.CASCADE, related_name="votes"
    )  # 연결된 토론 주제
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes",
    )  # 투표를 한 사용자
    choice = models.CharField(max_length=3, choices=CHOICES)  # 찬성 또는 반대
    created_at = models.DateTimeField(auto_now_add=True)  # 투표 시간

    class Meta:
        unique_together = ("topic", "user")  # 사용자당 한 주제에 한 번만 투표 가능

    def __str__(self):
        return f"{self.user} voted {self.choice} on {self.topic}"


class Comment(models.Model):
    """
    토론에 대한 댓글을 저장하는 모델
    """

    topic = models.ForeignKey(
        Topic, on_delete=models.CASCADE, related_name="comments"
    )  # 연결된 토론 주제
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
    )  # 댓글 작성자

    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, blank=True, null=True, related_name="replies"
    )  # 대댓글을 위한 부모 댓글
    content = models.TextField()  # 댓글 내용
    created_at = models.DateTimeField(auto_now_add=True)  # 작성 시간

    def __str__(self):
        return f"Comment by {self.user} on {self.topic}"

    @property
    def is_reply(self):
        return self.parent is not None


class Like(models.Model):
    """
    좋아요를 나타내는 모델
    """

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes"
    )
    topic = models.ForeignKey(
        Topic, on_delete=models.CASCADE, related_name="likes", blank=True, null=True
    )  # 주제에 대한 좋아요
    comment = models.ForeignKey(
        Comment, on_delete=models.CASCADE, related_name="likes", blank=True, null=True
    )  # 댓글에 대한 좋아요
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = (
            "user",
            "topic",
            "comment",
        )  # 한 사용자가 동일한 대상에 중복 좋아요 방지

    def __str__(self):
        if self.topic:
            return f"Like by {self.user} on Topic: {self.topic.title}"
        elif self.comment:
            return f"Like by {self.user} on Comment: {self.comment.content[:20]}"

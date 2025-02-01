from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    phone_number = models.CharField(max_length=15, unique=True, null=True, blank=True)
    firebase_uid = models.CharField(max_length=128, unique=True, null=True, blank=True)  # Firebase UID 저장


    date_of_birth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("male", "Male"), ("female", "Female")],
        blank=True,
        null=True,
    )
    role = models.CharField(
        max_length=50,
        choices=[("admin", "Admin"), ("user", "User")],
        default="user",
    )
    failed_login_attempts = models.IntegerField(default=0)

    ip_address = models.GenericIPAddressField(blank=True, null=True)
    is_logged_in = models.BooleanField(default=False)

    REQUIRED_FIELDS = ["email", "first_name", "last_name"]  # 추가 필수 입력 필드
    USERNAME_FIELD = "username"  # 기본 인증에 사용할 필드 (기본값: username)

    class Meta:
        ordering = ["-date_joined"]
        verbose_name = "User"
        verbose_name_plural = "Users"

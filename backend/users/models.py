from django.contrib.auth.models import AbstractUser
from django.db import models

<<<<<<< HEAD
class User(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    dateOfBirth = models.DateField(blank=True, null=True)
=======

class User(AbstractUser):

    date_of_birth = models.DateField(blank=True, null=True)
>>>>>>> bf8d4388f71d6158feb90f7e93a5f177de90a326
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

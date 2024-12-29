from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True, unique=True)
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    dateOfBirth = models.DateField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("male", "Male"), ("female", "Female")],
        blank=True,
        null=True,
    )
    dateJoined = models.DateTimeField(auto_now_add=True)
    lastLogin = models.DateTimeField(auto_now=True)
    role = models.CharField(
        max_length=50, choices=[("admin", "Admin"), ("user", "User")], default="user"
    )

    class Meta:
        ordering = ["-dateJoined"]
        verbose_name = "User"
        verbose_name_plural = "Users"

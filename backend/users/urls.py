from django.urls import path
from .views import (
    SignupView,
    LoginView,
    LogoutView,
    VerifyEmailView,
)

urlpatterns = [
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),
]

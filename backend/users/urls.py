from django.urls import path
from .views import SignupView, LoginView, LogoutView, VerifyEmailView
from .profile_views import ProfileView, UserProfileView

urlpatterns = [
    # 인증 관련 라우트
    path("signup/", SignupView.as_view(), name="signup"),
    path("login/", LoginView.as_view(), name="login"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("verify-email/", VerifyEmailView.as_view(), name="verify_email"),

    # 프로필 관련 라우트
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/<str:username>/", UserProfileView.as_view(), name="user_profile"),
]

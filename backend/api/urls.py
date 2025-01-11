from django.contrib import admin
from django.urls import include, path
from .views import PingView, test

urlpatterns = [
    path("admin/", admin.site.urls),
    path("auth/", include("users.urls")),
    path("test/", test),
    path("ping/", PingView.as_view(), name="ping"),
]

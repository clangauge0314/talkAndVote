from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User  # 커스텀 User 모델을 import

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    """
    Custom User Admin to manage users in the admin panel.
    """
    list_display = ('username', 'email', 'is_staff', 'is_active')  # 표시할 컬럼들
    list_filter = ('is_staff', 'is_active', 'date_joined')  # 필터 옵션
    search_fields = ('username', 'email')  # 검색 필드
    ordering = ('-date_joined',)  # 정렬 기준
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('email', 'first_name', 'last_name')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )

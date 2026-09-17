from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    ProfileView,
    AdminUserListManageView,
    AdminUserDetailManageView,
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="auth-register"),
    path("login/", CustomTokenObtainPairView.as_view(), name="auth-login"),
    path("refresh/", TokenRefreshView.as_view(), name="auth-refresh"),
    path("profile/", ProfileView.as_view(), name="auth-profile"),
    # Admin endpoints
    path(
        "admin/users/", AdminUserListManageView.as_view(), name="admin-user-list"
    ),
    path(
        "admin/users/<int:pk>/",
        AdminUserDetailManageView.as_view(),
        name="admin-user-detail",
    ),
]

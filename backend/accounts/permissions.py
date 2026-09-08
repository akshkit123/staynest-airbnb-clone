from rest_framework import permissions


class IsAdminUserRole(permissions.BasePermission):
    """Allows access only to Admin users."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role == "admin"
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsHostUserRole(permissions.BasePermission):
    """Allows access only to Host and Admin users."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (
                request.user.role in ["host", "admin"]
                or request.user.is_staff
                or request.user.is_superuser
            )
        )


class IsOwnerOrReadOnly(permissions.BasePermission):
    """Object-level permission to allow only owners or admins to edit/delete."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        if hasattr(obj, "host"):
            return (
                obj.host == request.user
                or request.user.role == "admin"
                or request.user.is_staff
            )
        if hasattr(obj, "user"):
            return (
                obj.user == request.user
                or request.user.role == "admin"
                or request.user.is_staff
            )
        if hasattr(obj, "guest"):
            return (
                obj.guest == request.user
                or request.user.role == "admin"
                or request.user.is_staff
            )
        return False

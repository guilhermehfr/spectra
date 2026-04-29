"""
Permission classes customizadas para controle de acesso baseado em roles.

Cada view pode usar uma dessas permissões para restringir acesso por função
do usuário (admin, therapist, family).
"""

from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAdmin(IsAuthenticated):
    """Apenas administradores podem acessar."""
    
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view) and
            request.user.role == 'admin'
        )


class IsTherapist(IsAuthenticated):
    """Apenas terapeutas podem acessar."""
    
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view) and
            request.user.role == 'therapist'
        )


class IsTherapistOrAdmin(IsAuthenticated):
    """Apenas terapeutas e administradores podem acessar."""
    
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view) and
            request.user.role in ['therapist', 'admin']
        )


class IsFamily(IsAuthenticated):
    """Apenas membros da família podem acessar."""
    
    def has_permission(self, request, view):
        return (
            super().has_permission(request, view) and
            request.user.role == 'family'
        )


class IsAdminOrReadOnly(IsAuthenticated):
    """
    Apenas admins podem editar/deletar.
    Qualquer autenticado pode visualizar.
    """
    
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False
        
        # Métodos seguros (GET, HEAD, OPTIONS) são permitidos para todos
        if request.method in ['GET', 'HEAD', 'OPTIONS']:
            return True
        
        # Modificações são apenas para admins
        return request.user.role == 'admin'

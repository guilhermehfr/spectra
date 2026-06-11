from django.http import JsonResponse
from django.urls import path

from .views import (
    CurrentUserView,
    DashboardView,
    FamilyEvolutionDetailView,
    FamilyEvolutionsListView,
    FamilyPatientView,
    LoginView,
    LogoutView,
    PatientDetailView,
    PatientListCreateView,
    RefreshView,
    SeedView,
    SessionDetailView,
    SessionListCreateView,
    TherapeuticEvolutionDetailView,
    TherapeuticEvolutionListCreateView,
    TherapistListView,
)

app_name = 'core'

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshView.as_view(), name='refresh'),
    path('auth/me/', CurrentUserView.as_view(), name='current-user'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    # Therapists endpoint
    path('therapists/', TherapistListView.as_view(), name='therapist-list'),
    # Patient endpoints
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
    path('patients/family/', FamilyPatientView.as_view(), name='patient-family'),
    # Session endpoints
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session-detail'),
    # Dashboard
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    # Evolution endpoints
    path('evolutions/', TherapeuticEvolutionListCreateView.as_view(), name='evolution-list-create'),
    path('evolutions/<int:pk>/', TherapeuticEvolutionDetailView.as_view(), name='evolution-detail'),
    path('evolutions/family/', FamilyEvolutionsListView.as_view(), name='evolution-family-list'),
    path(
        'evolutions/family/<int:pk>/',
        FamilyEvolutionDetailView.as_view(),
        name='evolution-family-detail',
    ),
    # Health check
    path('health/', lambda r: JsonResponse({'status': 'ok'}), name='health'),
    # Seed (no auth, secret-based)
    path('seed/', SeedView.as_view(), name='seed'),
]

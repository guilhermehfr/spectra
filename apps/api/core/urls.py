from django.urls import path
from .views import (
    LoginView,
    RefreshView,
    PatientListCreateView,
    PatientDetailView,
    SessionListCreateView,
    SessionDetailView,
    TherapeuticEvolutionListCreateView,
    TherapeuticEvolutionDetailView
)

app_name = 'core'

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshView.as_view(), name='refresh'),
    
    # Patient endpoints
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),

    # Session endpoints
    path('sessions/', SessionListCreateView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/', SessionDetailView.as_view(), name='session-detail'),

    # Evolution endpoints
    path('evolutions/', TherapeuticEvolutionListCreateView.as_view(), name='evolution-list-create'),
    path('evolutions/<int:pk>/', TherapeuticEvolutionDetailView.as_view(), name='evolution-detail'),
    path('evolutions/family/', FamilyEvolutionsListView.as_view(), name='evolution-family-list'),
]
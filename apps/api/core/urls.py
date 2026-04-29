from django.urls import path
from .views import (
    LoginView,
    RefreshView,
    PatientListCreateView,
    PatientDetailView,
)

app_name = 'core'

urlpatterns = [
    # Authentication endpoints
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', RefreshView.as_view(), name='refresh'),
    
    # Patient endpoints
    path('patients/', PatientListCreateView.as_view(), name='patient-list-create'),
    path('patients/<int:pk>/', PatientDetailView.as_view(), name='patient-detail'),
]
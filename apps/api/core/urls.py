from django.urls import path
from .views import PatientListCreateView

urlpatterns = [
    path("patients/", PatientListCreateView.as_view()),
]
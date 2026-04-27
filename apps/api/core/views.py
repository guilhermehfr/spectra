from rest_framework.generics import ListCreateAPIView
from .models import Patient
from .serializers import PatientSerializer

class PatientListCreateView(ListCreateAPIView):
    queryset = Patient.objects.all().order_by("-id")
    serializer_class = PatientSerializer
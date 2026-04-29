from django.db.models import QuerySet
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Patient, CustomUser, Session, TherapeuticEvolution
from .serializers import (
    PatientSerializer, 
    LoginSerializer,
    CustomUserSerializer,
    RefreshTokenSerializer,
    SessionSerializer,
    TherapeuticEvolutionSerializer
)
from .permissions import IsTherapistOrAdmin, IsAdminOrReadOnly


class LoginView(TokenObtainPairView):
    """
    Endpoint de login que retorna tokens JWT.
    
    POST /api/auth/login/
    {
        "email": "usuario@example.com",
        "password": "senha123"
    }
    
    Retorna:
    {
        "access": "jwt_token_aqui",
        "refresh": "refresh_token_aqui",
        "user": {
            "id": 1,
            "username": "usuario",
            "email": "usuario@example.com",
            "role": "therapist",
            ...
        }
    }
    """
    serializer_class = LoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=HTTP_200_OK)


class RefreshView(TokenRefreshView):
    """
    Endpoint para renovar o token de acesso usando o refresh token.
    
    POST /api/auth/refresh/
    {
        "refresh": "refresh_token_aqui"
    }
    
    Retorna:
    {
        "access": "novo_access_token_aqui"
    }
    """
    serializer_class = RefreshTokenSerializer


class PatientListCreateView(ListCreateAPIView):
    """
    Listar e criar pacientes.
    
    GET /api/patients/ - Listar todos os pacientes com ordenação / paginação / buscas
    POST /api/patients/ - Criar novo paciente (apenas therapist/admin)
    """
    queryset = Patient.objects.all().order_by("-id")
    serializer_class = PatientSerializer
    permission_classes = [IsTherapistOrAdmin]
    
    filterset_fields = ['birth_date']
    search_fields = ['name', 'guardian_name', 'guardian_email']
    ordering_fields = ['name', 'created_at']


class PatientDetailView(RetrieveUpdateDestroyAPIView):
    """
    Visualizar, atualizar ou realizar soft delete em um paciente.
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsTherapistOrAdmin]
    lookup_field = 'pk'


class SessionListCreateView(ListCreateAPIView):
    """
    Listar e criar sessões agendadas.
    """
    serializer_class = SessionSerializer
    permission_classes = [IsTherapistOrAdmin]
    
    filterset_fields = ['status', 'patient', 'therapist']
    search_fields = ['patient__name', 'therapist__username']
    ordering_fields = ['date_time']
    
    def get_queryset(self) -> QuerySet:
        qs = Session.objects.all().order_by("-id")
        user = self.request.user
        if not user.is_authenticated:
            return qs.none()
        # Terapeuta vê as suas sessões
        if getattr(user, 'is_therapist', lambda: False)():
            return qs.filter(therapist=user)
        # Admin vê todas
        return qs

    def perform_create(self, serializer) -> None:
        # Associa automaticamente ao terapeuta logado se for terapeuta
        user = self.request.user
        if user.is_authenticated and getattr(user, 'is_therapist', lambda: False)():
            serializer.save(therapist=user)
        else:
            serializer.save()


class SessionDetailView(RetrieveUpdateDestroyAPIView):
    """
    Atualizar reagendar ou cancelar sessões.
    """
    serializer_class = SessionSerializer
    permission_classes = [IsTherapistOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_therapist():
            return Session.objects.filter(therapist=user)
        return Session.objects.all()


class TherapeuticEvolutionListCreateView(ListCreateAPIView):
    """
    Listar evoluções e registrar.
    """
    serializer_class = TherapeuticEvolutionSerializer
    permission_classes = [IsTherapistOrAdmin]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_therapist():
            return TherapeuticEvolution.objects.filter(session__therapist=user)
        return TherapeuticEvolution.objects.all()


class TherapeuticEvolutionDetailView(RetrieveUpdateDestroyAPIView):
    """
    Atualizar a evolução
    """
    serializer_class = TherapeuticEvolutionSerializer
    permission_classes = [IsTherapistOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.is_therapist():
            return TherapeuticEvolution.objects.filter(session__therapist=user)
        return TherapeuticEvolution.objects.all()
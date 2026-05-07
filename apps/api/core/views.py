from django.db.models import QuerySet
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_404_NOT_FOUND
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from datetime import date

from .models import Patient, CustomUser, Session, TherapeuticEvolution
from .serializers import (
    PatientSerializer, 
    LoginSerializer,
    CustomUserSerializer,
    RefreshTokenSerializer,
    SessionSerializer,
    TherapeuticEvolutionSerializer,
    DashboardSerializer
)
from .permissions import IsTherapistOrAdmin, IsAdminOrReadOnly, IsFamilyOrReadOnly, IsFamily


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
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=HTTP_200_OK)


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
    permission_classes = [AllowAny]


class PatientListCreateView(ListCreateAPIView):
    """
    Listar e criar pacientes.
    
    GET /api/patients/ - Listar pacientes conforme o perfil:
      - Admin: todos os pacientes
      - Therapist: pacientes que têm sessão com ele
      - Family: não permitido
    POST /api/patients/ - Criar novo paciente (apenas therapist/admin)
    """
    queryset = Patient.objects.all().order_by("-id")
    serializer_class = PatientSerializer
    permission_classes = [IsTherapistOrAdmin]
    
    filterset_fields = ['birth_date']
    search_fields = ['name', 'guardian_name', 'guardian_email']
    ordering_fields = ['name', 'created_at']
    
    def get_queryset(self):
        user = self.request.user
        if user.is_admin():
            return Patient.objects.all().order_by("-id")
        if user.is_therapist():
            return Patient.objects.filter(
                sessions__therapist=user,
                is_deleted=False
            ).distinct().order_by("-id")
        return Patient.objects.none()


class PatientDetailView(RetrieveUpdateDestroyAPIView):
    """
    Visualizar, atualizar ou realizar soft delete em um paciente.
    
    Acesso: Admin (todos), Therapist (pacientes com sessão), Family (não permitido)
    """
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsTherapistOrAdmin]
    lookup_field = 'pk'
    
    def get_object(self):
        obj = super().get_object()
        user = self.request.user
        if user.is_therapist():
            if not Patient.objects.filter(
                pk=obj.pk,
                sessions__therapist=user,
                is_deleted=False
            ).exists():
                from django.http import Http404
                raise Http404("Paciente não encontrado")
        return obj


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


class DashboardView(APIView):
    """
    GET /api/dashboard/
    
    Retorna dados agregados do painel:
    - Sessões de hoje (today_sessions)
    - Total de pacientes ativos (active_patients)
    - Evoluções pendentes (pending_evolutions)
    
    Permissão: IsTherapistOrAdmin
    - Terapeutas vêm apenas seus dados
    - Admins vêem todos os dados
    """
    
    permission_classes = [IsTherapistOrAdmin]
    
    def get(self, request):
        user = request.user
        today = date.today()
        
        # 1. Get today's sessions com select_related para evitar N+1 queries
        today_sessions_qs = Session.objects.filter(
            date_time__date=today
        ).select_related('patient', 'therapist').order_by('date_time')
        
        # Filter by therapist if user is not admin
        if not user.is_admin():
            today_sessions_qs = today_sessions_qs.filter(therapist=user)
        
        # 2. Count active patients (non-deleted)
        active_patients = Patient.objects.filter(is_deleted=False).count()
        
        # 3. Count pending evolutions
        # Completed sessions without an evolution record
        pending_evolutions_qs = Session.objects.filter(
            status='completed',
            evolution__isnull=True,
            is_deleted=False
        )
        
        if not user.is_admin():
            pending_evolutions_qs = pending_evolutions_qs.filter(therapist=user)
        
        pending_evolutions = pending_evolutions_qs.count()
        
        # Serialize data
        data = {
            'today_sessions': today_sessions_qs,
            'active_patients': active_patients,
            'pending_evolutions': pending_evolutions,
        }
        
        serializer = DashboardSerializer(data)
        return Response(serializer.data, status=HTTP_200_OK)


class CurrentUserView(APIView):
    """
    GET /api/auth/me/
    
    Retorna os dados do usuário autenticado atual.
    Requer autenticação (token JWT).
    
    Retorna:
    {
        "id": 1,
        "username": "therapist1",
        "email": "therapist@example.com",
        "first_name": "Ana",
        "last_name": "Lima",
        "role": "therapist",
        "phone": "(11) 99999-9999",
        "is_active": true
    }
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if not request.user or not request.user.is_authenticated:
            return Response({'detail': 'Authentication required'}, status=401)
        
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data, status=HTTP_200_OK)


class LogoutView(APIView):
    """
    POST /api/auth/logout/
    
    Realiza o logout do usuário blacklistando o token de acesso.
    O frontend deve remover o token do armazenamento local.
    
    Requisição:
    {
        "refresh": "refresh_token_aqui"
    }
    
    Retorna:
    {
        "detail": "Logout realizado com sucesso"
    }
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        return Response({'detail': 'Logout realizado com sucesso'}, status=HTTP_200_OK)


class FamilyEvolutionsListView(ListCreateAPIView):
    """
    GET /api/evolutions/family/
    
    Lista evoluções liberadas para a família.
    Este endpoint é utilizado pelo portal da família para visualizar
    as evoluções que foram compartilhadas.
    
    Permissão: family (família) - apenas leitura
    """
    serializer_class = TherapeuticEvolutionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return TherapeuticEvolution.objects.filter(released_to_family=True).order_by('-created_at')


class FamilyPatientView(APIView):
    """
    GET /api/patients/family/
    
    Retorna o paciente associado ao email do responsável (usuário autenticado).
    Usado pelo portal da família para encontrar o paciente vinculado.
    
    Permissão: family (família)
    """
    permission_classes = [IsFamily]
    
    def get(self, request):
        user = request.user
        patient = Patient.objects.filter(
            guardian_email=user.email,
            is_deleted=False
        ).first()
        
        if not patient:
            return Response(
                {'detail': 'Nenhum paciente encontrado para este responsável.'},
                status=HTTP_404_NOT_FOUND
            )
        
        serializer = PatientSerializer(patient)
        return Response(serializer.data, status=HTTP_200_OK)

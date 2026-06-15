from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from .models import CustomUser, Patient, Session, TherapeuticEvolution


class CustomUserSerializer(serializers.ModelSerializer):
    """Serializer para o usuário customizado com role."""

    class Meta:
        model = CustomUser
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'phone',
            'is_active',
        ]
        read_only_fields = ['id', 'is_active']


class LoginSerializer(serializers.Serializer):
    """
    Serializer para login com email/username e password.
    Retorna tokens JWT (access + refresh).
    """

    email = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})
    access = serializers.CharField(read_only=True)
    refresh = serializers.CharField(read_only=True)
    user = CustomUserSerializer(read_only=True)

    def validate(self, attrs):
        """Validar credenciais e retornar tokens."""
        email = attrs.get('email')
        password = attrs.get('password')

        user = CustomUser.all_objects.filter(email=email).first()

        if not user or not user.check_password(password):
            raise serializers.ValidationError('Credenciais inválidas')

        if not user.is_active:
            raise serializers.ValidationError('Conta desativada')

        refresh = RefreshToken.for_user(user)
        refresh['tenant_id'] = user.tenant_id
        refresh['role'] = user.role

        return {
            'user': CustomUserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class RefreshTokenSerializer(serializers.Serializer):
    """Serializer para refresh do token JWT."""

    refresh = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)

    def validate(self, attrs):
        try:
            refresh = RefreshToken(attrs['refresh'])
            return {'access': str(refresh.access_token)}
        except Exception:
            raise serializers.ValidationError('Token inválido ou expirado')


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['tenant_id'] = user.tenant_id
        token['role'] = user.role
        return token


class PatientSerializer(serializers.ModelSerializer):
    """Serializer para Paciente com validações."""

    class Meta:
        model = Patient
        fields = [
            'id',
            'name',
            'birth_date',
            'guardian_name',
            'guardian_email',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_name(self, value):
        """Validar que o nome não está vazio."""
        if not value or not value.strip():
            raise serializers.ValidationError('Nome do paciente é obrigatório.')
        return value.strip()

    def validate_guardian_email(self, value):
        """Validar email do responsável se fornecido."""
        if value and not value.strip():
            return ''
        return value


class SessionSerializer(serializers.ModelSerializer):
    """Serializer para Sessões Terapêuticas."""

    patient_name = serializers.CharField(source='patient.name', read_only=True)
    therapist_name = serializers.CharField(source='therapist.get_full_name', read_only=True)

    class Meta:
        model = Session
        fields = [
            'id',
            'patient',
            'patient_name',
            'therapist',
            'therapist_name',
            'date_time',
            'status',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_date_time(self, value):
        """Não permitir agendamento no passado."""
        # Se for atualização e a data não mudou, ok. Mas para criação, não pode ser passado.
        if self.instance is None and value < timezone.now():
            raise serializers.ValidationError('Não é possível agendar uma sessão no passado.')
        return value


class TherapeuticEvolutionSerializer(serializers.ModelSerializer):
    """Serializer para Evoluções."""

    session_date = serializers.DateTimeField(source='session.date_time', read_only=True)
    therapist_name = serializers.CharField(source='session.therapist.get_full_name', read_only=True)
    author_name = serializers.SerializerMethodField()
    session_details = SessionSerializer(source='session', read_only=True)

    class Meta:
        model = TherapeuticEvolution
        fields = [
            'id',
            'session',
            'session_date',
            'therapist_name',
            'author_name',
            'session_details',
            'objective',
            'activities',
            'behavior',
            'progress',
            'next_steps',
            'released_to_family',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_author_name(self, obj):
        """Retorna o nome completo de quem criou/atualizou a evolução."""
        if obj.created_by:
            return obj.created_by.get_full_name() or obj.created_by.username
        return None

    def validate_session(self, value):
        """Validar se a sessão já possui evolução e se está marcada como realizada."""
        if self.instance is None:
            if TherapeuticEvolution.objects.filter(session=value).exists():
                raise serializers.ValidationError('Esta sessão já possui uma evolução registrada.')
            if value.status != 'completed':
                raise serializers.ValidationError(
                    'A sessão precisa estar marcada como "Realizada" para registrar a evolução.'
                )
        return value


class PatientMinimalSerializer(serializers.ModelSerializer):
    """Serializer minimal do Paciente para uso em relacionamentos."""

    class Meta:
        model = Patient
        fields = ['id', 'name']


class TherapistMinimalSerializer(serializers.ModelSerializer):
    """Serializer minimal do Terapeuta para uso em relacionamentos."""

    class Meta:
        model = CustomUser
        fields = ['id', 'username']


class SessionDetailSerializer(serializers.ModelSerializer):
    """Serializer detalhado de Sessão com Patient e Therapist relacionados."""

    patient = PatientMinimalSerializer(read_only=True)
    therapist = TherapistMinimalSerializer(read_only=True)

    class Meta:
        model = Session
        fields = ['id', 'patient', 'therapist', 'date_time', 'status', 'notes']


class DashboardSerializer(serializers.Serializer):
    """Serializer para resposta agregada do Dashboard."""

    today_sessions = SessionDetailSerializer(many=True, read_only=True)
    active_patients = serializers.IntegerField(read_only=True)
    pending_evolutions = serializers.IntegerField(read_only=True)

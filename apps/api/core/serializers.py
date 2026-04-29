from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Patient, CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    """Serializer para o usuário customizado com role."""
    
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_active']
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
        
        # Tenta autenticar com email ou username
        user = CustomUser.objects.filter(email=email).first()
        
        if not user:
            raise serializers.ValidationError({
                'email': 'Usuário não encontrado.'
            })
        
        if not user.check_password(password):
            raise serializers.ValidationError({
                'password': 'Senha incorreta.'
            })
        
        if not user.is_active:
            raise serializers.ValidationError({
                'detail': 'Este usuário foi desativado.'
            })
        
        # Gerar tokens
        refresh = RefreshToken.for_user(user)
        
        return {
            'user': user,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }


class RefreshTokenSerializer(serializers.Serializer):
    """Serializer para refresh do token JWT."""
    
    refresh = serializers.CharField(write_only=True)
    access = serializers.CharField(read_only=True)
    
    def validate_refresh(self, value):
        """Validar se o refresh token é válido."""
        try:
            token = RefreshToken(value)
        except Exception as e:
            raise serializers.ValidationError(f'Token inválido: {str(e)}')
        return value
    
    def create(self, validated_data):
        """Gerar novo access token a partir do refresh token."""
        refresh = RefreshToken(validated_data['refresh'])
        return {
            'access': str(refresh.access_token)
        }


class PatientSerializer(serializers.ModelSerializer):
    """Serializer para Paciente com validações."""
    
    class Meta:
        model = Patient
        fields = ['id', 'name', 'birth_date', 'guardian_name', 'guardian_email', 'notes', 'created_at', 'updated_at']
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
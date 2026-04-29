from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    """
    Custom User model com suporte a roles (admin, therapist, family).
    
    Utilizamos AbstractUser para manter todas as funcionalidades padrão do Django
    enquanto adicionamos campos customizados.
    """
    
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('therapist', 'Terapeuta'),
        ('family', 'Família'),
    ]
    
    role = models.CharField(
        max_length=20, 
        choices=ROLE_CHOICES, 
        default='family',
        help_text='Função do usuário no sistema'
    )
    phone = models.CharField(max_length=20, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'
    
    def __str__(self):
        return f'{self.get_full_name() or self.username} ({self.get_role_display()})'
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_therapist(self):
        return self.role == 'therapist'
    
    def is_family(self):
        return self.role == 'family'


class Patient(models.Model):
    """Modelo de Paciente com histórico de atendimento."""
    
    name = models.CharField(max_length=255)
    birth_date = models.DateField(null=True, blank=True)
    guardian_name = models.CharField(max_length=255)
    guardian_email = models.EmailField(blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = 'Paciente'
        verbose_name_plural = 'Pacientes'

    def __str__(self):
        return self.name
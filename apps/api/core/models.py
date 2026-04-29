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


class Session(models.Model):
    """Modelo de Sessão Terapêutica (Agenda)."""
    
    STATUS_CHOICES = [
        ('scheduled', 'Agendada'),
        ('completed', 'Realizada'),
        ('canceled', 'Cancelada'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='sessions', verbose_name='Paciente')
    therapist = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='sessions', limit_choices_to={'role': 'therapist'}, verbose_name='Terapeuta')
    date_time = models.DateTimeField(verbose_name='Data e Hora')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled', verbose_name='Status')
    notes = models.TextField(blank=True, verbose_name='Anotações')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_time']
        verbose_name = 'Sessão'
        verbose_name_plural = 'Sessões'

    def __str__(self):
        return f'{self.patient.name} - {self.date_time.strftime("%d/%m/%Y %H:%M")}'


class TherapeuticEvolution(models.Model):
    """Evolução Terapêutica registrada após uma sessão."""
    
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='evolution', verbose_name='Sessão')
    objective = models.TextField(verbose_name='Objetivo')
    activities = models.TextField(verbose_name='Atividades Realizadas')
    behavior = models.TextField(verbose_name='Comportamento Observado')
    progress = models.TextField(verbose_name='Progresso')
    next_steps = models.TextField(verbose_name='Próximos Passos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Evolução Terapêutica'
        verbose_name_plural = 'Evoluções Terapêuticas'

    def __str__(self):
        return f'Evolução - Sessão {self.session.id}'

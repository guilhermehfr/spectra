from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models

from core.tenant_context import get_tenant_id


class TenantScopedManager(UserManager):
    """Auto-scopes CustomUser queries to the current tenant via ContextVar."""

    def get_queryset(self):
        qs = super().get_queryset()
        tenant_id = get_tenant_id()
        if tenant_id is not None:
            return qs.filter(tenant_id=tenant_id)
        return qs


class SoftDeleteManager(models.Manager):
    """Gerenciador customizado para ignorar registros deletados (Soft Delete)."""

    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class SoftDeleteModel(models.Model):
    """Modelo abstrato para herança de Soft Delete em vez de Hard Delete."""

    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = models.Manager()  # Acessível para admins caso precisem ver tudo

    class Meta:
        abstract = True

    def delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        """Em vez de deletar do banco, marca como deletado."""
        from django.utils import timezone

        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()
        return (1, {self._meta.label: 1})

    def hard_delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        """Deleta fisicamente do banco de dados referenciado no ORM."""
        return super().delete(*args, **kwargs)


class Tenant(models.Model):
    name = models.CharField(max_length=255)
    db_url = models.CharField(max_length=500)
    subdomain = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Tenant"
        verbose_name_plural = "Tenants"

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    """
    Custom User model com suporte a roles (admin, therapist, family).

    Utilizamos AbstractUser para manter todas as funcionalidades padrão do Django
    enquanto adicionamos campos customizados.

    `objects`   — TenantScopedManager: auto-filters by tenant_id from request context.
    `all_objects` — UserManager: unfiltered, for login and setup commands.
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
        help_text='Função do usuário no sistema',
    )
    phone = models.CharField(max_length=20, blank=True)
    tenant = models.ForeignKey(
        Tenant,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = TenantScopedManager()
    all_objects = UserManager()

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Usuário'
        verbose_name_plural = 'Usuários'

    def __str__(self):
        return f'{self.get_full_name() or self.username} ({self.get_role_display()})'

    def is_admin(self) -> bool:
        return self.role == 'admin'

    def is_therapist(self) -> bool:
        return self.role == 'therapist'

    def is_family(self) -> bool:
        return self.role == 'family'


class Patient(SoftDeleteModel):
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

    def __str__(self) -> str:
        return self.name

    def delete(self, *args, **kwargs) -> tuple[int, dict[str, int]]:
        """Soft delete patient AND all related sessions and evolutions."""
        from django.utils import timezone

        # 1. Soft delete all related sessions
        for session in self.sessions.all():
            session.is_deleted = True
            session.deleted_at = timezone.now()
            session.save()

            # 2. Soft delete evolution if exists
            if hasattr(session, 'evolution'):
                session.evolution.is_deleted = True
                session.evolution.deleted_at = timezone.now()
                session.evolution.save()

        # 3. Soft delete the patient
        self.is_deleted = True
        self.deleted_at = timezone.now()
        self.save()

        return (1, {self._meta.label: 1})


class Session(SoftDeleteModel):
    """Modelo de Sessão Terapêutica (Agenda)."""

    STATUS_CHOICES = [
        ('scheduled', 'Agendada'),
        ('completed', 'Realizada'),
        ('canceled', 'Cancelada'),
    ]

    patient = models.ForeignKey(
        Patient, on_delete=models.CASCADE, related_name='sessions', verbose_name='Paciente'
    )
    therapist = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name='sessions',
        limit_choices_to={'role': 'therapist'},
        verbose_name='Terapeuta',
        db_constraint=False,
    )
    date_time = models.DateTimeField(verbose_name='Data e Hora')
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default='scheduled', verbose_name='Status'
    )
    notes = models.TextField(blank=True, verbose_name='Anotações')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date_time']
        verbose_name = 'Sessão'
        verbose_name_plural = 'Sessões'

    def __str__(self) -> str:
        return f'{self.patient.name} - {self.date_time.strftime("%d/%m/%Y %H:%M")}'


class TherapeuticEvolution(SoftDeleteModel):
    """Evolução Terapêutica registrada após uma sessão."""

    session = models.OneToOneField(
        Session, on_delete=models.CASCADE, related_name='evolution', verbose_name='Sessão'
    )
    created_by = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='created_evolutions',
        verbose_name='Criado por',
        db_constraint=False,
    )
    objective = models.TextField(verbose_name='Objetivo')
    activities = models.TextField(verbose_name='Atividades Realizadas')
    behavior = models.TextField(verbose_name='Comportamento Observado')
    progress = models.TextField(verbose_name='Progresso')
    next_steps = models.TextField(verbose_name='Próximos Passos')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    released_to_family = models.BooleanField(default=False, verbose_name='Liberado para família')

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Evolução Terapêutica'
        verbose_name_plural = 'Evoluções Terapêuticas'

    def __str__(self):
        return f'Evolução - Sessão {self.session.id}'

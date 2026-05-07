from django.db import models

class Patient(models.Model):
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


class Session(SoftDeleteModel):
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

    def __str__(self) -> str:
        return f'{self.patient.name} - {self.date_time.strftime("%d/%m/%Y %H:%M")}'


class TherapeuticEvolution(SoftDeleteModel):
    """Evolução Terapêutica registrada após uma sessão."""
    
    session = models.OneToOneField(Session, on_delete=models.CASCADE, related_name='evolution', verbose_name='Sessão')
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
        return self.name
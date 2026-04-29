from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Patient, CustomUser, Session, TherapeuticEvolution


class CustomUserAdmin(BaseUserAdmin):
    """Admin customizado para o modelo CustomUser."""
    
    model = CustomUser
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informações Adicionais', {'fields': ('role', 'phone')}),
    )
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active']
    list_filter = BaseUserAdmin.list_filter + ('role', 'is_active')
    search_fields = BaseUserAdmin.search_fields + ('role',)


class PatientAdmin(admin.ModelAdmin):
    """Admin para Pacientes."""
    
    list_display = ['name', 'birth_date', 'guardian_name', 'guardian_email', 'created_at']
    search_fields = ['name', 'guardian_name', 'guardian_email']
    list_filter = ['created_at', 'birth_date']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']

class SessionAdmin(admin.ModelAdmin):
    list_display = ['patient', 'therapist', 'date_time', 'status']
    list_filter = ['status', 'date_time', 'therapist']
    search_fields = ['patient__name', 'therapist__username']

class TherapeuticEvolutionAdmin(admin.ModelAdmin):
    list_display = ['get_patient', 'get_therapist', 'get_session_date', 'created_at']
    
    def get_patient(self, obj):
        return obj.session.patient.name
    get_patient.short_description = 'Paciente'
    
    def get_therapist(self, obj):
        return obj.session.therapist.get_full_name() or obj.session.therapist.username
    get_therapist.short_description = 'Terapeuta'

    def get_session_date(self, obj):
        return obj.session.date_time
    get_session_date.short_description = 'Data da Sessão'

admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(TherapeuticEvolution, TherapeuticEvolutionAdmin)
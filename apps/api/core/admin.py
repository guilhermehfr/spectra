from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Patient, CustomUser


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


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Patient, PatientAdmin)
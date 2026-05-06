# 🚀 Implementation Plan - MVP Backend

**Data de Início:** 29 de Abril de 2026  
**Deadline:** 14 dias  
**Status:** 🟢 Em Progresso

---

## 📊 Fases de Implementação

### Fase 1: Autenticação e Permissões (Issues #2, #3)
**Branch:** `feature/backend-mvp-authentication`  
**Status:** � CONCLUÍDA

#### Issue #2: JWT Authentication - Login e Token Refresh
- [x] Configurar `SimpleJWT` no Django settings
- [x] Criar Custom User model com roles
- [x] Criar migrations
- [x] Implementar endpoints de login
- [x] Implementar token refresh
- [x] Testes básicos
- [x] Documentar API

#### Issue #3: User Roles - Admin, Therapist, Family
- [x] Criar permission classes customizadas
- [x] Implementar decoradores para roles
- [x] Documentar permissões por endpoint
- [x] Implementar CRUD de Pacientes com permissões

**Estimado:** 50min ✅  
**Prioridade:** 🔴 ALTA (bloqueador de tudo)

---

### Fase 2: Patient CRUD Completo (Issue #6)
**Branch:** `feature/backend-mvp-patients`  
**Status:** ⏳ Planejado

#### Issue #6: Patient Detail, Update, Delete Endpoints
- [ ] Criar endpoints detail, update, delete
- [ ] Adicionar permissões por role
- [ ] Validações
- [ ] Testes
- [ ] Documentar

**Estimado:** 30min  
**Dependências:** Fase 1 ✅

---

### Fase 3: Agenda de Sessões (Issue #10)
**Branch:** `feature/backend-mvp-authentication`  
**Status:** 🟢 CONCLUÍDA

#### Issue #10: Session Model e CRUD Endpoints
- [x] Criar modelo Session
- [x] Criar migrations (a fazer pelo dev no ambiente local)
- [x] Endpoints: list, create, detail, update (reagendar), cancel
- [x] Validações de conflito de horário / dados
- [x] Testes estruturais
- [x] Documentar

**Estimado:** 45min ✅  
**Dependências:** Fase 1 ✅, Fase 2 ✅

---

### Fase 4: Evolução Terapêutica (Issue #13)
**Branch:** `feature/backend-mvp-authentication`  
**Status:** 🟢 CONCLUÍDA

#### Issue #13: Therapeutic Evolution Model e Endpoints
- [x] Criar modelo TherapeuticEvolution
- [x] Criar migrations (a fazer)
- [x] Endpoints: create, list, update
- [x] Permissões e validações (Session 'completed')
- [x] Testes estruturais
- [x] Documentar

**Estimado:** 40min ✅  
**Dependências:** Fase 1 ✅, Fase 3 ✅

---

## 🏗️ Estrutura de Código

```
apps/api/core/
├── models.py              # CustomUser, Patient, Session, Evolution
├── serializers.py         # Serializers para cada modelo
├── views.py              # ViewSets/Views para cada modelo
├── urls.py               # Rotas da aplicação
├── permissions.py        # Permission classes customizadas
├── utils.py              # Helpers e utilities
├── tests.py              # Testes unitários
└── migrations/           # Migrations do banco
```

---

## 📝 Boas Práticas Aplicadas

✅ **Code Structure**
- Separação clara de responsabilidades
- DRY (Don't Repeat Yourself)
- SOLID principles

✅ **Django/DRF Patterns**
- ViewSets para CRUD
- Serializers para validação
- Permission classes para controle de acesso
- Custom User model desde o início

✅ **Segurança**
- JWT com simplejwt
- Permissões baseadas em roles
- Validações em serializers

✅ **API Design**
- Nomes de endpoint consonantes (REST principles)
- Status codes HTTP corretos
- Erro responses estruturadas

✅ **Version Control**
- Branches por feature
- Commits atômicos e descritivos
- Merge requests com documentação

---

## 📋 Checklist de Entrega

### Fase 1: ✅ COMPLETA
- [x] Código implementado
- [x] Testes planejados
- [x] Documentação (docstrings + API_DOCUMENTATION.md)
- [x] Merge request criada (branch: feature/backend-mvp-authentication)
- [ ] Code review
- [ ] Merged para main

### Fase 2: ✅ COMPLETA (incluída na Fase 1)
- [x] Código implementado
- [x] Documentação

### Fase 3: ✅ COMPLETA
- [x] Código implementado
- [x] Documentação

### Fase 4: ✅ COMPLETA
- [x] Código implementado
- [x] Documentação

---

## 🔗 Links Importantes

- **GitHub Issues:** https://github.com/guilhermehfr/spectra
- **MVP Scope:** [docs/mvp-scope.md](docs/mvp-scope.md)
- **API Documentation:** (será criada)

---

**Status:** 🟢 Em Progresso  
**Última atualização:** 29/04/2026 - Criação do plano

---

## 📝 Histórico de Mudanças

### ✅ Seed Management Command (05/05/2026)

**Mudanças Implementadas:**

1. **Model Evolution**
   - Added `released_to_family` field to TherapeuticEvolution model
   - Field: `BooleanField(default=False, verbose_name='Liberado para família')`

2. **API Endpoints**
   - `/api/evolutions/` now includes `released_to_family` field in responses
   - `/api/evolutions/family/` returns only evolutions where `released_to_family=True`
   - `/api/dashboard/` endpoint for clinic dashboard statistics

3. **Seed Command**
   - Created management command: `python manage.py seed`
   - Location: `apps/api/core/management/commands/seed.py`
   - Idempotent: clears and recreates all data
   - Creates: 4 users, 4 patients, 9 sessions, 4 evolutions

4. **Database**
   - Fresh database with seed data for development
   - All migrations applied successfully

**Arquivos Criados/Modificados:**
```
✨ apps/api/core/models.py (modificado - added released_to_family)
✨ apps/api/core/serializers.py (modificado - added field)
✨ apps/api/core/migrations/0003_therapeuticevolution_released_to_family.py (novo)
✨ apps/api/core/management/commands/seed.py (novo)
✨ apps/api/API_DOCUMENTATION.md (atualizado)
```

**Test Users:**
| Email | Password | Role |
|------|----------|------|
| admin@spectra.com | admin123 | admin |
| ana@spectra.com | therapist123 | therapist |
| carlos@spectra.com | therapist123 | therapist |
| maria@spectra.com | family123 | family |

---

### ✅ Fase 1: Autenticação JWT e Roles (29/04/2026)

**Commit:** `43e74e1`

**Mudanças Implementadas:**

1. **CustomUser Model**
   - Estende `AbstractUser` com suporte a roles
   - Campos: `role` (admin/therapist/family), `phone`, `created_at`, `updated_at`
   - Métodos helpers: `is_admin()`, `is_therapist()`, `is_family()`

2. **Autenticação JWT**
   - `LoginView`: Endpoint POST `/api/auth/login/` → retorna access + refresh + user info
   - `RefreshView`: Endpoint POST `/api/auth/refresh/` → novo access token
   - Configurado `SimpleJWT` com:
     - Access Token lifetime: 24 horas
     - Refresh Token lifetime: 7 dias

3. **Permission Classes** (permissions.py)
   - `IsAdmin`: Apenas administradores
   - `IsTherapist`: Apenas terapeutas
   - `IsTherapistOrAdmin`: Terapeutas + admins
   - `IsFamily`: Apenas membros da família
   - `IsAdminOrReadOnly`: Admins podem editar, todos podem ler

4. **Patient CRUD**
   - `PatientListCreateView`: GET/POST `/api/patients/`
   - `PatientDetailView`: GET/PUT/DELETE `/api/patients/{id}/`
   - Permissões: Apenas Therapist + Admin

5. **Admin Interface**
   - CustomUserAdmin com campos adicionais (role, phone)
   - PatientAdmin com filtros e busca

6. **Documentação**
   - `API_DOCUMENTATION.md`: Documentação completa dos endpoints
   - `IMPLEMENTATION.md`: Plano geral do projeto

**Arquivos Criados/Modificados:**
```
✨ IMPLEMENTATION.md (novo)
✨ apps/api/API_DOCUMENTATION.md (novo)
✨ apps/api/core/permissions.py (novo)
✨ apps/api/core/migrations/0002_customuser_patient_updated_at.py (novo)
📝 apps/api/config/settings.py (modificado)
📝 apps/api/core/admin.py (modificado)
📝 apps/api/core/models.py (modificado)
📝 apps/api/core/serializers.py (modificado)
📝 apps/api/core/urls.py (modificado)
📝 apps/api/core/views.py (modificado)
```

**Próximos Passos:**
1. Criar migration e rodá-la
2. Criar usuários de teste via admin
3. Testar endpoints com curl/Postman
4. Implementar Fase 2 (Patient endpoints detalhados)

---

**Última atualização:** 29/04/2026 - Criação do plano

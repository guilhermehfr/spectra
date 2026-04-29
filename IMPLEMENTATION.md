# 🚀 Implementation Plan - MVP Backend

**Data de Início:** 29 de Abril de 2026  
**Deadline:** 14 dias  
**Status:** 🟢 Em Progresso

---

## 📊 Fases de Implementação

### Fase 1: Autenticação e Permissões (Issues #2, #3)
**Branch:** `feature/backend-mvp-authentication`  
**Status:** 🟡 Em Andamento

#### Issue #2: JWT Authentication - Login e Token Refresh
- [ ] Configurar `SimpleJWT` no Django settings
- [ ] Criar Custom User model com roles
- [ ] Criar migrations
- [ ] Implementar endpoints de login
- [ ] Implementar token refresh
- [ ] Testes básicos
- [ ] Documentar API

#### Issue #3: User Roles - Admin, Therapist, Family
- [ ] Criar permission classes customizadas
- [ ] Implementar decorators para roles
- [ ] Documentar permissões por endpoint

**Estimado:** 50min  
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
**Branch:** `feature/backend-mvp-sessions`  
**Status:** ⏳ Planejado

#### Issue #10: Session Model e CRUD Endpoints
- [ ] Criar modelo Session
- [ ] Criar migrations
- [ ] Endpoints: list, create, detail, update (reagendar), cancel
- [ ] Validações de conflito de horário
- [ ] Testes
- [ ] Documentar

**Estimado:** 45min  
**Dependências:** Fase 1 ✅, Fase 2 ✅

---

### Fase 4: Evolução Terapêutica (Issue #13)
**Branch:** `feature/backend-mvp-evolution`  
**Status:** ⏳ Planejado

#### Issue #13: Therapeutic Evolution Model e Endpoints
- [ ] Criar modelo TherapeuticEvolution
- [ ] Criar migrations
- [ ] Endpoints: create, list, update
- [ ] Permissões e validações
- [ ] Testes
- [ ] Documentar

**Estimado:** 40min  
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

Por fase:
- [ ] Código implementado
- [ ] Testes passando (>80% coverage)
- [ ] Documentação (docstrings + README)
- [ ] Merge request criada
- [ ] Code review realizado
- [ ] Merged para main

---

## 🔗 Links Importantes

- **GitHub Issues:** https://github.com/guilhermehfr/spectra
- **MVP Scope:** [docs/mvp-scope.md](docs/mvp-scope.md)
- **API Documentation:** (será criada)

---

**Última atualização:** 29/04/2026 - Criação do plano

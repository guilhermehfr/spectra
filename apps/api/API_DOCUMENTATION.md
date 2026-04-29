# API Documentation - Spectra Backend

## 🔐 Autenticação

### Login
Fazer login com email e senha para obter tokens JWT.

**Endpoint:**
```
POST /api/auth/login/
```

**Request:**
```json
{
  "email": "usuario@example.com",
  "password": "sua_senha_aqui"
}
```

**Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@example.com",
    "first_name": "Primeiro",
    "last_name": "Sobrenome",
    "role": "therapist",
    "phone": "+5511987654321",
    "is_active": true
  }
}
```

**Erros:**
- `400`: Email não encontrado ou senha incorreta
- `400`: Usuário desativado

---

### Refresh Token
Renovar o token de acesso usando o refresh token.

**Endpoint:**
```
POST /api/auth/refresh/
```

**Request:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200):**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Headers necessários para requisições autenticadas:**
```
Authorization: Bearer {access_token}
```

---

## 👥 Pacientes

### Listar Pacientes
Listar todos os pacientes do sistema.

**Endpoint:**
```
GET /api/patients/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "João Silva",
    "birth_date": "2015-03-10",
    "guardian_name": "Maria Silva",
    "guardian_email": "maria@example.com",
    "notes": "Notas sobre o paciente",
    "created_at": "2026-04-29T10:30:00Z",
    "updated_at": "2026-04-29T10:30:00Z"
  }
]
```

**Permissões:** Apenas Terapeutas e Admins

---

### Criar Paciente
Criar um novo paciente no sistema.

**Endpoint:**
```
POST /api/patients/
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:30:00Z"
}
```

**Validações:**
- `name`: Obrigatório, não pode ser vazio
- `guardian_email`: Deve ser um email válido (opcional)

**Permissões:** Apenas Terapeutas e Admins

---

### Detalhes do Paciente
Obter informações detalhadas de um paciente.

**Endpoint:**
```
GET /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@example.com",
  "notes": "Paciente com diagnóstico de autismo",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:30:00Z"
}
```

**Permissões:** Apenas Terapeutas e Admins

---

### Atualizar Paciente
Atualizar informações de um paciente.

**Endpoint:**
```
PUT /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request:**
```json
{
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria.silva@example.com",
  "notes": "Notas atualizadas"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "João Silva",
  "birth_date": "2015-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria.silva@example.com",
  "notes": "Notas atualizadas",
  "created_at": "2026-04-29T10:30:00Z",
  "updated_at": "2026-04-29T10:31:00Z"
}
```

**Permissões:** Apenas Terapeutas e Admins

---

### Deletar Paciente
Remover um paciente do sistema.

**Endpoint:**
```
DELETE /api/patients/{id}/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

**Permissões:** Apenas Terapeutas e Admins

---

## 🔑 Roles e Permissões

### Roles Disponíveis

| Role | Descrição | Permissões |
|------|-----------|-----------|
| **admin** | Administrador | Acesso total a todos os endpoints |
| **therapist** | Terapeuta | CRUD de pacientes, sessões e evoluções |
| **family** | Membro da Família | Visualização apenas (leitura) |

### Acesso por Endpoint

| Endpoint | Admin | Therapist | Family |
|----------|-------|-----------|--------|
| POST `/auth/login/` | ✅ | ✅ | ✅ |
| GET `/patients/` | ✅ | ✅ | ❌ |
| POST `/patients/` | ✅ | ✅ | ❌ |
| GET `/patients/{id}/` | ✅ | ✅ | ❌ |
| PUT `/patients/{id}/` | ✅ | ✅ | ❌ |
| DELETE `/patients/{id}/` | ✅ | ✅ | ❌ |

---

## 🛠️ Desenvolvimento Local

### Setup do Ambiente

1. **Criar virtual environment:**
```bash
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
.venv\Scripts\activate     # Windows
```

2. **Instalar dependências:**
```bash
pip install -r requirements.txt
```

3. **Aplicar migrations:**
```bash
python manage.py migrate
```

4. **Criar superusuário (admin):**
```bash
python manage.py createsuperuser
```

5. **Rodar servidor:**
```bash
python manage.py runserver
```

---

## 📝 Próximas Implementações

- [ ] Issue #10: Session Model e CRUD Endpoints
- [ ] Issue #13: Therapeutic Evolution Model e Endpoints

---

**Status:** 🟢 Fase 1 Completa  
**Última atualização:** 29/04/2026

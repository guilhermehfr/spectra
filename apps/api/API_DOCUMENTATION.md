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
- `400`: Credenciais inválidas
- `400`: Conta desativada

---

### Usuário Atual
Obter dados do usuário autenticado.

**Endpoint:**
```
GET /api/auth/me/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "username": "usuario",
  "email": "usuario@example.com",
  "first_name": "Primeiro",
  "last_name": "Sobrenome",
  "role": "therapist",
  "phone": "+5511987654321",
  "is_active": true
}
```

**Permissões:** Qualquer usuário autenticado

---

### Logout
Realizar logout do sistema.

**Endpoint:**
```
POST /api/auth/logout/
```

**Headers:**
```
Authorization: Bearer {access_token}
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
  "detail": "Logout realizado com sucesso"
}
```

**Permissões:** Qualquer usuário autenticado

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

### Obter Paciente da Família
Obter o paciente associado ao email do responsável logado.

**Endpoint:**
```
GET /api/patients/family/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Leonardo Silva",
  "birth_date": "2017-03-10",
  "guardian_name": "Maria Silva",
  "guardian_email": "maria@spectra.com",
  "notes": "Paciente com TEA nível 2",
  "created_at": "2026-05-05T22:24:49Z",
  "updated_at": "2026-05-05T22:24:49Z"
}
```

**Response (404):**
```json
{
  "detail": "Nenhum paciente encontrado para este responsável."
}
```

**Permissões:** Apenas membros da Família (role: family)

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

## � Sessões (Agenda)

### Listar Sessões
Listar sessões (Terapeutas vêm as próprias; Admin vê todas).

**Endpoint:**
```
GET /api/sessions/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

### Criar Sessão
**Endpoint:**
```
POST /api/sessions/
```

**Request:**
```json
{
  "patient": 1,
  "date_time": "2026-05-10T14:00:00Z",
  "status": "scheduled",
  "notes": "Sessão de fonoaudiologia"
  // "therapist": 2 -> Campo opcional se quem manda for admin; Terapeutas logados marcam pra eles mesmos.
}
```

**Validações:**
- Não permite datas enviadas no passado.

### Gerenciar Sessão
`GET/PUT/DELETE /api/sessions/{id}/`
Atualizar para colocar como `"completed"` depois de realizar.

---

## 📈 Evolução Terapêutica

### Criar Evolução
Registra uma evolução apenas se a Sessão estiver completa (`"status": "completed"`). Outra regra: Só pode haver 1 evolução por sessão.

**Endpoint:**
```
POST /api/evolutions/
```

**Request:**
```json
{
  "session": 1,
  "objective": "Aumentar vocabulário.",
  "activities": "Brincadeiras conjuntas.",
  "behavior": "Tranquilo e focado.",
  "progress": "Muito bom.",
  "next_steps": "Continuar com fichas.",
  "released_to_family": false
}
```

**Campos:**
- `session` (required): ID da sessão completada
- `objective` (required): Objetivo da sessão
- `activities` (required): Atividades realizadas
- `behavior` (required): Comportamento observado
- `progress` (required): Progresso do paciente
- `next_steps` (required): Próximos passos
- `released_to_family` (optional, default: false): Se a evolução pode ser visualizada pela família

**Validações:**
- Sessão deve ter `status: "completed"`
- Cada sessão pode ter apenas 1 evolução

### Listar Evoluções (Clínica)
Listar todas as evoluções criadas pela clínica.

**Endpoint:**
```
GET /api/evolutions/
```

---

### Listar Evoluções Liberadas para Família
Obter lista de evoluções liberadas para visualização pela família.

**Endpoint:**
```
GET /api/evolutions/family/
```

**Response (200):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "session": 1,
      "session_details": {...},
      "session_date": "2026-05-01",
      "therapist_name": "Ana Costa",
      "objective": "Aumentar vocabulário.",
      "activities": "Brincadeiras conjuntas.",
      "behavior": "Tranquilo e focado.",
      "progress": "Muito bom.",
      "next_steps": "Continuar com fichas.",
      "released_to_family": true,
      "created_at": "2026-05-01T15:00:00Z",
      "updated_at": "2026-05-01T15:00:00Z"
    }
  ]
}
```

**Paginação:**
- A API usa paginação padrão do Django REST Framework
- `count`: Total de registros
- `results`: Array com os dados
- `next`/`previous`: Links para próxima/página anterior

**Filtros:**
- Apenas retorna evoluções onde `released_to_family: true`
- Ordenado por `created_at` (mais recente primeiro)

**Permissões:** Apenas membros da Família

---

### Detalhes e Edição
`GET/PUT/DELETE /api/evolutions/{id}/`

**PUT Request (atualizar evolução):**
```json
{
  "objective": "Novo objetivo...",
  "released_to_family": true
}
```

---

## 📊 Dashboard

### Estatísticas do Dashboard
Obter dados agregados para o dashboard da clínica.

**Endpoint:**
```
GET /api/dashboard/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "today_sessions": [
    {
      "id": 1,
      "patient": 1,
      "patient_name": "Leonardo Silva",
      "therapist": 1,
      "therapist_name": "Ana Costa",
      "date_time": "2026-05-05T14:00:00Z",
      "status": "scheduled",
      "notes": "Sessão semanal"
    }
  ],
  "active_patients": 4,
  "pending_evolutions": 2
}
```

**Campos:**
- `today_sessions`: Sessões de hoje (status: scheduled ou completed)
- `active_patients`: Total de pacientes ativos (não deletados)
- `pending_evolutions`: Sessões completadas sem evolução

**Permissões:** Apenas Terapeutas e Admins

---

## 🔐 Roles e Permissões

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
| POST `/auth/refresh/` | ✅ | ✅ | ✅ |
| GET `/auth/me/` | ✅ | ✅ | ✅ |
| POST `/auth/logout/` | ✅ | ✅ | ✅ |
| GET `/dashboard/` | ✅ | ✅ (Dados dele) | ❌ |
| GET `/patients/` | ✅ | ✅ | ❌ |
| GET `/patients/family/` | ❌ | ❌ | ✅ |
| POST `/patients/` | ✅ | ✅ | ❌ |
| GET `/patients/{id}/` | ✅ | ✅ | ❌ |
| PUT `/patients/{id}/` | ✅ | ✅ | ❌ |
| DELETE `/patients/{id}/` | ✅ | ✅ | ❌ |
| ALL `/sessions/` | ✅ | ✅ (Apenas as dele) | ❌ |
| ALL `/evolutions/` | ✅ | ✅ (Apenas as dele) | ✅ (Apenas liberadas) |
| GET `/evolutions/family/` | ✅ | ✅ | ✅ |

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

## 📊 Dashboard

### Get Dashboard Metrics
Retorna métricas agregadas do painel para o usuário autenticado.

**Endpoint:**
```
GET /api/dashboard/
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response (200):**
```json
{
  "today_sessions": [
    {
      "id": 1,
      "patient": {
        "id": 1,
        "name": "João Silva"
      },
      "therapist": {
        "id": 2,
        "username": "therapist1"
      },
      "date_time": "2026-05-04T14:00:00Z",
      "status": "completed",
      "notes": "Sessão realizada com sucesso"
    },
    {
      "id": 2,
      "patient": {
        "id": 3,
        "name": "Maria Santos"
      },
      "therapist": {
        "id": 2,
        "username": "therapist1"
      },
      "date_time": "2026-05-04T15:30:00Z",
      "status": "scheduled",
      "notes": ""
    }
  ],
  "active_patients": 12,
  "pending_evolutions": 3
}
```

**Campo Descrição:**
- `today_sessions`: Lista de sessões agendadas para hoje, ordenadas por hora
- `active_patients`: Total de pacientes não deletados no sistema
- `pending_evolutions`: Total de sessões completadas sem evolução registrada

**Permissões:** 
- **Terapeutas**: Veem apenas suas sessões de hoje e suas evoluções pendentes
- **Admins**: Veem todas as sessões de hoje e todas as evoluções pendentes do sistema

**Validações:**
- Apenas usuários autenticados com role `therapist` ou `admin` têm acesso
- Retorna `403 Forbidden` se o usuário não tiver permissão

---

**Status:** 🟢 Fases 1, 2, 3 e 4 Completas (Backend MVP Entregue)  
**Última atualização:** 06/05/2026

---

## 🏥 Health Check

Endpoint para monitoramento e health checks (load balancers, Render, etc).

**Endpoint:**
```
GET /api/health/
```

**Response (200):**
```json
{
  "status": "ok"
}
```

**Permissões:** Público (sem autenticação)

---

## 🚀 Deploy (Render)

### Variáveis de Ambiente Obrigatórias

| Variável | Descrição |
|----------|-----------|
| `SECRET_KEY` | Chave secreta Django (obrigatório, sem fallback) |
| `ALLOWED_HOSTS` | Domínios permitidos (obrigatório em produção) |
| `CORS_ALLOWED_ORIGINS` | Origens CORS permitidas |
| `DATABASE_URL` | URL de conexão PostgreSQL |
| `DJANGO_ENV` | Ambiente (`local` ou `production`) |
| `DEBUG` | Modo debug (`True` apenas em local) |

### Build
```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

### Start
```bash
gunicorn config.wsgi:application --bind 0.0.0.0:$PORT
```
 
<div align="center">


# 🧩 Spectra - Plataforma de Gestão para Clínicas TEA

[![Vercel Status](https://therealsujitk-vercel-badge.vercel.app/?app=spectratea)](https://spectratea.vercel.app)
[![Render](https://img.shields.io/badge/render-live-brightgreen?style=flat&logo=render&logoColor=white)](https://ai-powered-webhook-handler-generator.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)


Uma plataforma fullstack de operações clínicas desenvolvida para clínicas de terapia especializadas em Transtorno do Espectro Autista (TEA).

O Spectra centraliza o gerenciamento de pacientes, agendamento de terapias, acompanhamento do progresso clínico e fluxos de comunicação com responsáveis em um único sistema.

**Backend:** Django 5 · Django REST Framework · PostgreSQL  
**Frontend:** Next.js 16 · React 19 · TypeScript

🌐 _[Read in English](README.md)_

<img width="700" height="400" alt="hero" src="https://github.com/user-attachments/assets/a3a3789b-4e39-427a-8347-6b6524350b97" />

[Aplicação](https://spectratea.vercel.app) · [Landing Page](https://spectra-tea.vercel.app)

---

</div>

## ✨ Visão Geral

O Spectra foi construído em torno de fluxos de trabalho reais de terapia multidisciplinar.

A plataforma fornece ferramentas operacionais para clínicas e, ao mesmo tempo, entrega uma experiência dedicada para que responsáveis acompanhem o progresso dos pacientes.

Em vez de focar apenas em operações administrativas de CRUD, o Spectra modela o fluxo real entre terapeutas, sessões, evoluções clínicas e comunicação com famílias.

Fluxos principais incluem:

- Gerenciamento de pacientes e responsáveis
- Agendamento de sessões terapêuticas
- Registro de notas de progresso clínico
- Controle de visibilidade pelo terapeuta
- Portal de acompanhamento para responsáveis
- Acesso operacional baseado em perfil

## 🩺 Fluxo de Trabalho

```txt
Terapeuta agenda sessão
            ↓
Sessão é realizada
            ↓
Evolução clínica é registrada
            ↓
Responsável recebe acesso pelo Portal da Família
```

## ✨ Funcionalidades

### Backoffice da Clínica

- Cadastro de pacientes com informações do responsável
- Agendamento semanal de terapias
- Gerenciamento e reagendamento de sessões
- Registro de evoluções clínicas
- Estatísticas do dashboard em tempo real
- Controle de visibilidade para família pelo terapeuta

### Portal da Família

- Experiência mobile-first para responsáveis
- Histórico de evoluções liberadas
- Acompanhamento do progresso das sessões
- Interface simplificada e acessível

### Infraestrutura da Plataforma

- Autenticação JWT com cookies httpOnly
- Controle de acesso baseado em perfil
- Abstração de API com troca por ambiente
- Infraestrutura de mock centralizada com MSW
- Implementações de API com lazy-load
- Arquitetura monorepo com pnpm workspaces

---

## 🏗 Destaques de Arquitetura

- Arquitetura multi-portal (`clinic` e `family`)
- Arquitetura server-first com Next.js App Router
- Troca de API por ambiente (`mock` ↔ `real`)
- Estado mock centralizado em memória com MSW
- Middleware de autenticação com reconhecimento de perfil
- Implementações de API com lazy-load
- Estrutura de componentes orientada a domínio
- Fluxo de autenticação JWT com cookies seguros

A infraestrutura de mock permite que o desenvolvimento frontend avance de forma independente da disponibilidade do backend, mantendo o comportamento consistente da aplicação.

---

## 🛠 Tech Stack

### Backend

| Tecnologia | Finalidade |
| --- | --- |
| [Django](https://www.djangoproject.com/) | Framework backend |
| [Django REST Framework](https://www.django-rest-framework.org/) | API REST |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Neon](https://neon.tech/) | PostgreSQL serverless |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | Autenticação JWT |
| [Gunicorn](https://gunicorn.org/) | Servidor de produção |

### Frontend

| Tecnologia | Finalidade |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | Framework React |
| [React 19](https://react.dev/) | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilização |
| [TanStack Query](https://tanstack.com/query) | Gerenciamento de estado assíncrono |
| [MSW](https://mswjs.io/) | Infraestrutura de mock de API |
| [Zod](https://zod.dev/) | Validação e tipagem |

### Infraestrutura

| Tecnologia | Finalidade |
| --- | --- |
| [Vercel](https://vercel.com/) | Deploy do frontend |
| [Render](https://render.com/) | Deploy do backend |
| [pnpm](https://pnpm.io/) | Gerenciamento de pacotes monorepo |

---

## 📁 Estrutura do Projeto

```txt
spectra/
├── apps/
│   ├── api/                  # Backend Django
│   │   ├── core/
│   │   ├── config/
│   │   └── manage.py
│   │
│   └── web/                  # Frontend Next.js
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── lib/
│       │   └── mocks/
│       └── package.json
│
├── pnpm-workspace.yaml
└── README.md
```

## 🎬 Demo

> **Demo ao vivo em breve.**  
> Estamos configurando um ambiente de demonstração dedicado com dados clínicos pré-populados.

Enquanto isso, você pode rodar o projeto localmente usando a infraestrutura de mock — sem necessidade de backend:

```bash
cd apps/web
pnpm install
cp .env.local.example .env.local  # NEXT_PUBLIC_DISABLE_MSW=false
pnpm dev
```

Contas de teste estão disponíveis por padrão. Veja [Contas de Teste](#-contas-de-teste) para as credenciais.

---

## 🚀 Primeiros Passos

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.11+
- [pnpm](https://pnpm.io/)

---

## ⚙️ Configuração do Backend

```bash
cd apps/api

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.example .env

python manage.py migrate
python manage.py seed

python manage.py runserver
```

API disponível em:

```txt
http://127.0.0.1:8000
```

---

## 💻 Configuração do Frontend

```bash
cd apps/web

pnpm install

cp .env.local.example .env.local

pnpm dev
```

Aplicação disponível em:

```txt
http://localhost:3000
```

---

## ⚙️ Variáveis de Ambiente

### Backend (`apps/api/.env`)

| Variável | Descrição |
| --- | --- |
| `SECRET_KEY` | Chave secreta do Django |
| `DEBUG` | Modo debug |
| `DATABASE_URL` | String de conexão PostgreSQL |
| `ALLOWED_HOSTS` | Hosts permitidos |
| `CORS_ALLOWED_ORIGINS` | Origens do frontend |

### Frontend (`apps/web/.env.local`)

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL da API backend | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_DISABLE_MSW` | Alternar infraestrutura de mock | `false` |
| `NEXT_PUBLIC_MOCK_USER_ID` | Usuário mock padrão | `1` |

---

## 👥 Contas de Teste

### Modo Mock (`NEXT_PUBLIC_DISABLE_MSW=false`)

| Perfil | Email | Senha |
| --- | --- | --- |
| Admin | admin@spectra.com | qualquer |
| Terapeuta | ana@spectra.com | qualquer |
| Terapeuta | carlos@spectra.com | qualquer |
| Família | maria@gmail.com | qualquer |

### API Real (`NEXT_PUBLIC_DISABLE_MSW=true`)

| Perfil | Email | Senha |
| --- | --- | --- |
| Admin | admin@spectra.com | admin123 |
| Terapeuta | ana@spectra.com | therapist123 |
| Terapeuta | carlos@spectra.com | therapist123 |
| Família | maria@spectra.com | family123 |

> Execute `python manage.py seed` para popular as contas na API real.

---

## 🔐 Modelo de Acesso

| Perfil | Permissões |
| --- | --- |
| `admin` | Acesso total à clínica |
| `therapist` | Sessões, pacientes e evoluções |
| `family` | Leitura das evoluções liberadas |

---

## 📡 Domínios da API

Principais domínios da API:

- Autenticação
- Pacientes
- Sessões
- Evoluções Clínicas
- Análises do Dashboard
- Acesso ao Portal da Família

---

## 🚧 Status do Projeto

O Spectra está atualmente em estágio de MVP.

Áreas de foco atuais incluem:

- Refinamento do fluxo clínico
- Melhorias de acessibilidade
- Suporte a múltiplas clínicas
- Infraestrutura de notificações
- Hardening para produção

---

## 👋 Time

| Membros | LinkedIn | GitHub |
|-|----------|--------|
| Guilherme Henrique | [guilhermehe](https://linkedin.com/in/guilhermehe) | [guilhermehfr](https://github.com/guilhermehfr) |
| Eduardo Oliveira | [eduardo-oliveira7](https://linkedin.com/in/eduardo-oliveira7) | [Edu-oliveira7](https://github.com/Edu-oliveira7) |
| Yuri Domingues | [domingues-yuri](https://linkedin.com/in/domingues-yuri) | [yuridomingues](https://github.com/yuridomingues) |
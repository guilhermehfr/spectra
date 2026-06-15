<div align="center">

# 🧩 Spectra - Plataforma de Gestão para Clínicas de TEA

[![Vercel Status](https://therealsujitk-vercel-badge.vercel.app/?app=spectratea)](https://spectratea.vercel.app)
[![Render](https://img.shields.io/badge/render-live-brightgreen?style=flat&logo=render&logoColor=white)](https://ai-powered-webhook-handler-generator.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Uma plataforma full-stack de operações clínicas projetada para clínicas de terapia de Transtorno do Espectro Autista (TEA).

O Spectra centraliza o gerenciamento de pacientes, o agendamento de terapias, o acompanhamento da evolução clínica e os fluxos de comunicação com os responsáveis em um único sistema.

**Backend:** Django 5 · Django REST Framework · PostgreSQL  
**Frontend:** Next.js 16 · React 19 · TypeScript

🌐 _[Read in English](README.md)_

<img width="700" height="400" alt="hero" src="https://github.com/user-attachments/assets/a3a3789b-4e39-427a-8347-6b6524350b97" />

[Live App](https://spectratea.vercel.app) · [Landing Page](https://spectra-tea.vercel.app)

---

</div>

## 🚀 Acesso à Demonstração (Recomendado)

Para explorar a plataforma instantaneamente sem necessidade de configuração:

Live App: https://spectratea.vercel.app

E utilize as credenciais abaixo para acessar:

### Clínica 1

| Perfil        | E-mail             | Senha |
| ------------- | ------------------ | ----- |
| Administrador | admin@alpha.com    | alpha |
| Terapeuta     | ana@alpha.com      | alpha |
| Terapeuta     | carlos@alpha.com   | alpha |
| Família       | maria@alpha.com    | alpha |

### Clínica 2

| Perfil        | E-mail               | Senha |
| ------------- | -------------------- | ----- |
| Administrador | admin@beta.com       | beta  |
| Terapeuta     | beatriz@beta.com     | beta  |
| Terapeuta     | marcos@beta.com      | beta  |
| Família       | lucia@beta.com       | beta  |

---

## ✨ Visão Geral

O Spectra foi construído com base em fluxos reais de trabalho de terapias multidisciplinares.

A plataforma fornece ferramentas operacionais para clínicas e, ao mesmo tempo, oferece uma experiência dedicada voltada para que os responsáveis acompanhem o progresso do paciente.

Em vez de focar apenas em operações administrativas básicas de CRUD, o Spectra modela o fluxo de trabalho real entre terapeutas, sessões, evoluções clínicas e a comunicação familiar.

Os fluxos de trabalho principais incluem:

- Gerenciamento de pacientes e responsáveis
- Agendamento de sessões de terapia
- Registro de notas de evolução clínica
- Permissões de visibilidade controladas pelo terapeuta
- Portal de acompanhamento voltado para os responsáveis
- Acesso operacional baseado em perfis (roles)

## 🩺 Fluxo de Trabalho

```txt
Terapeuta agenda a sessão
            ↓
A sessão é concluída
            ↓
A evolução clínica é registrada
            ↓
O responsável recebe acesso através do Portal da Família
```

## ✨ Funcionalidades

### Backoffice da Clínica

- Prontuários de pacientes com informações dos responsáveis
- Agendamento semanal de terapias
- Gerenciamento e reagendamento de sessões
- Registro de evolução clínica
- Estatísticas do painel (dashboard) em tempo real
- Controle de visibilidade da família gerenciado pelo terapeuta

### Portal da Família

- Experiência do responsável focada prioritariamente em dispositivos móveis (mobile-first)
- Histórico de evoluções liberadas
- Acompanhamento do progresso das sessões
- Interface simplificada e acessível

### Infraestrutura da Plataforma

- Autenticação JWT com cookies httpOnly
- Controle de acesso baseado em perfis (RBAC)
- Abstração de API ciente do ambiente (environment-aware)
- Infraestrutura de simulação (mock) centralizada baseada em MSW
- Implementações de API com carregamento tardio (lazy-loaded)
- Arquitetura monorepo com workspaces pnpm

---

## 🏗 Destaques da Arquitetura

- Arquitetura de múltiplos portais (`clinic` e `family`)
- Arquitetura Next.js App Router focada prioritariamente no servidor (server-first)
- Alternância de API baseada no ambiente (`mock` ↔ `real`)
- Estado de simulação (mock) em memória centralizado com MSW
- Internacionalização (PT-BR / EN) com next-intl
- Autenticação em middleware ciente do perfil do usuário
- Implementações de API com carregamento tardio (lazy-loaded)
- Estrutura de componentes compartilhados orientada ao domínio (domain-driven)
- Fluxo de autenticação JWT com cookies seguros

A infraestrutura de mock permite que o desenvolvimento do frontend avance de forma independente da disponibilidade do backend, mantendo um comportamento consistente do aplicativo.

---

## 🛠 Tecnologias Utilizadas

### Backend

| Tecnologia | Finalidade |
| --- | --- |
| [Django](https://www.djangoproject.com/) | Framework de backend |
| [Django REST Framework](https://www.django-rest-framework.org/) | API REST |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional |
| [Neon](https://neon.tech/) | PostgreSQL Serverless |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | Autenticação JWT |
| [Gunicorn](https://gunicorn.org/) | Servidor de produção |
| [Ruff](https://docs.astral.sh/ruff/) | Linter e formatador Python |

### Frontend

| Tecnologia | Finalidade |
| --- | --- |
| [Next.js 16](https://nextjs.org/) | Framework React |
| [React 19](https://react.dev/) | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS v4](https://tailwindcss.com/) | Estilização |
| [MSW](https://mswjs.io/) | Infraestrutura de API simulada (mock) |
| [next-intl](https://next-intl.dev/) | Internacionalização (PT-BR / EN) |

### Infraestrutura

| Tecnologia | Finalidade |
| --- | --- |
| [Vercel](https://vercel.com/) | Implantação (deployment) do frontend |
| [Render](https://render.com/) | Implantação (deployment) do backend |
| [pnpm](https://pnpm.io/) | Gerenciamento de pacotes em Monorepo |

---

## 📁 Estrutura do Projeto

```txt
spectra/
├── apps/
│   ├── api/                  # Backend Django
│   │   ├── core/
│   │   ├── config/
│   │   └── manage.py
│   └── web/                  # Frontend Next.js
│       ├── messages/          # Arquivos de tradução (en.json, pt-BR.json)
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── i18n/
│       │   ├── lib/
│       │   └── mocks/
│       └── package.json
│
├── pnpm-workspace.yaml
├── .github/workflows/       # Fluxos de CI
└── README.md
```

As contas de teste (mock) já vêm prontas para uso. Consulte [Contas de Teste (Mock)](#-contas-de-teste-mock) para obter as credenciais.

---

## 🚀 Primeiros Passos

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Python](https://www.python.org/) 3.10+
- [pnpm](https://pnpm.io/)

---

## ⚙️ Configuração do Backend

```bash
cd apps/api

python -m venv .venv
source .venv/bin/activate

pip install -r requirements.txt

cp .env.local.example .env.local
# Certifique-se de que ALPHA_DB_URL e BETA_DB_URL estão configurados com valores válidos (padrão: sqlite:///alpha.sqlite3 e sqlite:///beta.sqlite3)

python manage.py migrate
python manage.py seed                  # semear ambas clínicas
python manage.py seed --clinic alpha   # semear apenas Alpha
python manage.py seed --clinic beta    # semear apenas Beta

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

Aplicativo disponível em:

```txt
http://localhost:3000
```

---

## ⚙️ Variáveis de Ambiente

### Backend (`apps/api/.env`)

| Variável | Descrição |
| --- | --- |
| `SECRET_KEY` | Chave secreta do Django |
| `DEBUG` | Modo de depuração (debug) |
| `CENTRAL_DATABASE_URL` | String central de conexão PostgreSQL (usuários, tenants) |
| `TENANT_DATABASE_URL` | Fallback do banco tenant (placeholder) |
| `ALPHA_DB_URL` | Banco de seed da clínica Alpha (SQLite para dev) |
| `BETA_DB_URL` | Banco de seed da clínica Beta (SQLite para dev) |
| `ALLOWED_HOSTS` | Hosts permitidos |
| `CORS_ALLOWED_ORIGINS` | Origens permitidas do frontend |
| `DJANGO_ENV` | Ambiente (`local` ou `production`) |
| `SEED_SECRET` | Segredo para o endpoint `/api/seed/` |

### Frontend (`apps/web/.env.local`)

| Variável | Descrição | Padrão |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | URL da API do backend | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_DISABLE_MSW` | Ativar/desativar infraestrutura de mock | `false` |
| `NEXT_PUBLIC_MOCK_USER_ID` | Usuário mock padrão (admin) | `1` |

---

## 👥 Contas de Teste (Mock)

### Modo Simulado / Mock (`NEXT_PUBLIC_DISABLE_MSW=false`)

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | admin@alpha.com | qualquer uma |
| Terapeuta | ana@alpha.com | qualquer uma |
| Terapeuta | carlos@alpha.com | qualquer uma |
| Família | maria@alpha.com | qualquer uma |

---

## 🔐 Modelo de Acesso

| Perfil | Permissões |
| --- | --- |
| `admin` | Acesso total à clínica |
| `therapist` | Pacientes, sessões, evoluções |
| `family` | Acesso de apenas leitura às evoluções liberadas |

---

## 📡 Domínios da API

Documentação completa da API: [`apps/api/API_DOCUMENTATION.md`](apps/api/API_DOCUMENTATION.md)

Principais domínios da API:

- Autenticação
- Pacientes
- Sessões
- Evoluções Clínicas
- Análise de Painel (Dashboard)
- Acesso ao Portal da Família
- Seed (População de Dados de Demonstração)

---

## 👋 Equipe

| Membros | LinkedIn | GitHub |
|-|----------|--------|
| Guilherme Henrique | [guilhermehe](https://linkedin.com/in/guilhermehe) | [guilhermehfr](https://github.com/guilhermehfr) |
| Eduardo Oliveira | [eduardo-oliveira7](https://linkedin.com/in/eduardo-oliveira7) | [Edu-oliveira7](https://github.com/Edu-oliveira7) |
| Yuri Domingues | [domingues-yuri](https://linkedin.com/in/domingues-yuri) | [yuridomingues](https://github.com/yuridomingues) |

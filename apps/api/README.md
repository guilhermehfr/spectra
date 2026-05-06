# API - Patient Management

Backend da aplicação de gerenciamento de pacientes.
Construído com Django e Django REST Framework.

## Objetivo

Fornecer uma API para gerenciamento de pacientes, permitindo criação, leitura e manutenção de registros básicos.

Este backend faz parte de um sistema fullstack com frontend em Next.js.

## Stack

- Python 3.x
- Django 5.x
- Django REST Framework
- SQLite (ambiente local) / PostgreSQL (produção)

## Como rodar o projeto

1. Criar ambiente virtual
```bash
python -m venv .venv
```
2. Ativar ambiente virtual
```bash
source .venv/bin/activate
```
3. Instalar dependências
```bash
pip install -r requirements.txt
```
4. Aplicar migrations
```bash
python manage.py migrate
```
5. Rodar servidor
```bash
python manage.py runserver
```

## API disponível em:

[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

## Superusuário (admin)

Criar usuário admin:

```bash
python manage.py createsuperuser
```

Acessar painel:

[http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin)

## Endpoints principais

### Pacientes

- `GET /patients/` → Lista todos os pacientes
- `POST /patients/` → Cria um paciente
- `GET /patients/{id}/` → Detalha um paciente
- `PUT /patients/{id}/` → Atualiza um paciente
- `DELETE /patients/{id}/` → Remove um paciente

## Estrutura do modelo (Patient)

- `id`
- `name`
- `birth_date`
- `guardian_name`
- `guardian_email`
- `notes`
- `created_at`

## Configuração do Banco de Dados

### Variáveis de Ambiente

O projeto utiliza `django-environ` e `dj-database-url` para configuração do banco de dados.

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | String de conexão completa (formato: `postgresql://user:password@host:port/dbname`) | `postgresql://user:pass@localhost:5432/mydb` |
| `DJANGO_ENV` | Ambiente de execução (`local` ou `production`) | `local` |

### Desenvolvimento Local (SQLite)

Por padrão, sem `DATABASE_URL`, o projeto usa SQLite:

```bash
# Não definir DATABASE_URL = usa SQLite automaticamente
```

### Produção (PostgreSQL)

Defina a variável `DATABASE_URL` no arquivo `.env.production`:

```bash
DATABASE_URL=postgresql://usuario:senha@host:5432/nome_do_banco
```

Ou copie o arquivo de exemplo:
```bash
cp .env.production.example .env.production
# Edite o arquivo com as credenciais do seu banco PostgreSQL
```

## Observações

- Projeto em fase de MVP
- Banco SQLite usado apenas para desenvolvimento local
- Produção utiliza PostgreSQL com DATABASE_URL

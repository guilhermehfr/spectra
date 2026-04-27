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
- SQLite (ambiente local)

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

## Observações

- Projeto em fase de MVP
- Banco SQLite usado apenas para desenvolvimento local
- Estrutura preparada para migração futura para PostgreSQL

# MSW — Mock Service Worker

Mocka todos os endpoints da API durante o desenvolvimento do frontend.

## Estrutura

```
mocks/
  handlers.ts          — todos os endpoints mockados
  browser.ts           — setup do service worker
  data/
    users.ts           — usuários de teste (admin, therapist, family)
    patients.ts        — pacientes de teste
    sessions.ts        — sessões de teste
    evolutions.ts      — evoluções de teste

instrumentation-client.ts  — inicializa o MSW no Next.js
```

## Como usar

1. Instala as dependências acima
2. Copia a pasta `mocks/` para dentro de `apps/web/`
3. Copia `instrumentation-client.ts` para a raiz de `apps/web/`
4. Roda o projeto normalmente — o MSW ativa automaticamente em `NODE_ENV=development`

## Usuários disponíveis para teste

| Email              | Role      |
| ------------------ | --------- |
| admin@alpha.com   | admin     |
| ana@alpha.com     | therapist |
| carlos@alpha.com  | therapist |
| maria@alpha.com   | family    |

Qualquer senha funciona no mock de login.

## Desativando por endpoint

Quando o backend de um endpoint estiver pronto, basta remover o handler correspondente de `handlers.ts`. O request vai passar direto para a API real.

## Endpoints mockados

- POST /api/auth/login/
- POST /api/auth/refresh/
- GET/POST /api/patients/
- GET/PUT/DELETE /api/patients/:id/
- GET/POST /api/sessions/
- GET/PUT/DELETE /api/sessions/:id/
- POST /api/evolutions/
- GET/PUT /api/evolutions/:id/
- GET /api/evolutions/family/
- GET /api/dashboard/

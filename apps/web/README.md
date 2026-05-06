# Aplicação Web Spectra

Parte do monorepo Spectra, esta é uma aplicação Next.js 16 construída com React 19, Tailwind CSS 4 e TypeScript. Fornece uma interface web para gerenciamento de dados de pacientes, integrando-se com a API do backend do Spectra.

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Linguagem**: TypeScript
- **Linting/Formatting**: ESLint com configuração Next.js + Prettier
- **Autenticação**: Cookie-based com middleware Next.js
- **Mock**: MSW com estado centralizado em memória

## Autenticação

O sistema de autenticação usa cookies para manter a sessão do usuário:

- **AuthService**: Use `authService` de `@/lib/authService` para todas operações de auth
  - `authService.login({ email, password })` - Login do usuário
  - `authService.me()` - Obter informações do usuário atual
  - `authService.logout()` - Encerrar sessão
- **AuthResolver**: Use `authResolver` de `@/lib/authResolver` para resolver identidade do usuário
  - `authResolver.getUser(cookieValue)` - Resolve usuário a partir do cookie
- **Troca por ambiente**: Defina `NEXT_PUBLIC_DISABLE_MSW=false` para usar mock (padrão em dev), `true` para API real
- **Cookie**: `access_token` armazena o ID do usuário após login
- **Logout**: Use `logoutAction` de `src/app/actions/auth.ts` para encerrar a sessão
- **Middleware**: `src/app/middleware.ts` verifica autenticação em todas as rotas
- **Rotas públicas**: `/`, `/login/*` (acesso livre)
- **Rotas protegidas**: `/clinic/*` e `/family/*` requerem autenticação
- **Redirect**: Usuários não autenticados são redirecionados para `/login/clinic` ou `/login/family`

## Arquitetura de API

### Estado Centralizado de Mock

O projeto utiliza um sistema de estado mock centralizado em `src/mocks/state.ts`:

- Todos os dados mock (usuários, pacientes, sessões, evoluções) são armazenados em memória
- Não há chamadas fetch no modo mock - todos os dados vêm do estado centralizado
- Arquitetura lazy-load: implementações mock/real são carregadas dinamicamente conforme `NEXT_PUBLIC_DISABLE_MSW`

### Estrutura de API

```
src/lib/api/
├── clinic.ts           # Dispatcher (lazy-load)
├── clinic-mock.ts      # Implementação mock
├── clinic-real.ts      # Implementação HTTP real
├── family.ts           # Dispatcher (lazy-load)
├── family-mock.ts     # Implementação mock
└── family-real.ts     # Implementação HTTP real
```

## Pré-requisitos

- Node.js (v18+ recomendado)
- pnpm (gerenciador de pacotes)
- Backend do Spectra rodando localmente em `http://127.0.0.1:8000` (ou configure variável)

### Variáveis de Ambiente

| Variável                   | Descrição                                      | Padrão                  |
| -------------------------- | ---------------------------------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`      | URL da API do backend                          | `http://127.0.0.1:8000` |
| `NEXT_PUBLIC_DISABLE_MSW`  | `false` = mock enabled, `true` = API real      | `false`                 |
| `NEXT_PUBLIC_MOCK_USER_ID` | ID do usuário mock padrão (em desenvolvimento) | `1`                     |

## Começando

Primeiro, certifique-se de que o backend do Spectra está rodando. Em seguida, inicie o servidor de desenvolvimento:

```bash
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Scripts Disponíveis

- `pnpm dev`: Inicia o servidor de desenvolvimento (com Turbopack)
- `pnpm build`: Cria a build de produção
- `pnpm start`: Inicia o servidor de produção
- `pnpm lint`: Executa verificações do ESLint
- `pnpm format`: Formata código com Prettier e corrige problemas do ESLint

## Estrutura do Projeto

```
apps/web/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página inicial
│   │   ├── layout.tsx            # Layout raiz
│   │   ├── globals.css           # Estilos globais
│   │   ├── middleware.ts         # Autenticação
│   │   ├── actions/              # Server Actions
│   │   ├── login/                 # Páginas de login
│   │   │   ├── clinic/            # Login da clínica
│   │   │   └── family/            # Login da família
│   │   ├── clinic/                # Portal da clínica
│   │   │   └── dashboard/         # Dashboard da clínica
│   │   └── family/                # Portal da família
│   │       └── dashboard/         # Dashboard da família
│   ├── components/
│   │   ├── auth/                  # Componentes de login
│   │   ├── layout/               # Componentes de layout
│   │   │   ├── clinic/            # Layout da clínica
│   │   │   └── family/            # Layout da família (Navbar)
│   │   └── ui/                    # Componentes UI
│   │       ├── family/            # Componentes específicos da família
│   │       └── shared/            # Componentes compartilhados
│   ├── lib/
│   │   ├── api/                  # Clientes de API (mock/real)
│   │   ├── types.ts               # Tipos TypeScript
│   │   ├── auth*.ts               # Autenticação
│   │   └── utils/                # Funções utilitárias
│   │       ├── dateUtils.ts       # Formatação de datas relativas em português
│   │       └── stringUtils.ts     # Extração de iniciais de nomes
│   └── mocks/                     # MSW para desenvolvimento
│       ├── state.ts               # Estado centralizado
│       └── data/                  # Dados mock
├── public/                        # Arquivos estáticos
└── package.json                    # Dependências e scripts
```

## Portais da Aplicação

- **Portal da Clínica** (`/clinic/*`): Acesso para administradores e terapeutas gerenciarem pacientes, sessões e evoluções.
- **Portal da Família** (`/family/*`): Acesso para familiares visualizarem as evoluções liberadas dos pacientes.

### Dashboard da Família

O portal da família inclui:

- **Estatísticas**: Total de sessões e data da última sessão (formato relativo: Hoje, Ontem, Há 2 dias, etc.)
- **Avatar**: Iniciais do paciente na cor azul do Spectra
- **Cartão de Evolução**: Mostra a última evolução com o nome do terapeuta prefixado com "Terapeuta."
- **Navbar Responsivo**:
  - Mobile: Fixo na parte inferior, ícones acima do texto
  - Desktop: Fixo na parte superior, ícones ao lado do texto

### Dashboard da Clínica

O portal da clínica inclui:

- **Layout Sidebar**: Barra lateral fixa à esquerda com navegação
- **Header**: Logo da marca Spectra com subtítulo "Gerenciamento de Clínica"
- **Navegação**: Links para Dashboard, Pacientes e Sessões
- **Estado Ativo**: Estilização com gradiente azul e indicador visual
- **Header de Usuário**: Usa o header `x-user` do middleware para contexto de autenticação
- **Navbar Superior**: Barra de navegação fixa no topo com busca de pacientes e avatar do usuário

## Usuários Disponíveis (Mock)

| Email              | Role      |
| ------------------ | --------- |
| admin@spectra.com  | admin     |
| ana@spectra.com    | therapist |
| carlos@spectra.com | therapist |
| maria@gmail.com    | family    |

Qualquer senha funciona no mock de login.

## Endpoints Mockados

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

## Deploy na Vercel

A maneira mais fácil de fazer o deploy é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

## Leia Mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS 4](https://tailwindcss.com/docs)
- [Documentação do React 19](https://react.dev)

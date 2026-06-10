# Aplicação Web Spectra

Parte do monorepo Spectra, esta é uma aplicação Next.js 16 construída com React 19, Tailwind CSS 4 e TypeScript. Fornece uma interface web para gerenciamento de dados de pacientes, integrando-se com a API do backend do Spectra.

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Linguagem**: TypeScript
- **Linting/Formatting**: ESLint com configuração Next.js + Prettier
- **i18n**: next-intl com suporte a PT-BR e EN (cookie `locale`)
- **Autenticação**: Cookie-based (JWT em `access_token`)
- **Mock**: MSW com estado centralizado em memória

## Autenticação

O sistema de autenticação usa cookies para manter a sessão do usuário:

- **AuthService**: Use `authService` de `@/lib/authService` para todas operações de auth
  - `authService.login({ email, password })` - Login do usuário
  - `authService.me()` - Obter informações do usuário atual
  - `authService.logout()` - Encerrar sessão
- **AuthResolver**: Use `authResolver` de `@/lib/authResolver` para resolver identidade do usuário
  - `authResolver.getUser(cookieValue)` - Resolve usuário a partir do cookie
- **Utilitários Recomendados**: Use as funções de `@/lib/utils/` para padrões comuns:
  - `resolveUser()` - Resolve usuário em páginas (evita parsing manual)
  - `resolveUserWithRole(role)` - Resolve usuário com validação de role
  - `getDashboardUrl(role)` - Obtém URL do dashboard baseada na role
  - `getLoginUrl(role)` - Obtém URL de login baseada na role
  - `getUseMock()` - Verifica modo mock vs real
- **Troca por ambiente**: Defina `NEXT_PUBLIC_DISABLE_MSW=false` para usar mock (padrão em dev), `true` para API real
- **Cookie**: `access_token` armazena o token JWT após login
- **Autorização**: Todas as chamadas de API incluem automaticamente o header `Authorization: Bearer {token}` via `src/lib/api/http.ts`
- **Logout**: Use `logoutAction` de `src/app/actions/auth.ts` para encerrar a sessão
- **Middleware**: `src/app/middleware.ts` verifica autenticação em todas as rotas
- **Rotas públicas**: `/`, `/login/*` (acesso livre)
- **Rotas protegidas**: `/clinic/*` e `/family/*` requerem autenticação
- **Redirect**: Usuários não autenticados são redirecionados para `/` (página inicial)

## Internacionalização (i18n)

O app usa **next-intl** com roteamento de idioma único (sem `[locale]` na URL):

- **Locale cookie**: `locale` armazena `'en'` ou `'pt-BR'` (padrão: `'en'`)
- **LanguageToggle**: Única instância no layout raiz (`fixed top-4 right-4 z-[60]`)
- **Client Components**: `useTranslations('Namespace')` para strings traduzíveis
- **Server Components**: `getTranslations('Namespace')` de `next-intl/server`
- **Server Actions**: `getServerT()` de `@/lib/utils/translationUtils`
- **Arquivos de tradução**: `messages/en.json` e `messages/pt-BR.json` (mesmas chaves, valores diferentes)

### Formulários de Login

Novos portais de login devem extender `BaseLoginForm` em `src/components/auth/BaseLoginForm.tsx`:

````tsx
import { BaseLoginForm } from '@/components/auth/BaseLoginForm'
import { CustomIcon } from 'lucide-react'

export function NewPortalLoginForm() {
  return (
    <BaseLoginForm
      subtitle="Descrição do portal"
      startIcon={<CustomIcon size={25} className="text-blue-600" />}
    />
  )
}

## Arquitetura de API

### Respostas Paginadas

A API real retorna respostas paginadas no formato Django REST Framework:

```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [...]
}
````

O cliente HTTP (`src/lib/api/clinic-real.ts`, `src/lib/api/family-real.ts`) automaticamente unwraps o array `results` para retornar apenas os dados.

### Estado Centralizado de Mock

O projeto utiliza um sistema de estado mock centralizado em `src/mocks/state.ts`:

- Todos os dados mock (usuários, pacientes, sessões, evoluções) são armazenados em memória
- Não há chamadas fetch no modo mock - todos os dados vêm do estado centralizado
- Arquitetura lazy-load: implementações mock/real são carregadas dinamicamente conforme `NEXT_PUBLIC_DISABLE_MSW`

### Estrutura de API

```

src/lib/api/
├── clinic.ts # Dispatcher (lazy-load)
├── clinic-mock.ts # Implementação mock
├── clinic-real.ts # Implementação HTTP real
├── family.ts # Dispatcher (lazy-load)
├── family-mock.ts # Implementação mock
└── family-real.ts # Implementação HTTP real

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
| `locale` (cookie)          | Idioma: `'en'` ou `'pt-BR'`                    | `'en'`                  |

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
├── messages/                       # Traduções (en.json, pt-BR.json)
├── src/
│   ├── app/
│   │   ├── page.tsx              # Página inicial
│   │   ├── layout.tsx            # Layout raiz + NextIntlClientProvider + LanguageToggle
│   │   ├── globals.css           # Estilos globais
│   │   ├── actions/              # Server Actions (usam getServerT())
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
│   │       ├── clinic/            # Componentes específicos da clínica
│   │       ├── family/            # Componentes específicos da família
│   │       └── shared/            # Componentes compartilhados (incl. LanguageToggle)
│   ├── i18n/
│   │   └── request.ts            # Resolução de locale (cookie → locale)
│   ├── lib/
│   │   ├── api/                  # Clientes de API (mock/real)
│   │   ├── types.ts               # Tipos TypeScript (incl. Messages)
│   │   ├── auth*.ts               # Autenticação
│   │   └── utils/                # Funções utilitárias
│   │       ├── index.ts           # Exportação barrel
│   │       ├── dateUtils.ts       # Formatação de datas (locale-aware)
│   │       ├── stringUtils.ts     # Extração de iniciais de nomes
│   │       ├── userUtils.ts       # Resolução de usuário (resolveUser)
│   │       ├── greetingUtils.ts   # Geração de saudações (locale-aware)
│   │       ├── dateRangeUtils.ts  # Cálculos de intervalo de datas (locale-aware)
│   │       ├── statsUtils.ts      # Cálculos de estatísticas
│   │       ├── envUtils.ts        # Verificações de ambiente (getUseMock)
│   │       ├── redirectUtils.ts   # Redirects por role
│   │       ├── permissionUtils.ts # Permissões de sessões/evoluções
│   │       ├── sessionStatusUtils.ts # Status de sessão (locale-aware)
│   │       └── translationUtils.ts   # getServerT() para server actions
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
- **Header de Usuário**: Usa `authService.me()` para buscar dados do usuário para contexto de autenticação
- **Navbar Superior**: Barra de navegação fixa no topo com busca de pacientes e avatar do usuário

## Usuários Disponíveis

### Mock (NEXT_PUBLIC_DISABLE_MSW=false)

| Email              | Role      | Senha          |
| ------------------ | --------- | -------------- |
| admin@spectra.com  | admin     | qualquer senha |
| ana@spectra.com    | therapist | qualquer senha |
| carlos@spectra.com | therapist | qualquer senha |
| maria@gmail.com    | family    | qualquer senha |

### Real API (NEXT_PUBLIC_DISABLE_MSW=true)

| Email              | Role      | Senha        |
| ------------------ | --------- | ------------ |
| admin@spectra.com  | admin     | admin123     |
| ana@spectra.com    | therapist | therapist123 |
| carlos@spectra.com | therapist | therapist123 |
| maria@spectra.com  | family    | family123    |

**Nota**: Execute `python manage.py seed` no backend para criar os usuários na API real.

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

## Documentação Interna

Veja a pasta `docs/` para guias adicionais:

- `docs/CODING_CONVENTIONS.md` - Convenções e padrões do projeto
- `docs/COMPONENT_STRUCTURE.md` - Estrutura e criação de componentes
- `docs/UTILITY_USAGE.md` - Referência de utilitários existentes
- `docs/PAGE_TEMPLATE.md` - Templates padrão para páginas
- `docs/mock/` - Documentação completa do sistema de mock

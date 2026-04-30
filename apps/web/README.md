# Aplicação Web Spectra

Parte do monorepo Spectra, esta é uma aplicação Next.js 16 construída com React 19, Tailwind CSS 4 e TypeScript. Fornece uma interface web para gerenciamento de dados de pacientes, integrando-se com a API do backend do Spectra.

> **Nota**: Este projeto utiliza uma versão modificada do Next.js com mudanças que quebram compatibilidade com a versão padrão. Consulte `node_modules/next/dist/docs/` para documentação específica do framework antes de contribuir.

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Linguagem**: TypeScript
- **Linting/Formatting**: ESLint com configuração Next.js + Prettier

## Pré-requisitos

- Node.js (v18+ recomendado)
- pnpm (gerenciador de pacotes)
- Backend do Spectra rodando localmente em `http://127.0.0.1:8000`

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
│   │   ├── actions/              # Server Actions
│   │   ├── login/                # Páginas de login
│   │   │   ├── clinic/           # Login da clínica
│   │   │   └── family/           # Login da família
│   │   ├── clinic/               # Portal da clínica
│   │   └── family/               # Portal da família
│   ├── components/               # Componentes React
│   ├── lib/                      # Clientes de API e tipos
│   └── mocks/                    # MSW para desenvolvimento
├── public/                       # Arquivos estáticos
└── package.json                   # Dependências e scripts
```

## Portais da Aplicação

- **Portal da Clínica** (`/clinic/*`): Acesso para administradores e terapeutas gerenciarem pacientes, sessões e evoluções.
- **Portal da Família** (`/family/*`): Acesso para familiares visualizarem as evoluções liberadas dos pacientes.

## Saiba Mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS 4](https://tailwindcss.com/docs)
- [Documentação do React 19](https://react.dev)

## Deploy na Vercel

A maneira mais fácil de fazer o deploy é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

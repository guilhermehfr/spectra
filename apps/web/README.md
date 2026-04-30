# Aplicação Web Spectra

Parte do monorepo Spectra, esta é uma aplicação Next.js 16 construída com React 19, Tailwind CSS 4 e TypeScript. Fornece uma interface web para gerenciamento de dados de pacientes, integrando-se com a API do backend do Spectra.

> **Nota**: Este projeto utiliza uma versão modificada do Next.js com mudanças que quebram compatibilidade com a versão padrão. Consulte `node_modules/next/dist/docs/` para documentação específica do framework antes de contribuir.

## Tecnologias

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4
- **Linguagem**: TypeScript
- **Linting**: ESLint com configuração Next.js

## Pré-requisitos

- Node.js (v18+ recomendado)
- Backend do Spectra rodando localmente em `http://127.0.0.1:8000` (necessário para a funcionalidade da página de Pacientes)

## Começando

Primeiro, certifique-se de que o backend do Spectra está rodando. Em seguida, inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

### Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa verificações do ESLint

## Estrutura do Projeto

```
apps/web/
├── app/
│   ├── page.tsx          # Página inicial
│   ├── patients/         # Página de listagem de pacientes (busca dados da API do backend)
│   ├── globals.css       # Estilos globais
│   └── layout.tsx       # Layout raiz
├── public/               # Arquivos estáticos
└── package.json          # Dependências e scripts
```

## Saiba Mais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do Tailwind CSS 4](https://tailwindcss.com/docs)
- [Documentação do React 19](https://react.dev)

## Deploy na Vercel

A maneira mais fácil de fazer o deploy é usando a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme). Consulte a [documentação de deploy do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

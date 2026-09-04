# NameFit Front-end

Aplicação web para gerenciamento de treinos de academia: criação de rotinas, execução
de treinos com acompanhamento em tempo real e histórico de desempenho ao longo do tempo.

> Este repositório contém apenas o front-end. O back-end (API) está em [workout-tracker](https://github.com/mixsz/workout-tracker).

## Tecnologias

- React 19
- React Router 7
- Vite
- Tailwind CSS
- Axios
- Lucide React (ícones)
- Docker (build multi-stage + Nginx)

## Funcionalidades

- Autenticação (login e cadastro), com renovação automática de sessão via refresh token
- Rotas protegidas por autenticação, e rotas administrativas restritas a usuários `ADMIN`
- Gerenciamento de treinos (criar, editar, excluir, reordenar)
- Execução de treino em tempo real, com controle de treino ativo (retoma treino em andamento)
- Histórico de treinos executados, com detalhamento por sessão
- Perfil do usuário (nome, senha, avatar)
- Painel administrativo para CRUD de exercícios, com busca e filtro por grupo muscular
- Feedback visual via toasts e tratamento de estado de erro de conexão com a API

## Pré-requisitos

- Node.js 20+ e npm

**Alternativa com Docker:**

- Docker e Docker Compose instalados

## Como rodar o projeto

### 1. Clone o repositório

```
git clone https://github.com/mixsz/namefit-frontend.git
cd namefit-frontend
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com a seguinte chave:

```
VITE_API_URL=http://localhost:8080
```

> Aponte para a URL onde a [API do backend](https://github.com/mixsz/workout-tracker) está rodando.

### 3 (opção A) Rodando com Node

```
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 3 (opção B) Rodando com Docker

```
docker-compose up --build
```

A aplicação estará disponível em `http://localhost:5173` (pelo Nginx na porta 80 do container)

## Autenticação

O front consome a API de autenticação JWT do backend:

1. Cadastro em `/cadastro` e login em `/login`
2. O `token` e o `refreshToken` retornados são armazenados no navegador e enviados
   automaticamente nas requisições protegidas
3. Em caso de expiração do `token`, o front tenta renovar a sessão automaticamente via
   `refreshToken`; se a renovação falhar, o usuário é redirecionado para `/login`

Usuários com role `ADMIN` têm acesso adicional à rota `/admin` (CRUD de exercícios).

## Páginas principais

| Rota                 | Descrição                                              | Acesso     |
| --------------------- | ------------------------------------------------------- | ---------- |
| /login                | Autenticação                                            | Público    |
| /cadastro             | Criação de conta                                         | Público    |
| /home                 | Visão geral (treinos, atalhos)                          | Autenticado |
| /treinos              | Lista de treinos do usuário                             | Autenticado |
| /treinos/:id          | Detalhe de um treino (exercícios, séries, repetições)   | Autenticado |
| /execucao/:id         | Execução de um treino em andamento                       | Autenticado |
| /historico            | Histórico de treinos executados, com filtros            | Autenticado |
| /historico/:id        | Detalhe de uma sessão de treino executada                | Autenticado |
| /exercicios           | Catálogo de exercícios disponíveis                       | Autenticado |
| /perfil               | Dados do usuário (nome, senha, avatar)                   | Autenticado |
| /admin                | CRUD de exercícios do catálogo                           | ADMIN      |

## Estrutura do projeto

```
src/
├── components/    # Componentes de UI e views de cada página
├── pages/         # Páginas roteadas (containers com lógica de dados)
├── context/       # Contextos globais (autenticação, treino ativo, toasts)
├── hooks/         # Hooks customizados (useAuth, useActiveWorkout, useToast)
├── services/      # Cliente HTTP (axios) e interceptors de autenticação
├── constants/     # Constantes do domínio (categorias de exercício, avatares, limites)
├── utils/         # Funções utilitárias (formatação de data, etc.)
└── theme.js       # Paleta de cores/tema visual do app
```

## Status do projeto

Projeto desenvolvido para estudo prático de React, cobrindo desde a base
(componentização, roteamento, consumo de API) até fluxos mais complexos de UX
(execução de treino em tempo real, renovação de sessão) e integração com Docker/Nginx.
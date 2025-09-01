# Arquitetura do Projeto VidaPlus Health Hub

## Visão Geral

Aplicação SPA (Single Page Application) construída com React + Vite + TypeScript. O foco é fornecer dashboards e funcionalidades básicas de um sistema de gestão hospitalar (demo) para diferentes perfis de usuário.

## Camadas Principais

- `src/pages`: Páginas ligadas a rotas (login, registro, dashboards, etc.).
- `src/components`: Componentes reutilizáveis e específicos (Dashboard, Layout, UI).
- `src/components/ui`: Conjunto de componentes estilizados (base shadcn / Radix) padronizados.
- `src/hooks`: Hooks customizados (ex: `useAuth`, `use-toast`).
- `src/lib`: Utilidades e helpers (funções puras).
- `src/main.tsx`: Ponto de entrada que monta a árvore React.
- `src/App.tsx`: Define provedores globais e o roteamento.

## Gerenciamento de Estado

- Estado local via hooks (`useState`, `useEffect`).
- Estado remoto preparado para uso com `@tanstack/react-query` (já configurado `QueryClientProvider`). No momento, telas usam dados mockados.

## Autenticação

- Implementação simplificada guardando usuário no `localStorage` (`vidaplus_user`).
- Hook `useAuth` faz bootstrap e oferece métodos `updateUser` e `logout`.
- Em produção: trocar por fluxo JWT ou OAuth + refresh tokens e proteger rotas.

## Roteamento

- `react-router-dom` com `BrowserRouter` e `basename` derivado de `import.meta.env.BASE_URL` (necessário para GitHub Pages).
- Rotas definidas em `App.tsx`. Página `NotFound` captura rota desconhecida.

## Estilização e UI

- Tailwind CSS + design tokens via CSS custom properties.
- Componentes headless Radix UI embrulhados em componentes com estilo (padrão shadcn-ui).
- `class-variance-authority` e `tailwind-merge` ajudam na composição de estilos.

## Acessibilidade

- Uso dos componentes Radix (foco em acessibilidade).
- Labels, `aria-label` e semântica aplicada em formulários e elementos interativos.

## Build e Deploy

- Build: Vite (plugin react-swc para transpilar rápido).
- Deploy: GitHub Pages via workflow CI (`.github/workflows/deploy.yml`), criando artefato `dist` e fallback `404.html` para SPA.

## Diretórios de Dashboard

- `components/Dashboard/*` contém dashboards específicos (Paciente, Médico, Admin). Cada um manipula dados mockados.

## Mock de Dados

- Login: objeto `demoUsers` com credenciais de demonstração.
- Dashboards e exames: arrays estáticos manipulados em tempo de execução para simular CRUD básico.

## Próximos Passos Sugestões

1. Extração de serviços (ex: `services/api.ts`) para centralizar chamadas HTTP.
2. Guard de rotas protegidas (HOC ou componente `<PrivateRoute />`).
3. Tema persistido no `localStorage` ou `prefers-color-scheme`.
4. Testes (Vitest + Testing Library) para hooks e componentes críticos.
5. Internacionalização (ex: `react-intl` ou `i18next`).
6. Integração real de WebRTC/streaming para teleconsulta.
7. Separar tipagens em `src/types` e usar Zod para schemas e inferências.

## Fluxo de Login Simplificado

1. Usuário preenche formulário e envia.
2. Simula delay e valida contra `demoUsers`.
3. Se ok: persiste JSON no `localStorage`, mostra toast e redireciona `/`.
4. Caso falha: mostra toast destrutivo.
5. `useAuth` lê `localStorage` no mount e hidrata estado.

## Tratamento de Erros

- Atualmente console.error para parse de usuário inválido.
- Sugere-se adicionar boundary e logging estruturado (ex: Sentry) em produção.

## Segurança (Pontos a Evoluir)

- Remover credenciais fixas do cliente em produção.
- Usar HTTPS + JWT/Rotating Refresh Tokens.
- Sanitização / validação robusta (já há Zod disponível, integrar).

## Performance

- SWC acelera build.
- Possível ativar code splitting dinâmico (lazy import) para rotas grandes.

## Deploy em GitHub Pages

- `vite.config.ts` define `base` para `/vidaplus-health-hub/`.
- Workflow gera `404.html` = fallback SPA para permitir refresh em rotas internas.

---
Esta documentação evolui conforme funcionalidades são adicionadas.

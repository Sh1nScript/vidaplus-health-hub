# VidaPlus Health Hub

Painel (dashboard) web em React/TypeScript para diferentes perfis (Paciente, Médico, Admin), usando Vite, Tailwind e componentes acessíveis.

## ✨ Principais Features

- Múltiplos dashboards (Paciente, Médico, Admin)
- Biblioteca de componentes reutilizáveis (shadcn + Radix primitives)
- Theming (modo claro/escuro) via classes
- Formulários tipados com React Hook Form + Zod
- Fetch/cache de dados preparado para React Query
- Layout responsivo e acessível

## 🧱 Stack Tecnológica

| Categoria | Tecnologias |
|-----------|-------------|
| Build | Vite + SWC (@vitejs/plugin-react-swc) |
| Linguagem | TypeScript, React 18 |
| UI | Tailwind CSS, shadcn/ui, Radix UI, lucide-react |
| Formulários | react-hook-form, zod, @hookform/resolvers |
| Estado remoto | @tanstack/react-query |
| Gráficos | recharts |
| Datas | date-fns, react-day-picker |
| Feedback/UX | sonner (toasts) |
| Utilidades CSS | class-variance-authority, tailwind-merge, clsx |

## 🚀 Início Rápido

Pré-requisitos: Node.js LTS (ou Bun). Recomendo Node >= 20.

Clonar e instalar (npm):
 
```sh
git clone https://github.com/Sh1nScript/vidaplus-health-hub.git
cd vidaplus-health-hub
npm install
npm run dev
```

Usando Bun (opcional):
 
```sh
bun install
bun run dev
```

Abrir o browser: <http://localhost:5173> (ou porta mostrada no terminal).

## 📂 Estrutura Simplificada

```text
src/
	components/        # Componentes reutilizáveis e dashboards
	pages/             # Páginas de rota
	hooks/             # Hooks customizados
	lib/               # Utilidades (helpers)
	main.tsx           # Entrada React
```

## 🛠 Scripts Principais

| Script | Descrição |
|--------|-----------|
| dev | Ambiente de desenvolvimento |
| build | Build de produção (gera `dist/`) |
| preview | Servir build localmente |
| lint | ESLint |

## 🌐 Deploy no GitHub Pages

O repositório já inclui workflow (`.github/workflows/deploy.yml`). Em cada push na branch `main`:

1. Instala dependências
2. Executa `vite build`
3. Publica `dist/` no GitHub Pages

Configuração chave no `vite.config.ts`:
 
```ts
base: mode === 'production' ? '/vidaplus-health-hub/' : '/',
```

URL final: <https://sh1nscript.github.io/vidaplus-health-hub/>

Se mudar o nome do repo, ajuste a `base` e faça novo commit.

### Domínio personalizado

Em Settings > Pages adicione um domínio (opcional). Crie um `CNAME` apontando para `sh1nscript.github.io`.

## 🧪 Boas Práticas Futuras

- Adicionar testes (Vitest / Testing Library)
- Adicionar CI de lint e type-check
- Integração real de API + React Query
- Proteção de rotas e autenticação real

## 🤝 Contribuição

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -m "feat: minha feature"`
3. Push: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 📄 Licença

Defina aqui a licença (ex: MIT). Se usar MIT, crie um arquivo `LICENSE`.

---
Made with React & Tailwind.

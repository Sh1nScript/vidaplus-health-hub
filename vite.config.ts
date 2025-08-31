import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// ATENÇÃO: Substitua REPO_NAME pelo nome exato do repositório no GitHub quando publicar em um project site
// Se for um user/organization site (ex: usuario.github.io) deixe base: '/' mesmo em produção.
export default defineConfig(({ mode }) => ({
  // Base para GitHub Pages (project site).
  base: mode === 'production' ? '/vidaplus-health-hub/' : '/',
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

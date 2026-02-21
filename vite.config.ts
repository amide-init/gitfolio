import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages:
  // - user site  (username.github.io): base should be '/'
  // - project site (username.github.io/repo): base should be '/repo/'
  // We drive this via VITE_BASE set in the CI workflow.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  server: {
    // Proxy GitHub OAuth endpoints to avoid CORS (browser blocks direct calls to github.com)
    proxy: {
      '/api/github/login': {
        target: 'https://github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/github/, ''),
      },
    },
  },
})

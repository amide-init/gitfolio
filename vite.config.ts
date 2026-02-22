import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { copyFileSync, mkdirSync, readdirSync, readFileSync, existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// For project site (username.github.io/repo): keep 1 path segment (repo name)
// For user site (username.github.io): keep 0
const base = process.env.VITE_BASE || '/'
const pathSegmentsToKeep = base !== '/' ? 1 : 0

// GitHub Pages SPA 404 fix: redirects unknown paths to index.html with path in query string
// https://github.com/rafgraph/spa-github-pages
const html404 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Redirecting…</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = ${pathSegmentsToKeep};
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body><p>Redirecting…</p></body>
</html>`

function ghPages404() {
  return {
    name: 'gh-pages-404',
    closeBundle() {
      writeFileSync(join(process.cwd(), 'dist', '404.html'), html404)
    },
  }
}

function copyData() {
  return {
    name: 'copy-data',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = req.url?.match(/^\/data\/([a-z0-9_-]+\.json)$/i)
        if (!m) return next()
        const dataDir = join(process.cwd(), 'data')
        const file = join(dataDir, m[1])
        if (!existsSync(file)) return next()
        try {
          res.setHeader('Content-Type', 'application/json')
          res.end(readFileSync(file, 'utf-8'))
        } catch {
          next()
        }
      })
    },
    closeBundle() {
      const dataDir = join(process.cwd(), 'data')
      const outDir = join(process.cwd(), 'dist', 'data')
      if (!existsSync(dataDir)) return
      mkdirSync(outDir, { recursive: true })
      for (const name of readdirSync(dataDir)) {
        if (name.endsWith('.json')) {
          copyFileSync(join(dataDir, name), join(outDir, name))
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react(), ghPages404(), copyData()],
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

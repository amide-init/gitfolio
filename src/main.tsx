import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AdminPage from './admin/AdminPage'
import { AdminConfigPage } from './admin/pages/AdminConfigPage'
import { AdminPlaceholderPage } from './admin/pages/AdminPlaceholderPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="admin" element={<AdminPage />}>
          <Route index element={<Navigate to="config" replace />} />
          <Route path="config" element={<AdminConfigPage />} />
          <Route
            path="projects"
            element={
              <AdminPlaceholderPage
                title="Projects"
                description="Manage featured projects and repositories."
              />
            }
          />
          <Route
            path="blogs"
            element={
              <AdminPlaceholderPage
                title="Blogs"
                description="Manage blog posts and articles."
              />
            }
          />
          <Route
            path="videos"
            element={
              <AdminPlaceholderPage
                title="Videos"
                description="Manage video content and embeds."
              />
            }
          />
          <Route
            path="posts"
            element={
              <AdminPlaceholderPage
                title="Posts"
                description="Manage social posts and updates."
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

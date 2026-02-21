import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import AdminPage from './admin/AdminPage'
import { AdminBlogsPage } from './admin/pages/AdminBlogsPage'
import { AdminConfigPage } from './admin/pages/AdminConfigPage'
import { AdminPostsPage } from './admin/pages/AdminPostsPage'
import { AdminProjectsPage } from './admin/pages/AdminProjectsPage'
import { AdminPlaceholderPage } from './admin/pages/AdminPlaceholderPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="admin" element={<AdminPage />}>
          <Route index element={<Navigate to="config" replace />} />
          <Route path="config" element={<AdminConfigPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
          <Route
            path="videos"
            element={
              <AdminPlaceholderPage
                title="Videos"
                description="Manage video content and embeds."
              />
            }
          />
          <Route path="posts" element={<AdminPostsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

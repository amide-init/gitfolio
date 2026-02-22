import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import HomePage from './pages/HomePage'
import VideosPage from './pages/VideosPage'
import BlogsPage from './pages/BlogsPage'
import BlogPage from './pages/BlogPage'
import ProjectsPage from './pages/ProjectsPage'
import AdminPage from './admin/AdminPage'
import { AdminBlogsPage } from './admin/pages/AdminBlogsPage'
import { AdminConfigPage } from './admin/pages/AdminConfigPage'
import { AdminPostsPage } from './admin/pages/AdminPostsPage'
import { AdminProjectsPage } from './admin/pages/AdminProjectsPage'
import { AdminVideosPage } from './admin/pages/AdminVideosPage'
import { AdminSettingsPage } from './admin/pages/AdminSettingsPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="videos" element={<VideosPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blog/:id" element={<BlogPage />} />
          <Route path="projects" element={<ProjectsPage />} />
        </Route>
        <Route path="admin" element={<AdminPage />}>
          <Route index element={<Navigate to="config" replace />} />
          <Route path="config" element={<AdminConfigPage />} />
          <Route path="projects" element={<AdminProjectsPage />} />
          <Route path="blogs" element={<AdminBlogsPage />} />
          <Route path="videos" element={<AdminVideosPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

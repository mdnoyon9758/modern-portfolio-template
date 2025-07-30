import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ProjectsAdmin from './pages/admin/ProjectsAdmin';
import ProjectForm from './pages/admin/ProjectForm';
import BlogManagement from './pages/admin/BlogManagement';
import BlogForm from './pages/admin/BlogForm';
import ContactManagement from './pages/admin/ContactManagement';
import Settings from './pages/admin/Settings';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/contact" element={<Contact />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects" element={
                  <ProtectedRoute>
                    <ProjectsAdmin />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects/new" element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/projects/edit/:id" element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog" element={
                  <ProtectedRoute>
                    <BlogManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/new" element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/edit/:id" element={
                  <ProtectedRoute>
                    <BlogForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/messages" element={
                  <ProtectedRoute>
                    <ContactManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

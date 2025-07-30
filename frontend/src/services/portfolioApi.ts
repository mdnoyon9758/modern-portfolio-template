import api from './api';
import { 
  Project, 
  BlogPost, 
  ContactFormData, 
  ContactMessage,
  MessageResponse, 
  Skill, 
  Experience, 
  Education,
  SiteSettings
} from '../types/api';

// Projects API
export const projectsApi = {
  getAll: () => api.get<Project[]>('/projects/'),
  getFeatured: () => api.get<Project[]>('/projects/featured'),
  getOrdered: (limit?: number) => api.get<Project[]>(`/projects/ordered${limit ? `?limit=${limit}` : ''}`),
  getById: (id: number) => api.get<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => api.post<Project>('/projects/', data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data),
  delete: (id: number) => api.delete(`/projects/${id}`),
};

// Blog API
export const blogApi = {
  getAll: () => api.get<BlogPost[]>('/blog/'),
  getPublished: () => api.get<BlogPost[]>('/blog/published'),
  getFeatured: () => api.get<BlogPost[]>('/blog/featured'),
  getById: (id: number) => api.get<BlogPost>(`/blog/${id}`),
  getBySlug: (slug: string) => api.get<BlogPost>(`/blog/slug/${slug}`),
  create: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => api.post<BlogPost>('/blog/', data),
  update: (id: number, data: Partial<BlogPost>) => api.put<BlogPost>(`/blog/${id}`, data),
  delete: (id: number) => api.delete(`/blog/${id}`),
};

// Contact API
export const contactApi = {
  submit: (data: ContactFormData) => api.post<MessageResponse>('/contact/', data),
  testEmail: () => api.post<MessageResponse>('/contact/test-email'),
  getAll: () => api.get<ContactMessage[]>('/contact/'),
  getById: (id: number) => api.get<ContactMessage>(`/contact/${id}`),
  delete: (id: number) => api.delete(`/contact/${id}`),
};

// Skills API
export const skillsApi = {
  getAll: () => api.get<Skill[]>('/skills/'),
  getByCategory: (category?: string) => api.get<Skill[]>(`/skills/by-category${category ? `?category=${category}` : ''}`),
  getOrdered: () => api.get<Skill[]>('/skills/ordered'),
  getById: (id: number) => api.get<Skill>(`/skills/${id}`),
  create: (data: Omit<Skill, 'id' | 'created_at'>) => api.post<Skill>('/skills/', data),
  update: (id: number, data: Partial<Skill>) => api.put<Skill>(`/skills/${id}`, data),
  delete: (id: number) => api.delete(`/skills/${id}`),
};

// Experience API
export const experienceApi = {
  getAll: () => api.get<Experience[]>('/experience/'),
  getOrdered: () => api.get<Experience[]>('/experience/ordered'),
  getCurrent: () => api.get<Experience[]>('/experience/current'),
  getById: (id: number) => api.get<Experience>(`/experience/${id}`),
  create: (data: Omit<Experience, 'id' | 'created_at'>) => api.post<Experience>('/experience/', data),
  update: (id: number, data: Partial<Experience>) => api.put<Experience>(`/experience/${id}`, data),
  delete: (id: number) => api.delete(`/experience/${id}`),
};

// Education API
export const educationApi = {
  getAll: () => api.get<Education[]>('/education/'),
  getOrdered: () => api.get<Education[]>('/education/ordered'),
  getCurrent: () => api.get<Education[]>('/education/current'),
  getById: (id: number) => api.get<Education>(`/education/${id}`),
  create: (data: Omit<Education, 'id' | 'created_at'>) => api.post<Education>('/education/', data),
  update: (id: number, data: Partial<Education>) => api.put<Education>(`/education/${id}`, data),
  delete: (id: number) => api.delete(`/education/${id}`),
};

// Site Settings API
export const siteSettingsApi = {
  getAll: () => api.get<SiteSettings[]>('/site-settings/'),
  getByKey: (key: string) => api.get<SiteSettings>(`/site-settings/key/${key}`),
  getById: (id: number) => api.get<SiteSettings>(`/site-settings/${id}`),
  create: (data: Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>) => api.post<SiteSettings>('/site-settings/', data),
  update: (id: number, data: Partial<SiteSettings>) => api.put<SiteSettings>(`/site-settings/${id}`, data),
  updateAll: (settings: Array<{key: string, value: string, description?: string}>) => api.post('/site-settings/bulk-update', settings),
  delete: (id: number) => api.delete(`/site-settings/${id}`),
};

// Portfolio API (legacy - for backward compatibility)
export const portfolioApi = {
  // Skills
  getSkills: (category?: string) => skillsApi.getByCategory(category),
  
  // Experience
  getExperience: (currentOnly?: boolean) => currentOnly ? experienceApi.getCurrent() : experienceApi.getAll(),
  
  // Education
  getEducation: () => educationApi.getAll(),
};

// Media API
export const mediaApi = {
  getAllImages: () => api.get<string[]>('/media/'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<{filename: string; url: string}>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Health check
export const healthApi = {
  check: () => api.get('/health', { baseURL: process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:8000' }),
};

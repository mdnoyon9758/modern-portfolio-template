// API Response Types
export interface Project {
  id: number;
  title: string;
  description: string;
  short_description?: string;
  technologies: string; // JSON string
  github_url?: string;
  live_url?: string;
  image_url?: string;
  featured: boolean;
  order_index: number;
  created_at: string;
  updated_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  tags?: string; // JSON string
  featured_image?: string;
  published: boolean;
  featured: boolean;
  reading_time?: number;
  created_at: string;
  updated_at?: string;
  published_at?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon_url?: string;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: number;
  company: string;
  position: string;
  description?: string;
  technologies?: string; // JSON string
  start_date: string;
  end_date?: string;
  current: boolean;
  company_url?: string;
  location?: string;
  order_index: number;
  created_at: string;
}

export interface Education {
  id: number;
  institution: string;
  degree: string;
  field_of_study?: string;
  description?: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  gpa?: string;
  location?: string;
  order_index: number;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  key: string;
  value?: string;
  description?: string;
  created_at: string;
  updated_at?: string;
}

// Request Types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}

// Utility types
export type TechnologyStack = string[];
export type BlogTags = string[];

// Parse JSON strings to arrays
export const parseTechnologies = (technologies: string): TechnologyStack => {
  try {
    return JSON.parse(technologies);
  } catch {
    return [];
  }
};

export const parseTags = (tags: string): BlogTags => {
  try {
    return JSON.parse(tags);
  } catch {
    return [];
  }
};

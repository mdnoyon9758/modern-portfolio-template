import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { siteSettingsApi } from '../services/portfolioApi';

interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerLocation: string;
  
  // Home Page Settings
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImageUrl: string;
  showHeroStats: boolean;
  yearsOfExperience: string;
  projectsCompleted: string;
  technologiesMastered: string;
  happyClients: string;
  
  // Hero Image Slider Settings
  enableHeroSlider: boolean;
  heroSliderImages: string; // JSON string of image URLs
  sliderAutoplay: boolean;
  sliderInterval: string; // in milliseconds
  sliderShowDots: boolean;
  sliderShowArrows: boolean;
  
  // About Page Settings
  aboutTitle: string;
  aboutBio: string;
  aboutInterests: string; // comma-separated
  resumeUrl: string;
  profileImageUrl: string;
  
  // Blog Settings
  blogTitle: string;
  blogDescription: string;
  blogAuthorName: string;
  showNewsletter: boolean;
  postsPerPage: string;
  
  // Projects Settings
  projectsTitle: string;
  projectsDescription: string;
  showFeaturedOnly: boolean;
  projectsPerPage: string;
  
  // Contact Settings
  contactTitle: string;
  contactDescription: string;
  showContactForm: boolean;
  contactFormEmail: string;
  officeHours: string;
  timezone: string;
  
  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Social Media
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  twitterUsername: string; // for @username in meta tags
  
  // Theme Settings
  primaryColor: string;
  darkMode: boolean;
  fontFamily: string;
  borderRadius: string;
  
  // Email Settings
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  
  // Analytics
  googleAnalyticsId: string;
  facebookPixelId: string;
  
  // Advanced Settings
  maintenanceMode: boolean;
  maintenanceMessage: string;
  customCSS: string;
  customJS: string;
  robotsTxt: string;
}

interface SiteSettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  // General Settings
  siteName: 'Portfolio',
  siteDescription: 'Full-Stack Developer Portfolio',
  siteUrl: 'https://yourportfolio.com',
  ownerName: 'Your Name',
  ownerEmail: 'your.email@example.com',
  ownerPhone: '+1 (555) 123-4567',
  ownerLocation: 'Your City, Country',
  
  // Home Page Settings
  heroTitle: 'Hi, I\'m [Your Name]',
  heroSubtitle: 'Full-Stack Developer & Tech Enthusiast',
  heroDescription: 'I build modern, responsive, and scalable web applications. Explore my portfolio to see my work and learn more about my skills.',
  heroImageUrl: '/hero-image.jpg',
  showHeroStats: true,
  yearsOfExperience: '5',
  projectsCompleted: '50+',
  technologiesMastered: '20+',
  happyClients: '30+',
  
  // Hero Image Slider Settings
  enableHeroSlider: false,
  heroSliderImages: JSON.stringify([
    '/logo192.png',
    '/logo512.png',
    'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Sample+Image+1',
    'https://via.placeholder.com/800x400/6366F1/FFFFFF?text=Sample+Image+2',
    'https://via.placeholder.com/800x400/10B981/FFFFFF?text=Sample+Image+3'
  ]),
  sliderAutoplay: true,
  sliderInterval: '5000',
  sliderShowDots: true,
  sliderShowArrows: true,

  // About Page Settings
  aboutTitle: 'About Me',
  aboutBio: `I\'m a passionate full-stack developer with 5 years of experience creating beautiful, functional, and user-friendly web applications. I specialize in modern JavaScript frameworks, cloud technologies, and agile development practices. My journey in tech started with a curiosity about how websites work, and it has evolved into a career where I get to solve complex problems and build solutions that make a real impact. I\'m always eager to learn new technologies and take on challenging projects that push my skills to the next level.`,
  aboutInterests: 'Web Development, Cloud Architecture, Open Source, Machine Learning, UI/UX Design, Blockchain Technology',
  resumeUrl: '/resume.pdf',
  profileImageUrl: '/profile-image.jpg',
  
  // Blog Settings
  blogTitle: 'Blog',
  blogDescription: 'Thoughts, tutorials, and insights about web development, technology, and the ever-evolving world of software engineering.',
  blogAuthorName: 'Your Name',
  showNewsletter: true,
  postsPerPage: '6',
  
  // Projects Settings
  projectsTitle: 'My Work',
  projectsDescription: 'A collection of my best work, from personal projects to client work. Each project showcases my skills in design, development, and problem-solving.',
  showFeaturedOnly: false,
  projectsPerPage: '6',
  
  // Contact Settings
  contactTitle: `Let\'s Work Together`,
  contactDescription: `Have a project in mind or want to discuss opportunities? I\'d love to hear from you. Let\'s create something amazing together.`,
  showContactForm: true,
  contactFormEmail: 'your.email@example.com',
  officeHours: 'Mon-Fri, 9am-5pm',
  timezone: 'PST',

  // SEO Settings
  metaTitle: 'Your Name - Full-Stack Developer',
  metaDescription: 'Experienced full-stack developer specializing in React, Node.js, and modern web technologies.',
  metaKeywords: 'web developer, full stack, react, nodejs, javascript',
  
  // Social Media
  githubUrl: 'https://github.com/yourusername',
  linkedinUrl: 'https://linkedin.com/in/yourusername',
  twitterUrl: 'https://twitter.com/yourusername',
  instagramUrl: '',
  facebookUrl: '',
  twitterUsername: '@yourusername',
  
  // Theme Settings
  primaryColor: '#3B82F6',
  darkMode: true,
  fontFamily: `'Inter', sans-serif`,
  borderRadius: '0.5rem',
  
  // Email Settings
  emailEnabled: true,
  smtpHost: 'smtp.gmail.com',
  smtpPort: '587',
  smtpUsername: '',
  smtpPassword: '',
  
  // Analytics
  googleAnalyticsId: '',
  facebookPixelId: '',
  
  // Advanced Settings
  maintenanceMode: false,
  maintenanceMessage: 'Site is currently under maintenance. Please check back later.',
  customCSS: '',
  customJS: '',
  robotsTxt: `User-agent: *\nAllow: /`,
};

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider: React.FC<SiteSettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await siteSettingsApi.getAll();
      const settingsData = response.data;
      
      // Convert array of settings to object
      const settingsObj = settingsData.reduce((acc, setting) => {
        acc[setting.key] = setting.value || '';
        return acc;
      }, {} as any);
      
      // Merge with defaults to ensure all properties exist
      setSettings(prev => ({ ...prev, ...settingsObj }));
    } catch (err) {
      setError(err as Error);
      console.error('Error loading site settings:', err);
      // Keep default settings if loading fails
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSettings = async () => {
    await loadSettings();
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const value: SiteSettingsContextType = {
    settings,
    isLoading,
    error,
    refreshSettings,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};

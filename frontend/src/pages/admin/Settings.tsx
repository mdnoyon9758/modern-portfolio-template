import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUploadInput from '../../components/ui/FileUploadInput';
import { Save, Globe, Mail, User, Shield, Database, Palette, Home, FileText, Briefcase, MessageCircle } from 'lucide-react';
import { siteSettingsApi } from '../../services/portfolioApi';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

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
  heroSliderImages: string;
  sliderAutoplay: boolean;
  sliderInterval: string;
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

const Settings: React.FC = () => {
  const { settings: currentSettings, isLoading: isLoadingSettings, refreshSettings } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(currentSettings);
  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About Page', icon: User },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'contact', label: 'Contact', icon: MessageCircle },
    { id: 'seo', label: 'SEO', icon: Globe },
    { id: 'social', label: 'Social Media', icon: User },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'advanced', label: 'Advanced', icon: Shield },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
        description: `Site setting: ${key}`
      }));

      await siteSettingsApi.updateAll(settingsArray);
      await refreshSettings();
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoadingSettings) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

const renderHomeSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hero Title
        </label>
        <input
          type="text"
          id="heroTitle"
          name="heroTitle"
          value={settings.heroTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Welcome to my Portfolio"
        />
      </div>

      <div>
        <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hero Subtitle
        </label>
        <input
          type="text"
          id="heroSubtitle"
          name="heroSubtitle"
          value={settings.heroSubtitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Full Stack Developer"
        />
      </div>

      <div>
        <label htmlFor="heroDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hero Description
        </label>
        <textarea
          id="heroDescription"
          name="heroDescription"
          rows={4}
          value={settings.heroDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="I create amazing web experiences..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Hero Image
        </label>
        <FileUploadInput
          label="Hero Image"
          value={settings.heroImageUrl}
          onChange={(value) => setSettings(prev => ({ ...prev, heroImageUrl: value }))}
          placeholder="Enter hero image URL or upload a file"
          accept="image/*"
        />
      </div>

      {/* Hero Image Slider Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="enableHeroSlider"
            name="enableHeroSlider"
            checked={settings.enableHeroSlider}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="enableHeroSlider" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Enable Hero Image Slider
          </label>
        </div>

        {settings.enableHeroSlider && (
          <div className="space-y-4">
            <div>
              <label htmlFor="heroSliderImages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slider Images (JSON Array)
              </label>
              <textarea
                id="heroSliderImages"
                name="heroSliderImages"
                rows={4}
                value={settings.heroSliderImages}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
                placeholder='["/img/hero1.jpg", "/img/hero2.jpg", "/img/hero3.jpg"]'
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enter a JSON array of image URLs. Images should be publicly accessible.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sliderInterval" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Slide Interval (ms)
                </label>
                <input
                  type="number"
                  id="sliderInterval"
                  name="sliderInterval"
                  value={settings.sliderInterval}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  min="1000"
                  max="10000"
                  step="500"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sliderAutoplay"
                    name="sliderAutoplay"
                    checked={settings.sliderAutoplay}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sliderAutoplay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Enable Autoplay
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sliderShowDots"
                    name="sliderShowDots"
                    checked={settings.sliderShowDots}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sliderShowDots" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show Dots Indicator
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sliderShowArrows"
                    name="sliderShowArrows"
                    checked={settings.sliderShowArrows}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sliderShowArrows" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Show Navigation Arrows
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="showHeroStats"
            name="showHeroStats"
            checked={settings.showHeroStats}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="showHeroStats" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Show Hero Statistics
          </label>
        </div>

        {settings.showHeroStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Years of Experience
              </label>
              <input
                type="text"
                id="yearsOfExperience"
                name="yearsOfExperience"
                value={settings.yearsOfExperience}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="5+"
              />
            </div>

            <div>
              <label htmlFor="projectsCompleted" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Projects Completed
              </label>
              <input
                type="text"
                id="projectsCompleted"
                name="projectsCompleted"
                value={settings.projectsCompleted}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="50+"
              />
            </div>

            <div>
              <label htmlFor="technologiesMastered" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Technologies Mastered
              </label>
              <input
                type="text"
                id="technologiesMastered"
                name="technologiesMastered"
                value={settings.technologiesMastered}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="20+"
              />
            </div>

            <div>
              <label htmlFor="happyClients" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Happy Clients
              </label>
              <input
                type="text"
                id="happyClients"
                name="happyClients"
                value={settings.happyClients}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="100+"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
  const renderAboutSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          About Section Title
        </label>
        <input
          type="text"
          id="aboutTitle"
          name="aboutTitle"
          value={settings.aboutTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="About Me"
        />
      </div>

      <div>
        <label htmlFor="aboutBio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Biography
        </label>
        <textarea
          id="aboutBio"
          name="aboutBio"
          rows={6}
          value={settings.aboutBio}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Tell your story..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Profile Image
          </label>
          <FileUploadInput
            label="Profile Image"
            value={settings.profileImageUrl}
            onChange={(value) => setSettings(prev => ({ ...prev, profileImageUrl: value }))}
            placeholder="Enter profile image URL or upload a file"
            accept="image/*"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Resume/CV
          </label>
          <FileUploadInput
            label="Resume/CV"
            value={settings.resumeUrl}
            onChange={(value) => setSettings(prev => ({ ...prev, resumeUrl: value }))}
            placeholder="Enter resume URL or upload a PDF file"
            accept=".pdf,application/pdf"
          />
        </div>
      </div>

      <div>
        <label htmlFor="aboutInterests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Interests & Hobbies
        </label>
        <input
          type="text"
          id="aboutInterests"
          name="aboutInterests"
          value={settings.aboutInterests}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Separate interests with commas: Photography, Travel, Music"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Separate multiple interests with commas
        </p>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Skills & Experience Management
          </h3>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/skills')}>
              Manage Skills
            </Button>
            <Button variant="secondary" size="sm" onClick={() => navigate('/admin/experience')}>
              Manage Experience
            </Button>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the dedicated management pages to add, edit, and remove your skills and work experience.
        </p>
      </div>
    </div>
  );
  const renderProjectsSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="projectsTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Projects Page Title
        </label>
        <input
          type="text"
          id="projectsTitle"
          name="projectsTitle"
          value={settings.projectsTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="My Projects"
        />
      </div>

      <div>
        <label htmlFor="projectsDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Projects Page Description
        </label>
        <textarea
          id="projectsDescription"
          name="projectsDescription"
          rows={3}
          value={settings.projectsDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Explore some of my recent work..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="projectsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Projects Per Page
          </label>
          <input
            type="number"
            id="projectsPerPage"
            name="projectsPerPage"
            value={settings.projectsPerPage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="50"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showFeaturedOnly"
            name="showFeaturedOnly"
            checked={settings.showFeaturedOnly}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="showFeaturedOnly" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Show Featured Projects Only
          </label>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Project Management
          </h3>
          <Button variant="secondary" size="sm" onClick={() => window.open('/admin/projects', '_blank')}>
            Manage Projects
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the projects management page to add, edit, and remove your portfolio projects.
        </p>
      </div>
    </div>
  );
  const renderBlogSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="blogTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Blog Page Title
        </label>
        <input
          type="text"
          id="blogTitle"
          name="blogTitle"
          value={settings.blogTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="My Blog"
        />
      </div>

      <div>
        <label htmlFor="blogDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Blog Page Description
        </label>
        <textarea
          id="blogDescription"
          name="blogDescription"
          rows={3}
          value={settings.blogDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Thoughts, tutorials, and insights..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="blogAuthorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Author Name
          </label>
          <input
            type="text"
            id="blogAuthorName"
            name="blogAuthorName"
            value={settings.blogAuthorName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Your Name"
          />
        </div>

        <div>
          <label htmlFor="postsPerPage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Posts Per Page
          </label>
          <input
            type="number"
            id="postsPerPage"
            name="postsPerPage"
            value={settings.postsPerPage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            min="1"
            max="50"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="showNewsletter"
          name="showNewsletter"
          checked={settings.showNewsletter}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="showNewsletter" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Show Newsletter Signup
        </label>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Blog Management
          </h3>
          <Button variant="secondary" size="sm" onClick={() => window.open('/admin/blog', '_blank')}>
            Manage Blog Posts
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the blog management page to create, edit, and delete your blog posts.
        </p>
      </div>
    </div>
  );
  const renderContactSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="contactTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contact Page Title
        </label>
        <input
          type="text"
          id="contactTitle"
          name="contactTitle"
          value={settings.contactTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Get in Touch"
        />
      </div>

      <div>
        <label htmlFor="contactDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Contact Page Description
        </label>
        <textarea
          id="contactDescription"
          name="contactDescription"
          rows={3}
          value={settings.contactDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Have a question or want to work together?"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="contactFormEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contact Form Email
          </label>
          <input
            type="email"
            id="contactFormEmail"
            name="contactFormEmail"
            value={settings.contactFormEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="your-email@example.com"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="showContactForm"
            name="showContactForm"
            checked={settings.showContactForm}
            onChange={handleChange}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="showContactForm" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Show Contact Form
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="officeHours" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Office Hours
          </label>
          <input
            type="text"
            id="officeHours"
            name="officeHours"
            value={settings.officeHours}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Mon-Fri, 9am-5pm"
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Timezone
          </label>
          <input
            type="text"
            id="timezone"
            name="timezone"
            value={settings.timezone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="GMT+0"
          />
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Message Management
          </h3>
          <Button variant="secondary" size="sm" onClick={() => window.open('/admin/messages', '_blank')}>
            Manage Messages
          </Button>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the message management page to view and reply to your contact form submissions.
        </p>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            name="siteName"
            value={settings.siteName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Site URL
          </label>
          <input
            type="url"
            id="siteUrl"
            name="siteUrl"
            value={settings.siteUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Site Description
        </label>
        <textarea
          id="siteDescription"
          name="siteDescription"
          rows={3}
          value={settings.siteDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={settings.ownerName}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="ownerEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="ownerEmail"
            name="ownerEmail"
            value={settings.ownerEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="ownerPhone"
            name="ownerPhone"
            value={settings.ownerPhone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="ownerLocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            type="text"
            id="ownerLocation"
            name="ownerLocation"
            value={settings.ownerLocation}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSEOSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Meta Title
        </label>
        <input
          type="text"
          id="metaTitle"
          name="metaTitle"
          value={settings.metaTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Meta Description
        </label>
        <textarea
          id="metaDescription"
          name="metaDescription"
          rows={3}
          value={settings.metaDescription}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="metaKeywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Meta Keywords
        </label>
        <input
          type="text"
          id="metaKeywords"
          name="metaKeywords"
          value={settings.metaKeywords}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Separate keywords with commas"
        />
      </div>

      <div>
        <label htmlFor="googleAnalyticsId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Google Analytics ID
        </label>
        <input
          type="text"
          id="googleAnalyticsId"
          name="googleAnalyticsId"
          value={settings.googleAnalyticsId}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="G-XXXXXXXXXX"
        />
      </div>
    </div>
  );

  const renderSocialSettings = () => (
    <div className="space-y-6">
      <div>
        <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          GitHub URL
        </label>
        <input
          type="url"
          id="githubUrl"
          name="githubUrl"
          value={settings.githubUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          LinkedIn URL
        </label>
        <input
          type="url"
          id="linkedinUrl"
          name="linkedinUrl"
          value={settings.linkedinUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Twitter URL
        </label>
        <input
          type="url"
          id="twitterUrl"
          name="twitterUrl"
          value={settings.twitterUrl}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>
    </div>
  );

const renderThemeSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Primary Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              id="primaryColor"
              name="primaryColor"
              value={settings.primaryColor}
              onChange={handleChange}
              className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={handleChange}
              name="primaryColor"
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="#3B82F6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="borderRadius" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Border Radius
          </label>
          <input
            type="text"
            id="borderRadius"
            name="borderRadius"
            value={settings.borderRadius}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.5rem"
          />
        </div>
      </div>

      <div>
        <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Font Family
        </label>
        <input
          type="text"
          id="fontFamily"
          name="fontFamily"
          value={settings.fontFamily}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="'Inter', sans-serif"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="darkMode"
          name="darkMode"
          checked={settings.darkMode}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="darkMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Enable Dark Mode by Default
        </label>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="emailEnabled"
          name="emailEnabled"
          checked={settings.emailEnabled}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="emailEnabled" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Enable Email Notifications
        </label>
      </div>

      {settings.emailEnabled && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="smtpHost" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Host
              </label>
              <input
                type="text"
                id="smtpHost"
                name="smtpHost"
                value={settings.smtpHost}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SMTP Port
              </label>
              <input
                type="text"
                id="smtpPort"
                name="smtpPort"
                value={settings.smtpPort}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SMTP Username
            </label>
            <input
              type="text"
              id="smtpUsername"
              name="smtpUsername"
              value={settings.smtpUsername}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              SMTP Password
            </label>
            <input
              type="password"
              id="smtpPassword"
              name="smtpPassword"
              value={settings.smtpPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </>
      )}
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="checkbox"
          id="maintenanceMode"
          name="maintenanceMode"
          checked={settings.maintenanceMode}
          onChange={handleChange}
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Enable Maintenance Mode
        </label>
      </div>

      {settings.maintenanceMode && (
        <div>
          <label htmlFor="maintenanceMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Maintenance Message
          </label>
          <textarea
            id="maintenanceMessage"
            name="maintenanceMessage"
            rows={3}
            value={settings.maintenanceMessage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      )}

      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Cache Management
        </h3>
        <div className="flex gap-4">
          <Button variant="secondary">
            <Database className="w-4 h-4 mr-2" />
            Clear Cache
          </Button>
          <Button variant="secondary">
            Rebuild Search Index
          </Button>
        </div>
      </div>
    </div>
  );

const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'home':
        return renderHomeSettings();
      case 'about':
        return renderAboutSettings();
      case 'projects':
        return renderProjectsSettings();
      case 'blog':
        return renderBlogSettings();
      case 'contact':
        return renderContactSettings();
      case 'seo':
        return renderSEOSettings();
      case 'social':
        return renderSocialSettings();
      case 'theme':
        return renderThemeSettings();
      case 'email':
        return renderEmailSettings();
      case 'advanced':
        return renderAdvancedSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Site Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit}>
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h2>
                
                {renderTabContent()}
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

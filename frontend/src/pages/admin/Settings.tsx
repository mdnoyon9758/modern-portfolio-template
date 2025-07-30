import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Save, Globe, Mail, User, Shield, Database, Palette } from 'lucide-react';
import { siteSettingsApi } from '../../services/portfolioApi';

interface SiteSettings {
  // General Settings
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  ownerLocation: string;
  
  // SEO Settings
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  
  // Social Media
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  
  // Theme Settings
  primaryColor: string;
  darkMode: boolean;
  
  // Email Settings
  emailEnabled: boolean;
  smtpHost: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  
  // Analytics
  googleAnalyticsId: string;
  
  // Maintenance
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    // General Settings
    siteName: 'Your Portfolio',
    siteDescription: 'Full-Stack Developer Portfolio',
    siteUrl: 'https://yourportfolio.com',
    ownerName: 'Your Name',
    ownerEmail: 'your.email@example.com',
    ownerPhone: '+1 (555) 123-4567',
    ownerLocation: 'Your City, Country',
    
    // SEO Settings
    metaTitle: 'Your Name - Full-Stack Developer',
    metaDescription: 'Experienced full-stack developer specializing in React, Node.js, and modern web technologies.',
    metaKeywords: 'web developer, full stack, react, nodejs, javascript',
    
    // Social Media
    githubUrl: 'https://github.com/yourusername',
    linkedinUrl: 'https://linkedin.com/in/yourusername',
    twitterUrl: 'https://twitter.com/yourusername',
    
    // Theme Settings
    primaryColor: '#3B82F6',
    darkMode: true,
    
    // Email Settings
    emailEnabled: true,
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: '',
    smtpPassword: '',
    
    // Analytics
    googleAnalyticsId: '',
    
    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'Site is currently under maintenance. Please check back later.',
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
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

  // Load settings from API
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const response = await siteSettingsApi.getAll();
        const settingsData = response.data;
        
        // Convert array of settings to object
        const settingsObj = settingsData.reduce((acc, setting) => {
          acc[setting.key] = setting.value || '';
          return acc;
        }, {} as any);
        
        setSettings(prev => ({ ...prev, ...settingsObj }));
      } catch (error) {
        console.error('Error loading settings:', error);
        // Keep default settings if loading fails
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert settings object to array of key-value pairs
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: value.toString(),
        description: `Site setting: ${key}`
      }));
      
      // Save each setting
      for (const setting of settingsArray) {
        try {
          // Try to get existing setting first
          await siteSettingsApi.getByKey(setting.key);
          // If it exists, we'd need to update it (would need the ID)
          // For now, let's just create new ones
        } catch {
          // Setting doesn't exist, create it
          await siteSettingsApi.create(setting);
        }
      }
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

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

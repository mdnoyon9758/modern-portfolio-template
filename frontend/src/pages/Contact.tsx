import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Send, Github, Linkedin, Twitter, Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { contactApi } from '../services/portfolioApi';
import SEO from '../components/SEO';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import InfoCard from '../components/ui/InfoCard';
import { ContactFormData } from '../types/api';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const Contact: React.FC = () => {
  const { settings } = useSiteSettings();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactMutation = useMutation({
    mutationFn: (data: ContactFormData) => contactApi.submit(data),
    onSuccess: () => {
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  const socialLinks = [
    {
      name: 'GitHub',
      href: settings.githubUrl,
      icon: Github,
      color: 'hover:text-gray-900 dark:hover:text-white',
    },
    {
      name: 'LinkedIn',
      href: settings.linkedinUrl,
      icon: Linkedin,
      color: 'hover:text-blue-600',
    },
    {
      name: 'Twitter',
      href: settings.twitterUrl,
      icon: Twitter,
      color: 'hover:text-blue-400',
    },
  ].filter(link => link.href && link.href !== '');

  return (
    <>
      <SEO 
        title="Contact"
        description="Get in touch with me for web development projects, collaborations, or any questions. I'm available for freelance work and full-time opportunities."
        keywords="contact, web developer, hire developer, freelance, collaboration, web development services"
      />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Work Together
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Have a project in mind or want to discuss opportunities? 
                I'd love to hear from you. Let's create something amazing together.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Get In Touch
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-8">
                    I'm currently available for freelance work and new opportunities. 
                    Whether you have a project in mind, want to collaborate, or just 
                    want to say hello, feel free to reach out!
                  </p>
                </div>

                {/* Contact Information */}
                <div className="space-y-6">
                  <InfoCard
                    text={settings.ownerEmail}
                    label="EMAIL"
                    icon={<Mail className="w-5 h-5" />}
                    delay={0.3}
                  />
                  
                  <InfoCard
                    text={settings.ownerPhone}
                    label="PHONE"
                    icon={<Phone className="w-5 h-5" />}
                    delay={0.5}
                  />
                  
                  <InfoCard
                    text={settings.ownerLocation}
                    label="LOCATION"
                    icon={<MapPin className="w-5 h-5" />}
                    delay={0.7}
                  />
                </div>

                {/* Social Links */}
                <div className="pt-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Follow Me
                  </h3>
                  <div className="flex space-x-4">
                    {socialLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <motion.a
                          key={link.name}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 ${link.color} transition-colors`}
                          aria-label={link.name}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.a>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Thank you for reaching out. I'll get back to you as soon as possible.
                      </p>
                      <Button onClick={() => setIsSubmitted(false)}>
                        Send Another Message
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                          Send Me a Message
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
placeholder={settings.ownerName}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
placeholder={settings.ownerEmail}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                          placeholder="Project Discussion"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors resize-none"
                          placeholder="Tell me about your project or what you'd like to discuss..."
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          * Required fields
                        </p>
                        <button
                          type="submit"
                          disabled={contactMutation.isPending}
                          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                          {contactMutation.isPending ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-5 h-5" />
                              Send Message
                            </>
                          )}
                        </button>
                      </div>

                      {contactMutation.isError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-red-600 dark:text-red-400 text-sm">
                            Sorry, there was an error sending your message. Please try again or contact me directly.
                          </p>
                        </div>
                      )}
                    </form>
                  )}
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Contact;

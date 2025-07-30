import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download, Github, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { projectsApi, blogApi } from '../services/portfolioApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import SEO from '../components/SEO';
import BinaryText from '../components/ui/BinaryText';
import { Project, BlogPost, parseTechnologies } from '../types/api';

const Home: React.FC = () => {
  const { data: featuredProjects, isLoading: projectsLoading } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: () => projectsApi.getFeatured().then(res => res.data),
  });

  const { data: featuredPosts, isLoading: postsLoading } = useQuery({
    queryKey: ['blog', 'featured'],
    queryFn: () => blogApi.getFeatured().then(res => res.data),
  });

  return (
    <>
      <SEO 
        title="Home"
        description="Full-stack developer specializing in React, Node.js, and modern web technologies. View my portfolio, projects, and blog posts about web development."
        keywords="full stack developer, react developer, web developer, javascript, typescript, node.js, portfolio"
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                Hi, I'm a Developer
              </h1>
              
              {/* Personal Info with BinaryText */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BinaryText 
                  text="Abdullah Hassan" 
                  label="NAME" 
                  delay={0.3}
                />
                <BinaryText 
                  text="+1 (555) 123-4567" 
                  label="PHONE" 
                  delay={0.5}
                />
                <BinaryText 
                  text="developer@example.com" 
                  label="EMAIL" 
                  delay={0.7}
                />
                <BinaryText 
                  text="San Francisco, CA" 
                  label="LOCATION" 
                  delay={0.9}
                />
              </div>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Full-stack developer passionate about creating beautiful, functional, 
                and user-friendly web applications using modern technologies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button>
                  <Link to="/projects" className="flex items-center gap-2">
                    View My Work
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <motion.a
                  href="/resume.pdf"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-secondary flex items-center gap-2 text-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </motion.a>
              </div>
              <div className="flex gap-4">
                <motion.a
                  href="https://github.com/yourusername"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/yourusername"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-primary-100 dark:hover:bg-primary-900/20 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-6 h-6" />
                </motion.a>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center"
            >
              <div className="relative">
                <div className="w-80 h-80 bg-gradient-to-br from-primary-400 to-indigo-500 rounded-full flex items-center justify-center text-white text-6xl font-bold">
                  YN
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl"
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Here are some of my recent projects that showcase my skills and passion for development.
            </p>
          </motion.div>

          {projectsLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects?.slice(0, 3).map((project: Project, index: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <div className="space-y-4">
                      {project.image_url && (
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {project.short_description || project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {parseTechnologies(project.technologies).slice(0, 3).map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <Github className="w-5 h-5" />
                          </a>
                        )}
                        {project.live_url && (
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <ArrowRight className="w-5 h-5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button>
              <Link to="/projects" className="flex items-center gap-2">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="section-padding bg-gray-100 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Blog Posts
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Thoughts, tutorials, and insights about web development and technology.
            </p>
          </motion.div>

          {postsLoading ? (
            <LoadingSpinner size="lg" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts?.slice(0, 2).map((post: BlogPost, index: number) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <div className="space-y-4">
                      {post.featured_image && (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        {post.reading_time && <span>{post.reading_time} min read</span>}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button>
              <Link to="/blog" className="flex items-center gap-2">
                Read More Posts
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Home;

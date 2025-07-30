import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Globe, Github, ExternalLink, User, Code, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../services/portfolioApi';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { parseTechnologies } from '../types/api';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The project you're looking for doesn't exist.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const technologies = parseTechnologies(project.data.technologies);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen section-padding"
    >
      <div className="max-w-6xl mx-auto">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(project.data.created_at)}
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Abdullah
                  </div>
                  {project.data.featured && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.data.title}
                </h1>

                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {project.data.short_description || project.data.description}
                </p>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                  {project.data.live_url && (
                    <Button>
                      <a
                        href={project.data.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                  {project.data.github_url && (
                    <Button variant="secondary">
                      <a
                        href={project.data.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Github className="w-4 h-4" />
                        Source Code
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Project Image */}
            {project.data.image_url && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="overflow-hidden">
                  <img
                    src={project.data.image_url}
                    alt={project.data.title}
                    className="w-full h-auto"
                  />
                </Card>
              </motion.div>
            )}

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  About This Project
                </h2>
                <div 
                  className="prose prose-lg max-w-none dark:prose-invert
                    prose-headings:text-gray-900 dark:prose-headings:text-white
                    prose-p:text-gray-700 dark:prose-p:text-gray-300
                    prose-a:text-primary-600 dark:prose-a:text-primary-400
                    prose-strong:text-gray-900 dark:prose-strong:text-white
                    prose-code:text-primary-600 dark:prose-code:text-primary-400"
                  dangerouslySetInnerHTML={{ __html: project.data.description }}
                />
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Technologies */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      className="px-3 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full border border-primary-200 dark:border-primary-800"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Project Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Project Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded text-sm">
                      Completed
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Created</span>
                    <span className="text-gray-900 dark:text-white">
                      {formatDate(project.data.created_at)}
                    </span>
                  </div>
                  {project.data.featured && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Featured</span>
                      <span className="text-yellow-600 dark:text-yellow-400">
                        ⭐ Yes
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  {project.data.live_url && (
                    <a
                      href={project.data.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600">
                        View Live Site
                      </span>
                    </a>
                  )}
                  {project.data.github_url && (
                    <a
                      href={project.data.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors group"
                    >
                      <Github className="w-4 h-4 text-gray-500 group-hover:text-primary-600" />
                      <span className="text-gray-700 dark:text-gray-300 group-hover:text-primary-600">
                        View Source
                      </span>
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Related Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Other Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Related projects will be populated here */}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;

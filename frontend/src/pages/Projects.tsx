import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { projectsApi } from '../services/portfolioApi';
import SEO from '../components/SEO';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Pagination from '../components/ui/Pagination';
import { usePagination } from '../hooks/usePagination';
import { scrollToTop } from '../utils/scroll';
import { ArrowRight, Github, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Project } from '../types/api';

const Projects: React.FC = () => {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', 'all'],
    queryFn: () => projectsApi.getAll().then(res => res.data),
  });

  const {
    currentPage,
    totalPages,
    paginatedData: paginatedProjects,
    setCurrentPage,
  } = usePagination({
    data: projects || [],
    itemsPerPage: 10,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToTop();
  };

  return (
    <>
      <SEO 
        title="Projects"
        description="Explore my projects showcasing various web development skills and technologies. From frontend to backend, see how I bring ideas to life."
        keywords="projects, web development, frontend, backend, full stack, portfolio"
      />
      <div className="min-h-screen">
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                My Projects
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Discover my diverse range of projects that demonstrate my ability to tackle complex problems and deliver creative solutions.
              </p>
            </motion.div>

            {isLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {paginatedProjects.map((project: Project, index: number) => (
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
                          {project.technologies.split(',').map((tech: string) => (
                            <span
                              key={tech}
                              className="px-3 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Link to={`/projects/${project.id}`}>
                            <Button className="w-full flex items-center justify-center gap-2">
                              <Eye className="w-4 h-4" />
                              View Details
                            </Button>
                          </Link>
                          <div className="flex gap-3 justify-center">
                            {project.github_url && (
                              <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                title="View Source Code"
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
                                title="View Live Demo"
                              >
                                <ArrowRight className="w-5 h-5" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-12"
                  >
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
                
                {/* Results Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="text-center mt-8 text-gray-600 dark:text-gray-400"
                >
                  Showing {Math.min((currentPage - 1) * 10 + 1, projects?.length || 0)} - {Math.min(currentPage * 10, projects?.length || 0)} of {projects?.length || 0} projects
                </motion.div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default Projects;


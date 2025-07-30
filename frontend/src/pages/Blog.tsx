import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { blogApi } from '../services/portfolioApi';
import SEO from '../components/SEO';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import { Search, Calendar, Clock, Tag, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types/api';

const Blog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog', 'published'],
    queryFn: () => blogApi.getPublished().then(res => res.data),
  });

  // Get unique categories from posts (removed category feature)
  const categories = ['all'];

  // Filter posts based on search
  const filteredPosts = posts?.filter((post: BlogPost) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO 
        title="Blog"
        description="Read my latest thoughts and tutorials on web development, programming, and technology. Stay updated with industry trends and best practices."
        keywords="blog, web development, programming, tutorials, technology, software engineering"
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
                Blog
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Thoughts, tutorials, and insights about web development, technology, and the ever-evolving world of software engineering.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="section-padding">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 mb-12"
            >
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Blog Posts */}
            {isLoading ? (
              <LoadingSpinner size="lg" className="py-12" />
            ) : (
              <div className="space-y-8">
                {filteredPosts?.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      No posts found matching your criteria.
                    </p>
                  </motion.div>
                ) : (
                  filteredPosts?.map((post: BlogPost, index: number) => (
                    <motion.article
                      key={post.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="md:flex">
                          {/* Featured Image */}
                          {post.featured_image && (
                            <div className="md:w-1/3">
                              <img
                                src={post.featured_image}
                                alt={post.title}
                                className="h-48 md:h-full w-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Content */}
                          <div className={`p-6 ${post.featured_image ? 'md:w-2/3' : 'w-full'}`}>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.created_at)}
                              </div>
                              {post.reading_time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {post.reading_time} min read
                                </div>
                              )}
                            </div>
                            
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                              <Link to={`/blog/${post.slug}`}>
                                {post.title}
                              </Link>
                            </h2>
                            
                            {post.excerpt && (
                              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                            
                            {/* Tags */}
                            {post.tags && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {post.tags.split(',').slice(0, 5).map((tag, tagIndex) => (
                                  <span
                                    key={tagIndex}
                                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                                  >
                                    #{tag.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                By Your Name
                              </div>
                              <Button variant="secondary" size="sm">
                                <Link to={`/blog/${post.slug}`} className="flex items-center gap-2">
                                  Read More
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.article>
                  ))
                )}
              </div>
            )}

            {/* Newsletter Signup */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 bg-gradient-to-r from-primary-600 to-indigo-600 rounded-2xl p-8 text-center text-white"
            >
              <h3 className="text-2xl font-bold mb-4">
                Stay Updated
              </h3>
              <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
                Subscribe to get notified about new blog posts, tutorials, and insights about web development and technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                <Button className="bg-white text-primary-600 hover:bg-gray-100">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-primary-200 mt-4">
                No spam, unsubscribe at any time.
              </p>
            </motion.section>
          </div>
        </section>
      </div>
    </>
  );
};

export default Blog;

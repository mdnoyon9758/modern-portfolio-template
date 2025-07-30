import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { blogApi } from '../services/portfolioApi';
import Card from '../components/ui/Card';

const BlogDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => blogApi.getBySlug(slug!),
    enabled: !!slug,
  });

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
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

  if (error || !post) {
    return (
      <div className="min-h-screen section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen section-padding"
    >
      <div className="max-w-4xl mx-auto">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        <Card className="p-8 md:p-12">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.data.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.data.published_at || post.data.created_at}>
                  {formatDate(post.data.published_at || post.data.created_at)}
                </time>
              </div>
              
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
            </div>
          </header>

          {post.data.featured_image && (
            <div className="mb-8 -mx-8 md:-mx-12">
              <img
                src={post.data.featured_image}
                alt={post.data.title}
                className="w-full h-auto"
              />
            </div>
          )}

          <div 
            className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-primary-600 dark:prose-a:text-primary-400
              prose-strong:text-gray-900 dark:prose-strong:text-white
              prose-code:text-primary-600 dark:prose-code:text-primary-400
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800
              prose-blockquote:border-primary-600 dark:prose-blockquote:border-primary-400"
            dangerouslySetInnerHTML={{ __html: post.data.content }}
          />
        </Card>

        {/* Related Posts Section (optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            More Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add related posts here if needed */}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BlogDetail;

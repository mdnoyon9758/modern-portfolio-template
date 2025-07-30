import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../../services/portfolioApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Save, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogPost } from '../../types/api';

interface BlogFormData {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  tags: string;
  featured_image: string;
  published: boolean;
  featured: boolean;
  reading_time: number;
}

const BlogForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    tags: '',
    featured_image: '',
    published: false,
    featured: false,
    reading_time: 5,
  });

  const [errors, setErrors] = useState<Partial<BlogFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => 
      blogApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      navigate('/admin/blog');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPost> }) =>
      blogApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      navigate('/admin/blog');
    },
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  // Auto-calculate reading time
  useEffect(() => {
    if (formData.content) {
      const wordCount = formData.content.split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
      setFormData(prev => ({ ...prev, reading_time: readingTime }));
    }
  }, [formData.content]);

  const validateForm = (): boolean => {
    const newErrors: Partial<BlogFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.featured_image && !isValidUrl(formData.featured_image)) {
      newErrors.featured_image = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const blogData = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        tags: formData.tags,
        featured_image: formData.featured_image,
        published: formData.published,
        featured: formData.featured,
        reading_time: formData.reading_time,
        published_at: formData.published ? new Date().toISOString() : undefined,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id: parseInt(id), data: blogData });
      } else {
        await createMutation.mutateAsync(blogData);
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof BlogFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              onClick={() => navigate('/admin/blog')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
            </h1>
          </div>
          
          <Button
            variant="secondary"
            onClick={() => setPreview(!preview)}
            className="flex items-center gap-2"
          >
            {preview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {preview ? 'Edit' : 'Preview'}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {!preview ? (
                <>
                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Basic Information
                    </h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Post Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                            errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          placeholder="Enter blog post title"
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL Slug *
                        </label>
                        <input
                          type="text"
                          id="slug"
                          name="slug"
                          value={formData.slug}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                            errors.slug ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                          placeholder="url-friendly-slug"
                        />
                        {errors.slug && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          URL: /blog/{formData.slug}
                        </p>
                      </div>

                      <div>
                        <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Excerpt
                        </label>
                        <textarea
                          id="excerpt"
                          name="excerpt"
                          rows={3}
                          value={formData.excerpt}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Brief description for blog listing"
                        />
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Content
                    </h2>
                    
                    <div>
                      <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Blog Content *
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        rows={20}
                        value={formData.content}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                          errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono`}
                        placeholder="Write your blog content here... (Markdown supported)"
                      />
                      {errors.content && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Estimated reading time: {formData.reading_time} min
                      </p>
                    </div>
                  </Card>
                </>
              ) : (
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Preview
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <h1>{formData.title}</h1>
                    {formData.excerpt && <p className="lead">{formData.excerpt}</p>}
                    <div className="whitespace-pre-wrap">{formData.content}</div>
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="published"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Published
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured Post
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Media & Tags
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Featured Image URL
                    </label>
                    <input
                      type="url"
                      id="featured_image"
                      name="featured_image"
                      value={formData.featured_image}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.featured_image ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="https://example.com/image.jpg"
                    />
                    {errors.featured_image && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.featured_image}</p>
                    )}
                  </div>

                  {formData.featured_image && (
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Preview:</p>
                      <img
                        src={formData.featured_image}
                        alt="Featured preview"
                        className="w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="react, javascript, tutorial"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Separate tags with commas
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/admin/blog')}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogForm;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../../services/portfolioApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FileUploadInput from '../../components/ui/FileUploadInput';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../../types/api';

interface ProjectFormData {
  title: string;
  description: string;
  short_description: string;
  technologies: string;
  github_url: string;
  live_url: string;
  image_url: string;
  featured: boolean;
  status: 'active' | 'completed' | 'archived';
  display_order: number;
}

const ProjectForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    short_description: '',
    technologies: '',
    github_url: '',
    live_url: '',
    image_url: '',
    featured: false,
    status: 'active',
    display_order: 1,
  });

  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load project data if editing
  useEffect(() => {
    if (isEditing && id) {
      // In a real app, you'd fetch the project by ID
      // For now, we'll use placeholder data
    }
  }, [isEditing, id]);

  const createMutation = useMutation({
    mutationFn: (data: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => 
      projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Project> }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      navigate('/admin/projects');
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.technologies.trim()) {
      newErrors.technologies = 'Technologies are required';
    }

    if (formData.github_url && !isValidUrl(formData.github_url)) {
      newErrors.github_url = 'Please enter a valid URL';
    }

    if (formData.live_url && !isValidUrl(formData.live_url)) {
      newErrors.live_url = 'Please enter a valid URL';
    }

    if (formData.image_url && !isValidUrl(formData.image_url)) {
      newErrors.image_url = 'Please enter a valid URL';
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
      const projectData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        technologies: formData.technologies,
        github_url: formData.github_url,
        live_url: formData.live_url,
        image_url: formData.image_url,
        featured: formData.featured,
        order_index: formData.display_order,
      };

      if (isEditing && id) {
        await updateMutation.mutateAsync({ id: parseInt(id), data: projectData });
      } else {
        await createMutation.mutateAsync(projectData);
      }
    } catch (error) {
      console.error('Error saving project:', error);
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
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="secondary"
            onClick={() => navigate('/admin/projects')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Project' : 'Create New Project'}
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Title *
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
                      placeholder="Enter project title"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Short Description
                    </label>
                    <input
                      type="text"
                      id="short_description"
                      name="short_description"
                      value={formData.short_description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Brief one-line description"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      value={formData.description}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="Detailed project description"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Technologies *
                    </label>
                    <input
                      type="text"
                      id="technologies"
                      name="technologies"
                      value={formData.technologies}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.technologies ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="React, Node.js, MongoDB (comma-separated)"
                    />
                    {errors.technologies && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.technologies}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Separate technologies with commas
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Links & Media
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      id="github_url"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.github_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="https://github.com/username/project"
                    />
                    {errors.github_url && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.github_url}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="live_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      id="live_url"
                      name="live_url"
                      value={formData.live_url}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white ${
                        errors.live_url ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
                      placeholder="https://yourproject.com"
                    />
                    {errors.live_url && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.live_url}</p>
                    )}
                  </div>

                  <FileUploadInput
                    label="Project Image"
                    value={formData.image_url}
                    onChange={(value) => {
                      setFormData(prev => ({ ...prev, image_url: value }));
                      // Clear error when user updates the image
                      if (errors.image_url) {
                        setErrors(prev => ({ ...prev, image_url: undefined }));
                      }
                    }}
                    accept="image/*"
                    placeholder="Enter image URL or upload image"
                    description="Upload project screenshot or banner image"
                  />
                  {errors.image_url && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.image_url}</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Settings
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      id="display_order"
                      name="display_order"
                      min="1"
                      value={formData.display_order}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
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
                      Featured Project
                    </label>
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
                    {isSubmitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate('/admin/projects')}
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

export default ProjectForm;

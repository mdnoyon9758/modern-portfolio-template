import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { blogApi } from '../../services/portfolioApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Edit, Plus } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { BlogPost } from '../../types/api';

const BlogManagement: React.FC = () => {
  const navigate = useNavigate();
  const { data: posts, isLoading } = useQuery({
    queryKey: ['admin', 'blog'],
    queryFn: () => blogApi.getAll().then(res => res.data),
  });

  const handleEdit = (id: number) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
          <Button onClick={() => navigate('/admin/blog/new')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Post
          </Button>
        </div>

        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <div className="space-y-6">
            {posts?.map((post: BlogPost) => (
              <Card key={post.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => handleEdit(post.id)}>
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManagement;


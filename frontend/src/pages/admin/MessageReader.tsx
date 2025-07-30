import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactApi } from '../../services/portfolioApi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ArrowLeft, User, Mail, Calendar, Trash2 } from 'lucide-react';

const MessageReader: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: message, isLoading, error } = useQuery({
    queryKey: ['message', id],
    queryFn: () => contactApi.getById(parseInt(id!)).then(res => res.data),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
      window.history.back();
    },
  });

  const handleDelete = () => {
    if (message && window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(message.id);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !message) return <div>Error loading message.</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/admin/messages" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Messages
          </Link>
        </div>
        <Card className="overflow-hidden">
          <div className="p-6 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{message.subject}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{message.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${message.email}`} className="hover:underline">{message.email}</a>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(message.created_at).toLocaleString()}</span>
                </div>
            </div>
          </div>
          <div className="p-6 text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
            {message.message}
          </div>
          <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <Button 
              variant="danger" 
              onClick={handleDelete} 
              disabled={deleteMutation.isPending}
              icon={<Trash2 className="w-4 h-4" />}>
                Delete
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MessageReader;

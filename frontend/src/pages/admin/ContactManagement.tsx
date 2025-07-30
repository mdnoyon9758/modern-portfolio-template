import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { contactApi } from '../../services/portfolioApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ContactMessage } from '../../types/api';

const ContactManagement: React.FC = () => {
  const navigate = useNavigate();
  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: () => contactApi.getAll().then((res: any) => res.data),
  });

  return (
    <div className="min-h-screen section-padding">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Contact Messages
        </h1>

        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <div className="space-y-6">
            {messages?.map((message: ContactMessage) => (
              <Card key={message.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {message.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {message.email}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      {new Date(message.created_at).toLocaleDateString()} - {message.subject}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate(`/admin/messages/read/${message.id}`)}
                  >
                    View
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

export default ContactManagement;


import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { contactApi } from '../../services/portfolioApi';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { ContactMessage } from '../../types/api';
import { Mail, Search, Calendar, User, MessageSquare, Archive, Trash2, Eye } from 'lucide-react';

const ContactManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin', 'messages'],
    queryFn: () => contactApi.getAll().then((res: any) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contactApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'messages'] });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(id);
    }
  };

  const filteredMessages = messages
    ?.filter((message: ContactMessage) => {
      if (filter === 'all') return true;
      if (filter === 'read') return message.read;
      if (filter === 'unread') return !message.read;
      return true;
    })
    .filter((message: ContactMessage) => 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage incoming messages from your contact form.</p>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="flex-shrink-0">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="read">Read</option>
              </select>
            </div>
          </div>
        </Card>

        {isLoading ? (
          <LoadingSpinner size="lg" className="py-12" />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredMessages?.map((message: ContactMessage, index: number) => (
                <motion.li
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 ${!message.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex-grow cursor-pointer" onClick={() => navigate(`/admin/messages/read/${message.id}`)}>
                      <div className="flex items-center gap-3">
                        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
                          {message.name}
                        </h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${!message.read ? 'bg-blue-200 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {!message.read ? 'Unread' : 'Read'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {message.subject}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/admin/messages/read/${message.id}`)}
                        title="View Message">
                          <Eye className="w-4 h-4 mr-1.5" />
                          View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(message.id)}
                        disabled={deleteMutation.isPending}
                        title="Delete Message">
                          <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </motion.li>
              ))}
              {filteredMessages?.length === 0 && (
                <div className="p-8 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No Messages Found</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your inbox is clear.</p>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactManagement;


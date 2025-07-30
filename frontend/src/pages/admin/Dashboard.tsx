import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  FolderOpen, 
  Mail, 
  Settings, 
  Users,
  Plus,
  Eye,
  Edit3
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const stats = [
    {
      title: 'Total Projects',
      value: '12',
      icon: FolderOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'Blog Posts',
      value: '8',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Messages',
      value: '5',
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Page Views',
      value: '1,234',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  const quickActions = [
    {
      title: 'Add New Project',
      description: 'Create a new project entry',
      icon: Plus,
      href: '/admin/projects/new',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Write Blog Post',
      description: 'Create a new blog post',
      icon: Edit3,
      href: '/admin/blog/new',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'View Messages',
      description: 'Check contact messages',
      icon: Eye,
      href: '/admin/messages',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Site Settings',
      description: 'Manage site configuration',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-gray-600 hover:bg-gray-700',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Welcome back, {user}!
              </p>
            </div>
            <button 
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.title}
                  to={action.href}
                  className="block"
                >
                  <Card hover className="p-6 h-full">
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 rounded-lg ${action.color} text-white mb-4`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {action.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <Card className="p-6">
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No recent activity
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Activity will appear here as you manage your portfolio content.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

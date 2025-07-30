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
  Edit3,
  List,
  MessageSquare,
  PenTool,
  Briefcase,
  Archive,
  Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back, {user}!</p>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Blog Management */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <PenTool className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Blog</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your blog posts, including creating, editing, and deleting articles.</p>
              <div className="space-y-3">
                <Link to="/admin/blog/new" className="block">
                  <Button fullWidth variant="secondary" icon={<Plus className="w-4 h-4" />}>Create Post</Button>
                </Link>
                <Link to="/admin/blog" className="block">
                  <Button fullWidth variant="outline" icon={<List className="w-4 h-4" />}>Manage Posts</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Project Management */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your portfolio projects, including creating, editing, and deleting entries.</p>
              <div className="space-y-3">
                <Link to="/admin/projects/new" className="block">
                  <Button fullWidth variant="secondary" icon={<Plus className="w-4 h-4" />}>Create Project</Button>
                </Link>
                <Link to="/admin/projects" className="block">
                  <Button fullWidth variant="outline" icon={<List className="w-4 h-4" />}>Manage Projects</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Messages Management */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">View and manage incoming contact messages from your users.</p>
              <div className="space-y-3">
                <Link to="/admin/messages" className="block">
                  <Button fullWidth variant="outline" icon={<Eye className="w-4 h-4" />}>View Messages</Button>
                </Link>
              </div>
            </div>
          </Card>

          {/* Site Settings */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700/20">
                  <Settings className="w-6 h-6 text-gray-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Manage your site-wide settings and configurations.</p>
              <div className="space-y-3">
                <Link to="/admin/settings" className="block">
                  <Button fullWidth variant="outline" icon={<Edit3 className="w-4 h-4" />}>Edit Settings</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

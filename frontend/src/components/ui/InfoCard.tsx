import React from 'react';
import { motion } from 'framer-motion';

interface InfoCardProps {
  text: string;
  label: string;
  className?: string;
  delay?: number;
  icon?: React.ReactNode;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  text, 
  label, 
  className = '', 
  delay = 0,
  icon
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative group ${className}`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <div className="text-primary-600 dark:text-primary-400">
                {icon}
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {label}
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white break-all">
              {text}
            </div>
          </div>
        </div>
        
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default InfoCard;

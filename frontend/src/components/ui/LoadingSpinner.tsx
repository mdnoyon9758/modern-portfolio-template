import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  color?: 'primary' | 'secondary' | 'white';
}

/**
 * Enhanced loading spinner component with multiple variants and animations
 * Provides better visual feedback during loading states
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  variant = 'spinner',
  color = 'primary'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const barHeights = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
    xl: 'h-8',
  };

  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'border-t-primary-600';
      case 'secondary': return 'border-t-gray-600';
      case 'white': return 'border-t-white';
      default: return 'border-t-primary-600';
    }
  };

  const getBgColorClass = () => {
    switch (color) {
      case 'primary': return 'bg-primary-600';
      case 'secondary': return 'bg-gray-600';
      case 'white': return 'bg-white';
      default: return 'bg-primary-600';
    }
  };

  if (variant === 'dots') {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`${dotSizes[size]} ${getBgColorClass()} rounded-full`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <motion.div
          className={`${sizeClasses[size]} ${getBgColorClass()} rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
      </div>
    );
  }

  if (variant === 'bars') {
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div className="flex space-x-1 items-end">
          {[0, 1, 2, 3].map((index) => (
            <motion.div
              key={index}
              className={`w-1 ${barHeights[size]} ${getBgColorClass()} rounded-sm`}
              animate={{
                scaleY: [1, 2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.1,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  // Default spinner variant
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary-200 ${getColorClass()} rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;

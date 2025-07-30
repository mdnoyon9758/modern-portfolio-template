import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onAnimationEnd' | 'onAnimationIteration' | 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'gradient';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = `
    inline-flex items-center justify-center rounded-xl font-semibold 
    transition-all duration-300 ease-out focus:outline-none focus:ring-2 
    focus:ring-offset-2 transform-gpu relative overflow-hidden
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    ${fullWidth ? 'w-full' : ''}
  `;
  
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-700 
      hover:from-primary-700 hover:to-primary-800 
      text-white shadow-lg hover:shadow-xl 
      focus:ring-primary-500 border border-transparent
      active:scale-95
    `,
    secondary: `
      bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700
      hover:border-primary-300 dark:hover:border-primary-600
      text-gray-900 dark:text-white shadow-md hover:shadow-lg
      focus:ring-primary-500 active:scale-95
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 
      hover:from-red-700 hover:to-red-800 
      text-white shadow-lg hover:shadow-xl 
      focus:ring-red-500 border border-transparent
      active:scale-95
    `,
    ghost: `
      bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-300 
      focus:ring-gray-500 border border-transparent
      active:scale-95
    `,
    outline: `
      bg-transparent border-2 border-primary-600 
      hover:bg-primary-50 dark:hover:bg-primary-900/20
      text-primary-600 dark:text-primary-400
      focus:ring-primary-500 active:scale-95
    `,
    gradient: `
      bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600
      hover:from-purple-700 hover:via-pink-700 hover:to-blue-700
      text-white shadow-lg hover:shadow-xl
      focus:ring-purple-500 border border-transparent
      active:scale-95
    `
  };
  
  const sizes = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  };

  const isDisabled = disabled || loading;
  
  return (
    <motion.button
      whileHover={!isDisabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        opacity: { duration: 0.3 },
        y: { duration: 0.3 }
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-shimmer" />
      
      {loading && (
        <Loader2 className={`animate-spin ${iconSizes[size]} mr-2`} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={`${iconSizes[size]} mr-2`}>
          {icon}
        </span>
      )}
      
      <span className={loading ? 'opacity-70' : ''}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={`${iconSizes[size]} ml-2`}>
          {icon}
        </span>
      )}
    </motion.button>
  );
};

export default Button;

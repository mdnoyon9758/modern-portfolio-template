import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

interface AnimatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  variant?: 'default' | 'floating' | 'filled';
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
}

/**
 * Enhanced input component with smooth animations and validation states
 * Includes floating labels, icons, and visual feedback
 */
const AnimatedInput: React.FC<AnimatedInputProps> = ({
  label,
  error,
  success,
  hint,
  variant = 'default',
  icon,
  showPasswordToggle = false,
  type = 'text',
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const getInputClasses = () => {
    const baseClasses = `
      w-full px-4 py-3 text-base transition-all duration-300 ease-out
      bg-white dark:bg-gray-800 border rounded-xl
      focus:outline-none focus:ring-2 focus:ring-offset-1
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const variantClasses = {
      default: 'border-gray-300 dark:border-gray-600',
      floating: 'border-gray-300 dark:border-gray-600 pt-6 pb-2',
      filled: 'bg-gray-100 dark:bg-gray-700 border-transparent'
    };

    const stateClasses = error
      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
      : success
      ? 'border-green-500 focus:ring-green-500 focus:border-green-500'
      : 'focus:ring-primary-500 focus:border-primary-500';

    return `${baseClasses} ${variantClasses[variant]} ${stateClasses} ${className}`;
  };

  const getLabelClasses = () => {
    if (variant === 'floating') {
      return `
        absolute left-4 transition-all duration-300 ease-out pointer-events-none
        ${isFocused || hasValue || props.value
          ? 'top-2 text-xs text-primary-600 dark:text-primary-400'
          : 'top-3.5 text-base text-gray-500 dark:text-gray-400'
        }
      `;
    }
    return 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {label && variant !== 'floating' && (
        <label className={getLabelClasses()}>
          {label}
        </label>
      )}

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}

        <input
          {...props}
          type={inputType}
          className={`${getInputClasses()} ${icon ? 'pl-10' : ''} ${
            showPasswordToggle || error || success ? 'pr-10' : ''
          }`}
          onFocus={(e) => {
            setIsFocused(true);
            if (props.onFocus) props.onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (props.onBlur) props.onBlur(e);
          }}
          onChange={handleInputChange}
        />

        {variant === 'floating' && label && (
          <label className={getLabelClasses()}>
            {label}
          </label>
        )}

        {/* Right side icons */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {error && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-red-500"
            >
              <AlertCircle size={18} />
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-green-500"
            >
              <CheckCircle2 size={18} />
            </motion.div>
          )}

          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* Focus indicator */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-primary-600"
          initial={{ width: 0 }}
          animate={{ width: isFocused ? '100%' : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Helper text */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: error || success || hint ? 1 : 0,
          height: error || success || hint ? 'auto' : 0
        }}
        transition={{ duration: 0.2 }}
        className="mt-2"
      >
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {error}
          </p>
        )}
        {success && !error && (
          <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
            <CheckCircle2 size={14} className="mr-1" />
            {success}
          </p>
        )}
        {hint && !error && !success && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hint}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AnimatedInput;

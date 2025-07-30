import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  hover?: boolean;
}

/**
 * Enhanced animated card component with various entrance animations
 * Supports multiple directions and hover effects for better UX
 */
const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  hover = true
}) => {
  const directionVariants = {
    up: { y: 50, opacity: 0 },
    down: { y: -50, opacity: 0 },
    left: { x: 50, opacity: 0 },
    right: { x: -50, opacity: 0 }
  };

  const hoverVariants = hover ? {
    scale: 1.03,
    y: -5,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  } : {};

  return (
    <motion.div
      initial={directionVariants[direction]}
      animate={{ x: 0, y: 0, opacity: 1 }}
      whileHover={hoverVariants}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;

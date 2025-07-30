import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BinaryTextProps {
  text: string;
  label: string;
  className?: string;
  delay?: number;
}

const BinaryText: React.FC<BinaryTextProps> = ({ text, label, className = '', delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [displayText, setDisplayText] = useState('');

  // Convert text to simplified binary (same character count)
  const textToBinary = (str: string): string => {
    return str
      .split('')
      .map(char => {
        // Use random binary digits but maintain same character count
        if (char === ' ') return ' '; // Keep spaces as spaces
        return Math.random() > 0.5 ? '1' : '0';
      })
      .join('');
  };

  // Decode binary to text with animation
  const animateDecoding = React.useCallback(() => {
    if (!isHovered) return;
    
    const targetText = text;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setDisplayText(targetText.substring(0, currentIndex) + 
          (currentIndex < targetText.length ? '█' : ''));
        currentIndex++;
      } else {
        clearInterval(interval);
        setDisplayText(targetText);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isHovered, text]);

  useEffect(() => {
    if (isHovered) {
      animateDecoding();
    } else {
      setDisplayText(textToBinary(text));
    }
  }, [isHovered, text, animateDecoding]);

  useEffect(() => {
    // Initialize with binary
    setDisplayText(textToBinary(text));
  }, [text]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay }}
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-mono">
          {label}
        </div>
        <div className="relative overflow-hidden">
          <motion.div
            className={`font-mono text-sm transition-all duration-300 ${
              isHovered 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
            style={{
              fontFamily: 'Courier New, monospace',
              letterSpacing: isHovered ? '0.05em' : '0.02em',
              lineHeight: '1.4',
              wordBreak: 'break-all'
            }}
          >
            {displayText}
          </motion.div>
          
          {/* Glitch effect overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-500/10 to-transparent animate-pulse" />
          </motion.div>

          {/* Cursor effect */}
          {isHovered && (
            <motion.div
              className="absolute right-0 top-0 w-2 h-5 bg-primary-500"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ 
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.2 }}
          className="absolute z-10 bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg shadow-lg pointer-events-none"
        >
          Binary representation of: <strong>{text}</strong>
          <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 dark:bg-gray-100 transform rotate-45" />
        </motion.div>
      </div>

      {/* Matrix-style falling characters background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xs text-primary-500 font-mono"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
            }}
            animate={{
              y: ['0%', '400%'],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default BinaryText;

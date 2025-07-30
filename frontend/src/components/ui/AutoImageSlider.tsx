import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mediaApi } from '../../services/portfolioApi';

interface AutoImageSliderProps {
  autoplay?: boolean;
  interval?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  fallbackImages?: string[]; // Fallback images if no images are found on the server
}

const AutoImageSlider: React.FC<AutoImageSliderProps> = ({
  autoplay = true,
  interval = 5000,
  showDots = true,
  showArrows = true,
  className = '',
  fallbackImages = ['/logo192.png', '/logo512.png'] // Default fallback images
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all images from the media API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        const response = await mediaApi.getAllImages();
        const fetchedImages = response.data;
        
        // If no images found, use fallback images
        if (fetchedImages.length === 0) {
          setImages(fallbackImages);
        } else {
          setImages(fetchedImages);
        }
      } catch (error) {
        console.warn('Failed to fetch images from media API, using fallback images:', error);
        setImages(fallbackImages);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, [fallbackImages]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPlaying || images.length <= 1 || isLoading) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPlaying, images.length, interval, isLoading]);

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  const goToNext = () => {
    setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Pause autoplay on hover
  const handleMouseEnter = () => {
    if (autoplay) setIsPlaying(false);
  };

  const handleMouseLeave = () => {
    if (autoplay) setIsPlaying(true);
  };

  if (isLoading) {
    return (
      <div className={`relative w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-2 text-gray-500 dark:text-gray-400">Loading images...</span>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className={`relative w-full h-full bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center ${className}`}>
        <span className="text-gray-500 dark:text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div 
      className={`relative w-full h-full overflow-hidden rounded-lg ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Images */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Site image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            onError={(e) => {
              // If image fails to load, try to remove it from the list
              console.warn(`Failed to load image: ${images[currentIndex]}`);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm z-10"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-110'
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default AutoImageSlider;

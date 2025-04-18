import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NormalizedProjectImage } from '../services/api';

interface ProjectImageCarouselProps {
  images: NormalizedProjectImage[];
  title: string;
  category?: string;
  featured?: boolean;
  imageClassName?: string;
}

const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({
  images,
  title,
  category,
  featured,
  imageClassName = 'w-full h-full object-cover',
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Skip rendering if no images
  if (images.length === 0) {
    return null;
  }

  // Handle image navigation
  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <div className='relative overflow-hidden h-60'>
      <div className='w-full h-full'>
        <motion.img
          key={currentImageIndex}
          src={images[currentImageIndex].url}
          alt={images[currentImageIndex].alt || title}
          className={imageClassName}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-md text-white z-20'
            aria-label='Previous image'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <polyline points='15 18 9 12 15 6'></polyline>
            </svg>
          </button>
          <button
            onClick={nextImage}
            className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-md text-white z-20'
            aria-label='Next image'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <polyline points='9 18 15 12 9 6'></polyline>
            </svg>
          </button>

          {/* Image indicators */}
          <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-20'>
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImageIndex(i)}
                className={`w-2 h-2 rounded-md ${
                  i === currentImageIndex ? 'bg-white' : 'bg-white/40'
                }`}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {category && (
        <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-md z-20'>
          {category}
        </div>
      )}

      {featured && (
        <div className='absolute top-4 left-4 bg-teal-600/80 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-md z-20'>
          Featured
        </div>
      )}

      {images[currentImageIndex].caption && (
        <div className='absolute bottom-10 left-0 right-0 text-center bg-black/60 text-white text-xs py-1 px-2 z-20'>
          {images[currentImageIndex].caption}
        </div>
      )}
    </div>
  );
};

export default ProjectImageCarousel;

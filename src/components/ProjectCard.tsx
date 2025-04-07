import React from 'react';
import { motion } from 'framer-motion';

export interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
  category?: string;
  index: number;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  tags,
  demoUrl,
  sourceUrl,
  featured,
  category,
  index,
}: ProjectProps) {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
    hover: {
      y: -8,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <motion.div
      custom={index}
      initial='hidden'
      animate='visible'
      whileHover='hover'
      variants={cardVariants}
      className='bg-base-dark/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-gray-700/50 h-full flex flex-col'>
      {imageUrl && (
        <div className='relative overflow-hidden h-60'>
          <motion.img
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {category && (
            <div className='absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full'>
              {category}
            </div>
          )}
          {featured && (
            <div className='absolute top-4 left-4 bg-teal-500/80 backdrop-blur-sm text-white px-3 py-1 text-xs rounded-full'>
              Featured
            </div>
          )}
        </div>
      )}

      <div className='p-6 flex flex-col flex-grow'>
        <h3 className='text-xl font-bold mb-3 text-white'>{title}</h3>
        <p className='text-gray-300 mb-4 text-sm flex-grow'>{description}</p>

        {tags.length > 0 && (
          <motion.div
            className='flex flex-wrap gap-2 mb-4'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.2 }}>
            {tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
                className='px-2 py-1 text-xs rounded-full bg-base-dark/70 text-gray-300 backdrop-blur-sm'>
                {tag}
              </motion.span>
            ))}
          </motion.div>
        )}

        <div className='flex gap-3 mt-auto'>
          {demoUrl && (
            <motion.a
              href={demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              View Demo
            </motion.a>
          )}
          {sourceUrl && (
            <motion.a
              href={sourceUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-base-dark hover:bg-base-dark/80 rounded-lg transition-colors'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}>
              Source Code
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

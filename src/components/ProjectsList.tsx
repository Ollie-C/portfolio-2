import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import FloatingCube from './three/FloatingCube';
import FloatingSphere from './three/FloatingSphere';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';

type CategoryFilter = 'ALL' | 'REACT' | 'FULL-STACK' | 'OTHER' | 'FEATURED';

export default function ProjectsList() {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');
  const {
    data: projects,
    isLoading,
    error,
  } = useProjects(
    activeFilter === 'ALL'
      ? undefined
      : activeFilter === 'FEATURED'
        ? undefined
        : activeFilter
  );

  // If using FEATURED filter, filter the results after fetching
  const filteredProjects =
    activeFilter === 'FEATURED' && projects
      ? projects.filter((project) => project.featured)
      : projects;

  const handleFilterChange = (filter: CategoryFilter) => {
    setActiveFilter(filter);
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <motion.div
          className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-400 border-r-transparent'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}></motion.div>
        <motion.p
          className='mt-4'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}>
          Loading projects...
        </motion.p>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className='text-center py-12 text-red-400'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}>
        <p>Error loading projects. Please try again later.</p>
      </motion.div>
    );
  }

  return (
    <div className='relative'>
      {/* Decorative 3D elements */}
      <div className='absolute -top-20 -left-20 opacity-70 hidden lg:block'>
        <FloatingSphere
          size={100}
          color='#2dd4bf'
          speed={0.7}
          position={[0, 0, -1]}
        />
      </div>

      <div className='absolute -bottom-20 -right-20 opacity-70 hidden lg:block'>
        <FloatingCube
          size={120}
          color='#a855f7'
          speed={0.8}
          position={[0, 0, -1]}
        />
      </div>

      <motion.div
        className='mb-12 relative z-10'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div className='flex gap-4 flex-wrap'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'FEATURED'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
            } transition-all`}
            onClick={() => handleFilterChange('FEATURED')}>
            Featured
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'REACT'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
            } transition-all`}
            onClick={() => handleFilterChange('REACT')}>
            React
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'FULL-STACK'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
            } transition-all`}
            onClick={() => handleFilterChange('FULL-STACK')}>
            Full-stack
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'OTHER'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
            } transition-all`}
            onClick={() => handleFilterChange('OTHER')}>
            Other
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'ALL'
                ? 'bg-teal-500 text-white shadow-md'
                : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
            } transition-all`}
            onClick={() => handleFilterChange('ALL')}>
            All
          </motion.button>
        </div>
      </motion.div>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10'
        variants={containerVariants}
        initial='hidden'
        animate='visible'>
        {filteredProjects?.map((project, index) => (
          <ProjectCard
            key={project.id}
            title={project.title}
            description={project.description}
            imageUrl={project.imageUrl}
            tags={project.tags}
            demoUrl={project.demoUrl}
            sourceUrl={project.sourceUrl}
            featured={project.featured}
            category={project.category}
            index={index}
          />
        ))}
      </motion.div>
    </div>
  );
}

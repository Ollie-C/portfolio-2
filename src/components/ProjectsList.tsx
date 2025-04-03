import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';

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

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent'></div>
        <p className='mt-4'>Loading projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12 text-red-500'>
        <p>Error loading projects. Please try again later.</p>
      </div>
    );
  }

  return (
    <>
      <div className='mb-12'>
        <div className='flex gap-4 flex-wrap'>
          <button
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'FEATURED'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => handleFilterChange('FEATURED')}>
            Featured
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'REACT'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => handleFilterChange('REACT')}>
            React
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'FULL-STACK'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => handleFilterChange('FULL-STACK')}>
            Full-stack
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'OTHER'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => handleFilterChange('OTHER')}>
            Other
          </button>
          <button
            className={`px-6 py-2 rounded-full ${
              activeFilter === 'ALL'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white border border-gray-200 hover:bg-gray-50'
            } transition-colors`}
            onClick={() => handleFilterChange('ALL')}>
            All
          </button>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        {filteredProjects?.map((project) => (
          <div
            key={project.id}
            className='bg-white rounded-lg overflow-hidden shadow-md'>
            <div className='relative'>
              <img
                src={project.imageUrl}
                alt={project.title}
                className='w-full h-64 object-cover'
              />
              <div className='absolute bottom-3 right-3 bg-white rounded-md px-3 py-1 text-sm font-medium'>
                {project.category}
              </div>
            </div>
            <div className='p-6'>
              <h3 className='text-xl font-bold mb-2'>{project.title}</h3>
              <p className='text-gray-700 mb-5'>{project.description}</p>

              <div className='flex flex-wrap gap-2 mb-3'>
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className='px-3 py-1 text-sm bg-gray-100 rounded-md'>
                    {tag}
                  </span>
                ))}
              </div>

              {(project.demoUrl || project.sourceUrl) && (
                <div className='flex gap-3'>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-blue-500 hover:underline'>
                      View Demo
                    </a>
                  )}
                  {project.sourceUrl && (
                    <a
                      href={project.sourceUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-gray-500 hover:underline'>
                      Source Code
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

import React from 'react';

export interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags: string[];
  demoUrl?: string;
  sourceUrl?: string;
}

export default function ProjectCard({
  title,
  description,
  imageUrl,
  tags,
  demoUrl,
  sourceUrl,
}: ProjectProps) {
  return (
    <div className='flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow'>
      {imageUrl && (
        <div className='h-48 overflow-hidden'>
          <img
            src={imageUrl}
            alt={title}
            className='w-full h-full object-cover object-center'
          />
        </div>
      )}
      <div className='flex flex-col flex-grow p-6'>
        <h3 className='text-xl font-semibold mb-2'>{title}</h3>
        <p className='text-gray-600 dark:text-gray-400 flex-grow mb-4'>
          {description}
        </p>

        {tags.length > 0 && (
          <div className='flex flex-wrap gap-2 mb-4'>
            {tags.map((tag) => (
              <span
                key={tag}
                className='px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'>
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className='flex gap-3 mt-auto'>
          {demoUrl && (
            <a
              href={demoUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
              View Demo
            </a>
          )}
          {sourceUrl && (
            <a
              href={sourceUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'>
              View Source
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

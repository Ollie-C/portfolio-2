import React from 'react';
import { useContent } from '../hooks/useContent';

export default function HomeHero() {
  const { data: content, isLoading, error } = useContent();

  if (isLoading) {
    return (
      <section className='py-16 md:py-24'>
        <div className='container mx-auto'>
          <div className='max-w-4xl mx-auto'>
            <div className='h-12 w-64 bg-gray-200 animate-pulse rounded mb-4'></div>
            <div className='h-12 w-80 bg-gray-200 animate-pulse rounded'></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='py-16 md:py-24'>
        <div className='container mx-auto'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-4xl md:text-5xl font-bold mb-8'>
              <span className='block'>
                Making A <span className='text-blue-500'>Difference</span>
              </span>
              <span className='block'>
                With <span className='text-blue-500'>Creative Development</span>
              </span>
            </h1>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-16 md:py-24'>
      <div className='container mx-auto'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-5xl font-bold mb-8'>
            <span className='block'>
              {content?.heroTitle.split(' ').slice(0, -1).join(' ')}{' '}
              <span className='text-blue-500'>
                {content?.heroTitle.split(' ').slice(-1)}
              </span>
            </span>
            <span className='block'>
              With{' '}
              <span className='text-blue-500'>{content?.heroSubtitle}</span>
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}

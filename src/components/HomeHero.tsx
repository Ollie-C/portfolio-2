import React from 'react';
import { useContent } from '../hooks/useContent';
import FloatingCube from './three/FloatingCube';
import FloatingSphere from './three/FloatingSphere';

export default function HomeHero() {
  const { data: content, isLoading, error } = useContent();

  if (isLoading) {
    return (
      <section className='relative min-h-[90vh] flex items-center justify-center py-16 md:py-24'>
        <div className='h-12 w-64 bg-gray-800 animate-pulse rounded mb-4'></div>
      </section>
    );
  }

  if (error) {
    return (
      <section className='relative min-h-[90vh] flex items-center justify-center py-16 md:py-24'>
        <h1 className='text-4xl md:text-5xl font-bold mb-8 text-center'>
          <span className='block uppercase tracking-widest mb-4 text-gray-400'>
            Ollie Cross
          </span>
          <span className='block text-6xl'>Software</span>
          <span className='block text-6xl'>Developer</span>
        </h1>
      </section>
    );
  }

  return (
    <section className='relative min-h-[90vh] flex items-center justify-center py-16 md:py-24 overflow-hidden'>
      {/* Decorative 3D shapes */}
      <div className='absolute -top-10 right-20 opacity-50 hidden md:block'>
        <FloatingCube size={120} color='#2dd4bf' speed={0.8} />
      </div>

      <div className='absolute bottom-20 left-10 opacity-50 hidden md:block'>
        <FloatingSphere size={150} color='#a855f7' speed={1.2} />
      </div>

      <div className='container mx-auto relative z-10'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='font-bold'>
            <span className='block uppercase tracking-widest mb-4 text-gray-400 text-xl'>
              {content?.heroTitle || 'Ollie Cross'}
            </span>
            <div className='text-5xl md:text-6xl lg:text-7xl mt-4'>
              <span className='block text-white'>Software</span>
              <span className='block text-white'>Developer</span>
            </div>
          </h1>

          <p className='text-gray-400 max-w-lg mx-auto mt-8 text-lg'>
            Crafting modern, performant web experiences with a focus on clean
            code and innovative solutions.
          </p>

          <div className='mt-10'>
            <a
              href='/projects'
              className='inline-block bg-transparent border border-teal-400 text-teal-400 hover:bg-teal-400/10 px-8 py-3 rounded-full font-medium transition-all'>
              View Projects
            </a>
          </div>

          <div className='absolute bottom-12 left-1/2 transform -translate-x-1/2'>
            <div className='animate-bounce'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='30'
                height='30'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='1'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='text-gray-400'>
                <circle cx='12' cy='12' r='10'></circle>
                <polyline points='8 12 12 16 16 12'></polyline>
                <line x1='12' y1='8' x2='12' y2='16'></line>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import React from 'react';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className='flex flex-col items-center justify-center text-center py-20 md:py-32'>
      <h1 className='text-4xl md:text-6xl font-bold tracking-tight mb-4'>
        {title}
      </h1>
      <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl'>
        {subtitle}
      </p>
      <div className='mt-8 flex gap-4'>
        <a
          href='/projects'
          className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors'>
          View Projects
        </a>
        <a
          href='/contact'
          className='bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-6 py-3 rounded-md font-medium transition-colors'>
          Contact Me
        </a>
      </div>
    </div>
  );
}

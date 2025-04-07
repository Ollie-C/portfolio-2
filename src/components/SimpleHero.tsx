import React from 'react';

export default function SimpleHero() {
  return (
    <section className='relative min-h-[70vh] flex items-center justify-end  overflow-hidden'>
      <div className='container mx-auto relative z-10'>
        <div className='text-right'>
          <h1 className='font-medium'>
            <span className='block uppercase tracking-widest mb-0 text-[#4752a8] text-5xl'>
              Ollie Cross
            </span>
            <div className='text-5xl md:text-6xl lg:text-8xl mt-0'>
              <span className='block text-text-primary'>Developer</span>
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}

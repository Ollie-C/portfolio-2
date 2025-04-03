import React from 'react';

interface ProjectNavDotsProps {
  count?: number;
  activeIndex?: number;
}

export default function ProjectNavDots({
  count = 5,
  activeIndex = 0,
}: ProjectNavDotsProps) {
  return (
    <div className='project-nav-dots hidden md:flex'>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`dot ${index === activeIndex ? 'active' : ''}`}
          aria-label={`Go to section ${index + 1}`}
          role='button'
          tabIndex={0}
        />
      ))}
    </div>
  );
}

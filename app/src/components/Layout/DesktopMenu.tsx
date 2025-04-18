import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CV from '../../assets/ollie_cross_cv.pdf';

type DesktopMenuProps = {
  scrollToSection: (sectionId: string) => void;
};

const DesktopMenu: React.FC<DesktopMenuProps> = ({ scrollToSection }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { t } = useTranslation();

  if (!isHomePage) return null;

  return (
    <nav className='hidden md:flex gap-8'>
      <button
        onClick={() => scrollToSection('about')}
        className='rounded text-muted-foreground hover:text-foreground relative group uppercase text-sm tracking-wider font-medium bg-transparent cursor-pointer'>
        <span>{t('header.about')}</span>
        <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300'></span>
      </button>
      <button
        onClick={() => scrollToSection('skills')}
        className='rounded text-muted-foreground hover:text-foreground relative group uppercase text-sm tracking-wider font-medium bg-transparent cursor-pointer'>
        <span>{t('header.skills')}</span>
        <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300'></span>
      </button>
      <button
        onClick={() => scrollToSection('projects')}
        className='rounded text-muted-foreground hover:text-foreground relative group uppercase text-sm tracking-wider font-medium bg-transparent cursor-pointer'>
        <span>{t('header.projects')}</span>
        <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300'></span>
      </button>
      <button
        onClick={() => scrollToSection('contact')}
        className='rounded text-muted-foreground hover:text-foreground relative group uppercase text-sm tracking-wider font-medium bg-transparent cursor-pointer'>
        <span>{t('header.contact')}</span>
        <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300'></span>
      </button>
      <a
        href={CV}
        download='ollie_cross_cv.pdf'
        target='_blank'
        rel='noopener noreferrer'
        className='rounded text-muted-foreground hover:text-foreground relative group uppercase text-sm tracking-wider font-medium bg-transparent cursor-pointer flex items-center gap-1'>
        <span>CV</span>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='14'
          height='14'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='opacity-70 group-hover:opacity-100 transition-opacity'>
          <path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'></path>
          <polyline points='7 10 12 15 17 10'></polyline>
          <line x1='12' y1='15' x2='12' y2='3'></line>
        </svg>
        <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300'></span>
      </a>
    </nav>
  );
};

export default DesktopMenu;

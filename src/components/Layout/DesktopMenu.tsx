import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
    </nav>
  );
};

export default DesktopMenu;

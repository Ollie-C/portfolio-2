import BackgroundWrapper from '../three/BackgroundWrapper';
import SocialSidebar from '../SocialSidebar';
import { useState, useEffect } from 'react';
import Options from '../Options';
import MobileMenu from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('none');
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleAnimationChange = (animation: string) => {
    setCurrentAnimation(animation);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <div className='min-h-screen relative'>
      {/* Background layers */}
      <div className='noise-overlay'></div>
      <div className='gradient-blob'></div>
      <div className='fixed inset-0 bg-background -z-10'></div>
      <BackgroundWrapper />

      {/* Header - z-index above everything */}
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'backdrop-blur-md bg-background/80 shadow-md' : ''
        }`}>
        <div className='container mx-auto flex justify-between items-center h-[60px] px-5'>
          <div
            onClick={() => scrollToSection('top')}
            className='text-lg font-bolder text-muted-foreground hover:text-primary transition-colors cursor-pointer'>
            OC
          </div>
          <div className='flex justify-end items-center gap-8'>
            <div className='hidden md:block'></div>
            <nav className='flex justify-between items-center'>
              <DesktopMenu scrollToSection={scrollToSection} />
              <button
                onClick={toggleMobileMenu}
                className='md:hidden flex items-center bg-transparent p-2 text-foreground hover:text-primary transition-colors rounded-none'
                aria-label='Toggle menu'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  {mobileMenuOpen ? (
                    <>
                      <line x1='18' y1='6' x2='6' y2='18'></line>
                      <line x1='6' y1='6' x2='18' y2='18'></line>
                    </>
                  ) : (
                    <>
                      <line x1='3' y1='12' x2='21' y2='12'></line>
                      <line x1='3' y1='6' x2='21' y2='6'></line>
                      <line x1='3' y1='18' x2='21' y2='18'></line>
                    </>
                  )}
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content - between header and mobile menu */}
      <div className='relative w-full container mx-auto z-10'>
        <main className='flex-1 py-1 pt-[80px] relative'>{children}</main>
      </div>

      {/* Sidebars - Only visible on desktop */}
      <div className='fixed bottom-4 md:bottom-10 left-0 right-0 py-4 z-10 pointer-events-none'>
        <div className='w-full container mx-auto flex justify-between items-end px-5'>
          {!isMobile && <SocialSidebar />}
          <Options
            onAnimationChange={handleAnimationChange}
            currentAnimation={currentAnimation}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        scrollToSection={scrollToSection}
      />
    </div>
  );
};

export default Layout;

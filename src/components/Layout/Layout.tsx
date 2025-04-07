import BackgroundWrapper from '../three/BackgroundWrapper';
import SocialSidebar from '../SocialSidebar';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  // This can be connected to theme controls later
  const [showBackground, setShowBackground] = useState(true);

  return (
    <div className='min-h-screen relative z-10'>
      <div className='noise-overlay'></div>
      <div className='bg-[var(--bg-color)]'></div>

      <div className='relative w-full container mx-auto sm:px-3 md:px-6 lg:px-10 xl:px-16'>
        <header className='sticky top-4 w-full py-4 bg-[var(--bg-color)]/80 backdrop-blur-md z-10 flex justify-between items-center'>
          <div className='text-2xl font-bold'>OC</div>
          <div className='flex justify-end'>
            <nav className='flex justify-between items-center'>
              <nav className='flex gap-8'>
                <Link
                  to='/projects'
                  className='text-[var(--text-secondary)] hover:text-white relative group uppercase text-sm tracking-wider font-medium'>
                  <span>Projects</span>
                  <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--text-primary)] group-hover:w-full transition-all duration-300'></span>
                </Link>
                <Link
                  to='/about'
                  className='text-[var(--text-secondary)] hover:text-white relative group uppercase text-sm tracking-wider font-medium'>
                  <span>About</span>
                  <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--text-primary)] group-hover:w-full transition-all duration-300'></span>
                </Link>
                <Link
                  to='/skills'
                  className='text-[var(--text-secondary)] hover:text-white relative group uppercase text-sm tracking-wider font-medium'>
                  <span>Skills</span>
                  <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--text-primary)] group-hover:w-full transition-all duration-300'></span>
                </Link>
                <Link
                  to='/contact'
                  className='text-[var(--text-secondary)] hover:text-white relative group uppercase text-sm tracking-wider font-medium'>
                  <span>Contact</span>
                  <span className='absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--text-primary)] group-hover:w-full transition-all duration-300'></span>
                </Link>
              </nav>
              <button
                className='md:hidden flex items-center'
                aria-label='Toggle menu'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='24'
                  height='24'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <line x1='3' y1='12' x2='21' y2='12'></line>
                  <line x1='3' y1='6' x2='21' y2='6'></line>
                  <line x1='3' y1='18' x2='21' y2='18'></line>
                </svg>
              </button>
            </nav>
          </div>
        </header>

        <main className='flex-1 py-20'>{children}</main>

        <div className='fixed bottom-[10%] left-0 pointer-events-none sm:px-3 md:px-6 lg:px-10 xl:px-16'>
          <SocialSidebar />
        </div>

        {showBackground && (
          <div className='fixed bottom-[10%] right-0 z-10 sm:px-3 md:px-6 lg:px-10 xl:px-16'>
            <BackgroundWrapper />
          </div>
        )}

        <footer className='w-full py-6 border-t border-[var(--border-color)] mt-10'>
          <div className='mx-auto text-center text-xs text-[var(--text-secondary)]'>
            <p>
              &copy; {new Date().getFullYear()} OLLIE C. ALL RIGHTS RESERVED
            </p>
          </div>
        </footer>

        <div className='mobile-menu hidden fixed inset-0 z-40 backdrop-blur-md bg-[var(--bg-color)]/90 p-6 flex flex-col'>
          <div className='flex justify-between items-center mb-8'>
            <Link to='/' className='text-xl font-bold tracking-tighter'>
              OLLIE C.
            </Link>
            <button className='close-menu p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
          </div>
          <nav className='flex flex-col gap-8 items-center text-lg'>
            <Link
              to='/about'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              ABOUT
            </Link>
            <Link
              to='/projects'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              PROJECTS
            </Link>
            <Link
              to='/skills'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              SKILLS
            </Link>
            <Link
              to='/astro-benefits'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              ASTRO
            </Link>
            <Link
              to='/contact'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              CONTACT
            </Link>
            <Link
              to='/cv'
              className='bg-teal-500 text-white px-6 py-2 rounded-full mt-4 hover:bg-teal-600 transition-colors'>
              CV
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Layout;

import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

type MobileMenuProps = {
  isOpen: boolean;
  toggleMobileMenu: () => void;
  scrollToSection: (sectionId: string) => void;
};

const MobileMenu = ({
  isOpen,
  toggleMobileMenu,
  scrollToSection,
}: MobileMenuProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const socialLinks = [
    {
      name: 'GitHub',
      icon: (
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
          <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22'></path>
        </svg>
      ),
      url: 'https://github.com/rolliec',
    },
    {
      name: 'LinkedIn',
      icon: (
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
          <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z'></path>
          <rect x='2' y='9' width='4' height='12'></rect>
          <circle cx='4' cy='4' r='2'></circle>
        </svg>
      ),
      url: 'https://linkedin.com/in/olliecross',
    },
  ];

  // Animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: '100%',
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  };

  // Background overlay variants
  const overlayVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background overlay that extends behind the header */}
          <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={overlayVariants}
            className='fixed inset-0 bg-background/50 backdrop-blur-md z-20'
          />

          {/* Menu content that starts below the header */}
          <motion.div
            initial='hidden'
            animate='visible'
            exit='exit'
            variants={menuVariants}
            className='fixed inset-x-0 top-[60px] bottom-0 z-50 overflow-y-auto'>
            <div className='flex flex-col h-full px-5 pt-10 pb-8'>
              <motion.nav
                className='flex flex-col gap-10'
                initial='hidden'
                animate='visible'
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                      delayChildren: 0.1,
                    },
                  },
                }}>
                {isHomePage ? (
                  <>
                    {['about', 'projects', 'skills', 'contact'].map(
                      (section, index) => (
                        <motion.button
                          key={section}
                          onClick={() => {
                            scrollToSection(section);
                            toggleMobileMenu();
                          }}
                          className='text-left group bg-transparent'
                          variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0 },
                          }}>
                          <div className='flex items-center'>
                            <span className='font-mono text-primary text-xs opacity-60 w-12'>
                              {String(index + 1).padStart(2, '0')} /
                            </span>
                            <span className='text-2xl font-light text-foreground group-hover:text-primary transition-colors'>
                              {t(`header.${section}`)}
                            </span>
                          </div>
                          <div className='h-px w-full bg-muted-foreground/10 mt-3'></div>
                        </motion.button>
                      )
                    )}
                  </>
                ) : (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}>
                    <Link
                      to='/'
                      onClick={toggleMobileMenu}
                      className='text-2xl font-light text-foreground hover:text-primary transition-colors'>
                      {t('header.home')}
                    </Link>
                  </motion.div>
                )}

                {/* CV Link */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className='w-full mt-10'>
                  <a
                    href='/resume.pdf'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='flex items-center group'>
                    <span className='font-mono text-primary text-xs opacity-60 w-12'>
                      CV /
                    </span>
                    <span className='text-2xl font-light text-foreground group-hover:text-primary transition-colors'>
                      My CV
                    </span>
                  </a>
                  <div className='h-px w-full bg-muted-foreground/10 mt-3'></div>
                </motion.div>
              </motion.nav>

              {/* Social Links & Theme Toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className='mt-auto'>
                <div className='flex items-center justify-center'>
                  <div className='flex items-center gap-4'>
                    {socialLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-muted-foreground hover:text-primary transition-colors'>
                        {link.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;

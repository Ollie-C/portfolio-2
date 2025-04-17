import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      className='w-full py-6 mt-auto border-t border-[var(--border-color)]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='mb-4 md:mb-0'>
            <p className='text-sm text-[var(--text-secondary)]'>
              © {new Date().getFullYear()} Ollie Cross. All rights reserved.
            </p>
          </div>
          <div className='flex space-x-4'>
            <a
              href='https://github.com/olliecross'
              target='_blank'
              rel='noopener noreferrer'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              GitHub
            </a>
            <a
              href='https://linkedin.com/in/olliecross'
              target='_blank'
              rel='noopener noreferrer'
              className='text-[var(--text-secondary)] hover:text-teal-400 transition-colors'>
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;

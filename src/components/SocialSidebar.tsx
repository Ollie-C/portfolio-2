import { motion } from 'framer-motion';

const SocialSidebar = () => {
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
    {
      name: 'Codewars',
      icon: (
        <svg
          width='20'
          height='20'
          viewBox='0 0 24 24'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M12 2L9.09 6.91 3 8.18 7.5 12.18 6.9 18.27 12 15.27 17.1 18.27 16.5 12.18 21 8.18 14.91 6.91 12 2z' />
        </svg>
      ),
      url: 'https://www.codewars.com/users/olliecross',
    },
  ];

  return (
    <div className='flex flex-col gap-8 pointer-events-auto'>
      {socialLinks.map((link, i) => (
        <motion.a
          key={link.name}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='text-muted-foreground hover:text-primary transition-colors'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}>
          {link.icon}
        </motion.a>
      ))}
    </div>
  );
};

export default SocialSidebar;

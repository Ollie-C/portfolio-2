import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className='py-4 border-t border-muted-foreground/10 mx-5'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <div className='container mx-auto px-8'>
        <div className='flex justify-center'>
          <div className='flex items-center gap-4'>
            <span className='font-mono text-primary text-xs opacity-60'>
              © {currentYear} /
            </span>
            <span className='text-sm text-muted-foreground font-light'>
              Ollie Cross. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

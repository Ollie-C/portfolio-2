import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  targetId?: string;
  className?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  targetId = 'about',
  className = '',
}) => {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <motion.div
      className={`absolute bottom-[15%] left-1/2 transform -translate-x-1/2 cursor-pointer ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      onClick={scrollToSection}
      whileHover={{ y: 5 }}
      whileTap={{ scale: 0.95 }}>
      <div className='flex flex-col items-center space-y-2'>
        <motion.div
          className='text-xs uppercase tracking-widest text-muted-foreground font-mono'
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}>
          Scroll
        </motion.div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown size={20} className='text-muted-foreground' />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ScrollIndicator;

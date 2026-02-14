import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import BackgroundAnimation from './ParticlesAnimation';
import RainAnimation from './RainAnimation';
import GalaxyAnimation from './GalaxyAnimation';

const zoomTransition = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.92 },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
};

export default function BackgroundWrapper() {
  const { animationTheme } = useThemeStore();

  return (
    <div className='z-0 overflow-hidden fixed inset-0'>
      <AnimatePresence mode='wait'>
        {animationTheme === 'particles' && (
          <motion.div
            key='particles'
            className='absolute inset-0'
            {...zoomTransition}>
            <BackgroundAnimation />
          </motion.div>
        )}
        {animationTheme === 'rain' && (
          <motion.div
            key='rain'
            className='absolute inset-0'
            {...zoomTransition}>
            <RainAnimation />
          </motion.div>
        )}
        {animationTheme === 'galaxy' && (
          <motion.div
            key='galaxy'
            className='absolute inset-0'
            {...zoomTransition}>
            <GalaxyAnimation />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

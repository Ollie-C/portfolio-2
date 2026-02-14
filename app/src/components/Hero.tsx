import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import TypingAnimation from './TypingAnimation';
import ScrollIndicator from './ScrollIndicator';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useThemeStore, AnimationTheme } from '../store/themeStore';

const ANIMATION_ORDER: AnimationTheme[] = [
  'none',
  'particles',
  'rain',
  'galaxy',
];

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { data: siteSettings } = useSiteSettings();
  const { animationTheme, setAnimationTheme } = useThemeStore();
  const isJapanese = i18n.language === 'ja';

  const heroUpdate = siteSettings?.heroUpdate;
  const updateMessage =
    isJapanese && heroUpdate?.messageJa
      ? heroUpdate.messageJa
      : heroUpdate?.message;

  const cycleBackgroundAnimation = () => {
    const idx = ANIMATION_ORDER.indexOf(animationTheme);
    const next = ANIMATION_ORDER[(idx + 1) % ANIMATION_ORDER.length];
    setAnimationTheme(next);
  };

  return (
    <section
      id='top'
      className='relative min-h-[85vh] flex items-center justify-end md:justify-end overflow-hidden pb-32 md:pb-40 px-4 sm:px-6 md:px-8'>
      {/* Clickable background overlay - cycle animation (sits behind hero content) */}
      <button
        type='button'
        onClick={cycleBackgroundAnimation}
        className='absolute inset-0 z-[1] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset bg-transparent'
        aria-label='Change background animation'
      />
      {/* Main content */}
      <div className='container mx-auto relative z-10 w-full'>
        <div className='text-left md:text-right'>
          {/* Main title - smaller on mobile for readability and to avoid overflow */}
          <motion.h1
            className='font-medium mb-4 md:mb-6'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}>
            <span className='block uppercase tracking-widest mb-2 text-[#4752a8] text-2xl sm:text-4xl md:text-7xl'>
              {t('hero.title')}
            </span>
            <div className='text-3xl sm:text-4xl md:text-6xl lg:text-9xl mt-0'>
              <span className='block text-text-primary'>
                {t('hero.subtitle')}
              </span>
            </div>
          </motion.h1>

          {/* Hero Update Message - positioned underneath "Developer" */}
          {heroUpdate?.enabled && updateMessage && (
            <div className='mt-8 md:mt-12 pr-2'>
              <div className='flex flex-wrap items-center justify-start md:justify-end gap-1'>
                {'"'}
                <TypingAnimation
                  text={updateMessage}
                  speed={40}
                  delay={2}
                  className='text-xs md:text-sm text-muted-foreground'
                />
                {heroUpdate.link && (
                  <motion.a
                    href={heroUpdate.link}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ml-2 min-h-[44px] min-w-[44px] items-center'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={heroUpdate.linkText || 'View'}>
                    <span className='text-xs'>
                      {heroUpdate.linkText || 'View'}
                    </span>
                    <ExternalLink size={12} className='-mt-0.5 shrink-0' />
                  </motion.a>
                )}
                {'"'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator targetId='about' />
    </section>
  );
}

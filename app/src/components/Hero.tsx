import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import TypingAnimation from './TypingAnimation';
import ScrollIndicator from './ScrollIndicator';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Hero() {
  const { t, i18n } = useTranslation();
  const { data: siteSettings } = useSiteSettings();
  const isJapanese = i18n.language === 'ja';

  const heroUpdate = siteSettings?.heroUpdate;
  const updateMessage =
    isJapanese && heroUpdate?.messageJa
      ? heroUpdate.messageJa
      : heroUpdate?.message;

  return (
    <section
      id='top'
      className='relative min-h-[85vh] flex items-center justify-end overflow-hidden pb-40 px-8'>
      {/* Main content */}
      <div className='container mx-auto relative z-10'>
        <div className='text-right'>
          {/* Main title */}
          <motion.h1
            className='font-medium mb-6'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}>
            <span className='block uppercase tracking-widest mb-2 text-[#4752a8] text-4xl md:text-7xl'>
              {t('hero.title')}
            </span>
            <div className='text-4xl md:text-6xl lg:text-9xl mt-0'>
              <span className='block text-text-primary'>
                {t('hero.subtitle')}
              </span>
            </div>
          </motion.h1>

          {/* Hero Update Message - positioned underneath "Developer" */}
          {heroUpdate?.enabled && updateMessage && (
            <div className='mt-12'>
              <div className='flex items-center justify-end gap-1'>
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
                    className='inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors ml-2'
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}>
                    <span className='text-xs'>
                      {heroUpdate.linkText || 'View'}
                    </span>
                    <ExternalLink size={12} className='-mt-0.5' />
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

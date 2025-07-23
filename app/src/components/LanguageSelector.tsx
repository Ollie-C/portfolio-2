import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLanguage === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <motion.button
      className='w-11 h-10 rounded bg-transparent flex items-center justify-center hover:bg-primary/10 transition-colors'
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${
        currentLanguage === 'en' ? 'Japanese' : 'English'
      }`}>
      <span className='text-[18px] font-medium'>
        {currentLanguage === 'en' ? 'あ' : 'A'}
      </span>
    </motion.button>
  );
};

export default LanguageSelector;

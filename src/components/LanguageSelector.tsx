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
      className='w-10 h-10 rounded bg-transparent shadow-lg flex items-center justify-center border-4 border-gray-700 hover:bg-primary/10 transition-colors'
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${currentLanguage === 'en' ? 'Japanese' : 'English'}`}>
      <span className='text-lg font-medium'>
        {currentLanguage === 'en' ? 'あ' : 'A'}
      </span>
    </motion.button>
  );
};

export default LanguageSelector;

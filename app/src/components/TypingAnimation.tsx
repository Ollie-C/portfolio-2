import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingAnimationProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  onComplete?: () => void;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  text,
  speed = 50,
  delay = 0,
  className = '',
  onComplete,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!text) return;

    setIsTyping(true);
    setDisplayedText('');
    setCurrentIndex(0);

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          if (prevIndex >= text.length) {
            clearInterval(interval);
            setIsTyping(false);
            onComplete?.();
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, speed, delay, onComplete]);

  useEffect(() => {
    setDisplayedText(text.slice(0, currentIndex));
  }, [currentIndex, text]);

  return (
    <motion.div
      className={`font-mono ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <span className='text-primary'>
        {displayedText}
        {isTyping && (
          <motion.span
            className='inline-block w-0.5 h-4 bg-primary ml-1'
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </span>
    </motion.div>
  );
};

export default TypingAnimation;

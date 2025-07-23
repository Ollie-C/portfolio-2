import { motion } from 'framer-motion';
import { useState } from 'react';

interface TechLearningCardProps {
  name: string;
  icon: string;
  progress: number; // 0-100
  description?: string;
  learningSince?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

const TechLearningCard: React.FC<TechLearningCardProps> = ({
  name,
  icon,
  progress,
  description,
  learningSince,
  difficulty = 'Intermediate',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'text-green-500';
      case 'Intermediate':
        return 'text-yellow-500';
      case 'Advanced':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <motion.div
      className='flex flex-col items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/30 transition-all duration-300 group'
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}>
      {/* Icon */}
      <div className='relative'>
        <div className='rounded-full p-4 bg-card/80 border border-muted/30 shadow-inner w-16 h-16 flex items-center justify-center group-hover:border-primary/50 transition-colors'>
          <img
            src={icon}
            alt={name}
            className='w-10 h-10 object-contain'
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('show-letter');
            }}
          />
          <span className='hidden text-lg font-mono'>{name.charAt(0)}</span>
        </div>

        {/* Progress indicator */}
        <div className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center'>
          <span className='text-xs font-bold text-primary'>{progress}%</span>
        </div>
      </div>

      {/* Tech name */}
      <span className='text-sm font-medium text-foreground text-center'>
        {name}
      </span>

      {/* Progress bar */}
      <div className='w-full max-w-20'>
        <div className='w-full bg-muted/30 rounded-full h-1.5'>
          <motion.div
            className='h-1.5 bg-primary rounded-full'
            initial={{ width: 0 }}
            whileInView={{ width: `${progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Difficulty badge */}
      <span className={`text-xs font-medium ${getDifficultyColor(difficulty)}`}>
        {difficulty}
      </span>

      {/* Expanded info on hover */}
      <motion.div
        className='absolute top-full left-0 right-0 bg-card border border-border rounded-lg p-4 shadow-lg z-10 mt-2'
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : 10,
          scale: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isHovered ? 'auto' : 'none' }}>
        {description && (
          <p className='text-xs text-muted-foreground mb-2'>{description}</p>
        )}
        {learningSince && (
          <p className='text-xs text-muted-foreground'>
            Learning since: {learningSince}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default TechLearningCard;

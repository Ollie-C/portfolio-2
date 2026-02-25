import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  slug: string;
  featured?: boolean;
  inProgress?: boolean;
  category?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  tags,
  slug,
  featured,
  inProgress,
  category,
}) => {
  const { t } = useTranslation();
  const [imageError, setImageError] = useState(false);

  // Generate a gradient background based on the project title (for consistency)
  const generateGradient = () => {
    // Generate a predictable hue based on the project title
    const hash = title.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const lightness = 25 + (Math.abs(hash % 30));
    return {
      background: `linear-gradient(135deg, hsla(0, 0%, ${lightness}%, 0.9), hsla(0, 0%, ${lightness + 15}%, 0.5))`,
      color: 'hsl(0, 0%, 95%)',
    };
  };

  const gradientStyle = generateGradient();

  return (
    <Link to={`/project/${slug}`}>
      <motion.article
        className='group flex flex-col h-full'
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}>
        {/* Image container */}
        <div className='overflow-hidden rounded-none mb-4 aspect-video'>
          {imageError ? (
            <div
              className='w-full h-full flex items-center justify-center'
              style={gradientStyle}>
              <span className='text-2xl font-light'>
                {title[0].toUpperCase()}
              </span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={title}
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Content */}
        <div className='flex-1 flex flex-col'>
          <div className='flex items-center justify-between mb-2'>
            <h3 className='text-lg font-medium text-foreground group-hover:text-primary transition-colors'>
              {title}
            </h3>

            <span className='flex items-center gap-2'>
              {inProgress && (
                <span className='text-xs font-mono text-primary/80'>
                  {t('projectCard.inProgress')}
                </span>
              )}
              {featured && (
                <span className='text-xs font-mono text-primary opacity-80'>
                  FEATURED
                </span>
              )}
            </span>
          </div>

          <p className='text-sm text-muted-foreground line-clamp-2 mb-3'>
            {description}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className='mt-auto flex flex-wrap gap-2'>
              {tags.slice(0, 3).map((tag, i) => (
                <span key={i} className='text-xs text-muted-foreground/80'>
                  #{tag.toLowerCase()}
                </span>
              ))}
              {tags.length > 3 && (
                <span className='text-xs text-muted-foreground/60'>
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Category indicator */}
          {category && (
            <div className='mt-3 flex items-center'>
              <div
                className='w-2 h-2 rounded-full mr-2 bg-foreground/70'
              />
              <span className='text-xs uppercase font-mono text-muted-foreground/70'>
                {category}
              </span>
            </div>
          )}
        </div>
      </motion.article>
    </Link>
  );
};

export default ProjectCard;

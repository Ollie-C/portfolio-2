import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSkills } from '../hooks/useSkills';
import { urlFor, SanityImageSource } from '../lib/sanity';

// Import necessary icons from react-icons or another icon library
interface SkillCategory {
  key: string;
  title: string;
  color: string;
}

// Mapping of skill names to their icon URLs (as fallbacks)
const skillIconsMap: Record<string, string> = {
  // Frontend
  react:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  typescript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  javascript:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  html: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  css: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
  'tailwind css':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg',
  sass: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg',
  'next.js':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  vue: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
  'framer motion':
    'https://seeklogo.com/images/F/framer-motion-logo-DA1E33CAA1-seeklogo.com.png',

  // Backend
  'node.js':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  express:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  graphql:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg',
  rest: 'https://cdn.worldvectorlogo.com/logos/rest-63.svg',
  nestjs:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-plain.svg',

  // Database
  mongodb:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  postgresql:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  mysql:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  sqlite:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  prisma: 'https://cdn.worldvectorlogo.com/logos/prisma-2.svg',

  // Tools
  git: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  github:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  docker:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  aws: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
  vercel:
    'https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png',
  figma:
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
  'adobe xd':
    'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/xd/xd-plain.svg',
  jest: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jest/jest-plain.svg',

  // New icons
  'a-frame': 'https://aframe.io/images/aframe-logo.png',
  motion:
    'https://camo.githubusercontent.com/179d66ab2b0321726c88a586c4ad38802e7113a6d3ddd3da44ac7b03705c7c95/68747470733a2f2f6672616d6572696d616765732e636f6d2f696d616765732f6c6f676f2d626c61636b2e737667',
  tailwind:
    'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg',
  python:
    'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
  supabase:
    'https://seeklogo.com/images/S/supabase-logo-DCC676FFE2-seeklogo.com.png',
  next: 'https://seeklogo.com/images/N/next-js-logo-8FCFF51DD2-seeklogo.com.png',
  electron:
    'https://upload.wikimedia.org/wikipedia/commons/9/91/Electron_Software_Framework_Logo.svg',
  capacitor:
    'https://seeklogo.com/images/C/capacitor-logo-DF3634DD70-seeklogo.com.png',
  vitest: 'https://vitest.dev/logo.svg',
  vite: 'https://vitejs.dev/logo.svg',
  sanity: 'https://www.sanity.io/static/images/logo_rounded_square.svg',
  hubspot:
    'https://seeklogo.com/images/H/hubspot-logo-A06A6E0DF8-seeklogo.com.png',
  jira: 'https://seeklogo.com/images/J/jira-logo-C71F8C0324-seeklogo.com.png',
};

// Define a type for skill data
interface SkillData {
  id: string;
  name: string;
  category: string;
  icon?: SanityImageSource;
}

export default function SkillsSection() {
  const { t } = useTranslation();
  const { data: allSkills, isLoading } = useSkills();
  const sectionRef = useRef<HTMLDivElement>(null);

  // Skill category definitions (order matches Sanity: core, strong_working_experience, familiar_with)
  const categories: SkillCategory[] = [
    {
      key: 'core',
      title: t('sections.skills.core'),
      color: 'hsl(var(--primary))',
    },
    {
      key: 'strong_working_experience',
      title: t('sections.skills.strongWorkingExperience'),
      color: 'hsl(var(--accent))',
    },
    {
      key: 'familiar_with',
      title: t('sections.skills.familiarWith'),
      color: 'hsl(var(--secondary))',
    },
  ];

  // Group skills by category
  const skillsByCategory = allSkills?.reduce(
    (acc, skill) => {
      const category = skill.category.toLowerCase();
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, typeof allSkills>,
  );

  const getSkillIconUrl = (skill: SkillData): string | undefined => {
    // First priority: Use image from Sanity if available
    if (skill.icon && typeof skill.icon === 'object') {
      try {
        const urlBuilder = urlFor(skill.icon);
        // If it has width/height methods, use them
        if ('width' in urlBuilder) {
          return urlBuilder.width(56).height(56).url();
        }
        // Otherwise just get the URL
        return urlBuilder.url();
      } catch (error) {
        console.error('Error generating Sanity image URL:', error);
      }
    }

    // Second priority: Try exact match from our map
    const exactMatch = skillIconsMap[skill.name.toLowerCase()];
    if (exactMatch) return exactMatch;

    // Third priority: Try to find a partial match
    const normalizedName = skill.name.toLowerCase();
    for (const [key, url] of Object.entries(skillIconsMap)) {
      if (normalizedName.includes(key)) {
        return url;
      }
    }

    // Return undefined if no match found
    return undefined;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center py-20'>
        <div className='animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full'></div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-8' ref={sectionRef}>
      <motion.div
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, margin: '-10%' }}
        variants={fadeIn}
        className='mb-16 space-x-4'>
        <span className='font-mono text-primary text-sm tracking-wider'>
          002 /
        </span>
        <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
          {t('sections.skills.title')}
          <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
        </h2>
      </motion.div>

      {/* Each category on its own row; label below icon, visible on hover */}
      {categories.map((category, colIndex) => {
        const skills = skillsByCategory?.[category.key] || [];
        return (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{
              duration: 0.5,
              ease: 'easeOut',
              delay: colIndex * 0.1,
            }}
            className='mt-16 pl-6 md:pl-16'>
            <h3 className='text-lg font-light text-foreground mb-4 flex items-center gap-3'>
              <span
                className='w-6 h-px shrink-0'
                style={{ backgroundColor: category.color }}
              />
              {category.title}
            </h3>
            <div className='flex flex-wrap gap-1 md:gap-6'>
              {skills.map((skill, index) => {
                const iconUrl = getSkillIconUrl(skill);
                const level = Math.min(10, Math.max(1, skill.level ?? 5));
                const scale = 0.9 + (level / 10) * 0.4;
                return (
                  <motion.div
                    key={skill.id}
                    className='group flex flex-col items-center gap-2'
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.04 + 0.1,
                      duration: 0.3,
                    }}>
                    <div className='rounded-full p-3 bg-card/80 border border-muted/30 shadow-inner w-16 h-16 flex items-center justify-center shrink-0'>
                      <span
                        className='inline-flex items-center justify-center'
                        style={{ transform: `scale(${scale})` }}>
                        {iconUrl ? (
                          <img
                            src={iconUrl}
                            alt={skill.name}
                            className='w-7 h-7 object-contain'
                            onError={(e) => {
                              const fallbackUrl =
                                skillIconsMap[skill.name.toLowerCase()];
                              if (
                                fallbackUrl &&
                                e.currentTarget.src !== fallbackUrl
                              ) {
                                e.currentTarget.src = fallbackUrl;
                              } else {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add(
                                  'show-letter',
                                );
                              }
                            }}
                          />
                        ) : (
                          <span className='text-sm font-mono'>
                            {skill.name.charAt(0)}
                          </span>
                        )}
                      </span>
                    </div>
                    <span
                      className='text-sm text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-center max-w-[6rem] truncate'
                      title={skill.name}>
                      {skill.name}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

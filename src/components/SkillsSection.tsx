import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useSkills } from '../hooks/useSkills';
import { urlFor, SanityImageSource } from '../lib/sanity';

// Import necessary icons from react-icons or another icon library
import {
  CodeBracketIcon,
  ServerIcon,
  CircleStackIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

interface SkillCategory {
  key: string;
  title: string;
  icon: React.ReactElement;
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

  // Skill category definitions
  const categories: SkillCategory[] = [
    {
      key: 'frontend',
      title: t('sections.skills.frontend'),
      icon: <CodeBracketIcon className='w-6 h-6' />,
      color: 'hsl(var(--primary))',
    },
    {
      key: 'fullstack',
      title: t('sections.skills.fullstack'),
      icon: <ServerIcon className='w-6 h-6' />,
      color: 'hsl(var(--accent))',
    },
    {
      key: 'tooling',
      title: t('sections.skills.tooling'),
      icon: <CircleStackIcon className='w-6 h-6' />,
      color: 'hsl(var(--secondary))',
    },
    {
      key: 'cms',
      title: t('sections.skills.cms'),
      icon: <WrenchScrewdriverIcon className='w-6 h-6' />,
      color: 'hsl(var(--muted-foreground))',
    },
    {
      key: 'collaboration',
      title: t('sections.skills.collaboration'),
      icon: <UserGroupIcon className='w-6 h-6' />,
      color: 'hsl(var(--muted-foreground))',
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
    {} as Record<string, typeof allSkills>
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

      <div className='mt-16 space-y-1'>
        {categories.map((category) => {
          const skills = skillsByCategory?.[category.key] || [];

          // Skip empty categories
          if (!skills.length) return null;

          return (
            <motion.div
              key={category.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className='py-6'>
              <div className='grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10'>
                {/* Category title */}
                <div className='md:col-span-3'>
                  <h3 className='text-xl font-light text-foreground mb-1 flex items-center gap-3'>
                    <span
                      className='w-6 h-px'
                      style={{ backgroundColor: category.color }}
                    />
                    {category.title}
                  </h3>
                </div>

                {/* Skills */}
                <div className='md:col-span-9'>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'>
                    {skills.map((skill, index) => {
                      const iconUrl = getSkillIconUrl(skill);

                      return (
                        <motion.div
                          key={skill.id}
                          className='group flex items-center gap-2 p-3 rounded-lg transition-all duration-300 border border-foreground/50 hover:shadow-lg hover:border-primary/20'
                          whileHover={{
                            y: -5,
                          }}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            delay: index * 0.05 + 0.1,
                            duration: 0.3,
                          }}
                          style={{
                            backdropFilter: 'blur(5px)',
                          }}>
                          {/* Icon container */}
                          <div className='rounded-full p-3 w-14 h-14 flex items-center justify-center border border-muted/30 shadow-inner'>
                            {iconUrl ? (
                              <img
                                src={iconUrl}
                                alt={skill.name}
                                className='w-7 h-7 object-contain opacity-80 group-hover:opacity-100 transition-opacity'
                                onError={(e) => {
                                  // If image fails to load, try to use fallback or default to first letter
                                  const fallbackUrl =
                                    skillIconsMap[skill.name.toLowerCase()];
                                  if (
                                    fallbackUrl &&
                                    e.currentTarget.src !== fallbackUrl
                                  ) {
                                    e.currentTarget.src = fallbackUrl;
                                  } else {
                                    // If both Sanity and fallback fail, hide the img and show the letter
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.parentElement?.classList.add(
                                      'show-letter'
                                    );
                                  }
                                }}
                              />
                            ) : (
                              <span className='w-7 h-7 flex items-center justify-center text-md font-mono opacity-80 group-hover:opacity-100 transition-opacity'>
                                {skill.name.charAt(0)}
                              </span>
                            )}
                          </div>

                          {/* Skill name */}
                          <span className='text-xs text-center text-foreground/80 group-hover:text-foreground transition-colors mt-1 px-1'>
                            {skill.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

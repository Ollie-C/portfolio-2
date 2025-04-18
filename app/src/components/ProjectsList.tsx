import { useState, useEffect, useRef } from 'react';
import { useProjects } from '../hooks/useProjects';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';

// Define a type for project data structure
interface ProjectData {
  id: string;
  title: string;
  titleJa?: string;
  description: string;
  descriptionJa?: string;
  slug: string;
  tags?: string[];
  imageUrl?: string;
}

export default function ProjectsList() {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'recent' | 'legacy'>(
    'recent'
  );
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { i18n } = useTranslation();
  const isJapanese = i18n.language === 'ja';

  useEffect(() => {
    setSelectedProject(null);
  }, [isDesktop, projectFilter]);

  if (isLoading) {
    return (
      <div className='py-12 flex items-center justify-center'>
        <div className='h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin'></div>
        <span className='ml-3 text-muted-foreground text-sm'>Loading...</span>
      </div>
    );
  }

  if (error || !projects || projects.length === 0) {
    return (
      <div className='py-12 text-center text-muted-foreground'>
        <p>No projects found.</p>
      </div>
    );
  }

  // Filter projects based on the selected filter
  const filteredProjects = projects.filter((project) =>
    projectFilter === 'recent' ? !project.legacy : project.legacy
  );

  const generateGradient = (title: string) => {
    const hash = title.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const hue = Math.abs(hash % 360);

    return {
      background: `linear-gradient(135deg, hsla(${hue}, 70%, 40%, 0.8), hsla(${
        (hue + 40) % 360
      }, 70%, 40%, 0.4))`,
      color: `hsl(${hue}, 80%, 85%)`,
    };
  };

  const handleProjectClick = (projectId: string, index: number) => {
    const currentSelected = selectedProject === projectId ? null : projectId;
    setSelectedProject(currentSelected);

    const element = projectRefs.current[index];
    if (currentSelected && element) {
      setTimeout(() => {
        if (!isDesktop) {
          const elementRect = element.getBoundingClientRect();
          const offset = window.innerHeight * 0.1;
          const targetScrollY = window.scrollY + elementRect.top - offset;

          window.scrollTo({
            top: targetScrollY,
            behavior: 'smooth',
          });
        } else {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }, 50);
    }
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Helper function to get localized title
  const getLocalizedTitle = (project: ProjectData) => {
    return isJapanese && project.titleJa ? project.titleJa : project.title;
  };

  // Function to get the first letter of the title for the fallback image
  const getTitleFirstLetter = (project: ProjectData) => {
    const title = getLocalizedTitle(project);
    return title[0].toUpperCase();
  };

  return (
    <div className='relative gap-x-8 min-h-[50vh]'>
      {/* Project filter toggle */}
      <div className='flex justify-start mb-8 pl-16 md:pl-28'>
        <div className='relative h-8'>
          <AnimatePresence mode='wait' initial={false}>
            {projectFilter === 'recent' ? (
              <motion.div
                key='recent'
                className='flex items-center gap-2 absolute cursor-pointer'
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setProjectFilter('legacy')}>
                <span className='text-foreground'>Legacy</span>
                <ArrowRightIcon className='h-4 w-4 text-primary ml-1' />
              </motion.div>
            ) : (
              <motion.div
                key='legacy'
                className='flex items-center gap-2 absolute cursor-pointer'
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                onClick={() => setProjectFilter('recent')}>
                <ArrowLeftIcon className='h-4 w-4 text-primary mr-1' />
                <span className='text-foreground'>Recent</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.div
        className='md:col-span-5 relative z-20 pl-16 md:pl-28 h-fit'
        variants={listVariants}
        initial='hidden'
        animate='visible'>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              ref={(el) => {
                projectRefs.current[index] = el;
              }}
              initial='hidden'
              animate='visible'
              variants={itemVariants}
              className='relative mb-8 cursor-pointer'>
              {isDesktop && (
                <div className='absolute right-0 top-[50%] -translate-y-1/2 z-20'>
                  <AnimatePresence mode='wait'>
                    {selectedProject && selectedProject === project.id && (
                      <motion.div
                        key={selectedProject}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className='relative bg-background/20 backdrop-blur-md p-6 rounded-sm border border-muted/20 shadow-sm w-[750px] z-50 isolate-blur'>
                        <div key={project.id}>
                          <div className='aspect-video rounded overflow-hidden mb-6 shadow-lg border border-muted/10'>
                            {project.imageUrl ? (
                              <img
                                src={project.imageUrl}
                                alt={getLocalizedTitle(project)}
                                className='w-full h-full object-cover'
                              />
                            ) : (
                              <div
                                className='w-full h-full flex items-center justify-center'
                                style={generateGradient(
                                  getLocalizedTitle(project)
                                )}>
                                <span className='text-4xl font-light'>
                                  {getTitleFirstLetter(project)}
                                </span>
                              </div>
                            )}
                          </div>

                          <p className='text-muted-foreground text-base mb-6 leading-relaxed line-clamp-3'>
                            {isJapanese && project.descriptionJa
                              ? project.descriptionJa
                              : project.description}
                          </p>
                          <Link
                            to={`/project/${project.slug}`}
                            className='group inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors'>
                            <span>
                              {isJapanese
                                ? 'プロジェクトを見る'
                                : 'View Project'}
                            </span>
                            <ArrowRightIcon className='w-4 h-4 transition-transform group-hover:translate-x-1' />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
              <div className='absolute -left-8 md:-left-12 top-1 opacity-60'>
                <span className='text-xs font-mono text-primary'>
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className={`group block py-1`}>
                <motion.h3
                  className={`text-2xl font-light transition-all duration-300 max-w-[200px] mb-2 ${
                    selectedProject === project.id
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                  }}
                  animate={{
                    fontSize:
                      selectedProject === project.id ? '2rem' : '1.5rem',
                    x: selectedProject === project.id && isDesktop ? 8 : 0,
                  }}
                  onClick={() => handleProjectClick(project.id, index)}>
                  {getLocalizedTitle(project)}
                </motion.h3>

                {project.tags && project.tags.length > 0 && (
                  <motion.div
                    className='flex flex-wrap gap-2 max-w-[250px]'
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: 0.1 * index + 0.2, // Slight delay after the title
                    }}>
                    {project.tags.map((tag, tagIndex) => (
                      <motion.span
                        key={`${project.id}-${tag}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: 0.05 * tagIndex + (0.1 * index + 0.3), // Additional delay for each tag
                        }}
                        className='text-xs text-muted-foreground inline-block'>
                        #{tag}
                      </motion.span>
                    ))}
                  </motion.div>
                )}
              </div>

              {!isDesktop && (
                <AnimatePresence>
                  {selectedProject === project.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className='mt-4 overflow-hidden'>
                      <div className='aspect-video rounded-md overflow-hidden mb-6 shadow-sm'>
                        {project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={getLocalizedTitle(project)}
                            className='w-full h-full object-cover'
                          />
                        ) : (
                          <div
                            className='w-full h-full flex items-center justify-center'
                            style={generateGradient(
                              getLocalizedTitle(project)
                            )}>
                            <span className='text-4xl font-light'>
                              {getTitleFirstLetter(project)}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className='text-muted-foreground text-base mb-6 leading-relaxed'>
                        {isJapanese && project.descriptionJa
                          ? project.descriptionJa
                          : project.description}
                      </p>

                      <Link to={`/project/${project.slug}`} className='block'>
                        <div className='mt-4 mb-8 flex justify-end'>
                          <motion.div
                            className='flex items-center gap-2 text-sm text-primary'
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}>
                            <span>
                              {isJapanese
                                ? 'プロジェクトを見る'
                                : 'View project'}
                            </span>
                            <svg
                              xmlns='http://www.w3.org/2000/svg'
                              width='16'
                              height='16'
                              viewBox='0 0 24 24'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='2'
                              strokeLinecap='round'
                              strokeLinejoin='round'>
                              <path d='M5 12h14'></path>
                              <path d='m12 5 7 7-7 7'></path>
                            </svg>
                          </motion.div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </motion.div>
          ))
        ) : (
          <div className='py-8 text-muted-foreground'>
            <p>No {projectFilter} projects available.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

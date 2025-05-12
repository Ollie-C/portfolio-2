import { useState, useEffect, useRef } from 'react';
import { useProjects } from '../hooks/useProjects';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { SquareArrowOutUpRight } from 'lucide-react';
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
  sourceUrl?: string; // GitHub URL
  demoUrl?: string; // Live demo URL
}

export default function ProjectsList() {
  const { i18n, t } = useTranslation();

  const { data: projects, isLoading, error } = useProjects();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<'recent' | 'legacy'>(
    'recent'
  );
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const projectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: true });
  const isJapanese = i18n.language === 'ja';
  const firstProjectShown = useRef(false);

  // Reset selection when viewport changes or filter changes
  useEffect(() => {
    setSelectedProject(null);
    firstProjectShown.current = false;
  }, [isDesktop, projectFilter]);

  // Auto-focus the first project when section comes into view
  useEffect(() => {
    if (
      isInView &&
      !firstProjectShown.current &&
      isDesktop &&
      projects?.length &&
      projectFilter === 'recent'
    ) {
      const filteredProjects = projects.filter((project) =>
        projectFilter === 'recent' ? !project.legacy : project.legacy
      );

      if (filteredProjects.length > 0) {
        setTimeout(() => {
          setSelectedProject(filteredProjects[0].id);
          firstProjectShown.current = true;
        }, 1000); // Delay to ensure animation is completed
      }
    }
  }, [isInView, projects, isDesktop, projectFilter]);

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
    // If we're clicking the same project that's already selected, just close it
    if (selectedProject === projectId) {
      setSelectedProject(null);
      return;
    }

    const element = projectRefs.current[index];
    // If another project is already open, first close it before opening the new one
    if (selectedProject !== null) {
      // Close current preview
      setSelectedProject(null);

      // Then after a short delay, open the new preview and scroll to it
      setTimeout(() => {
        setSelectedProject(projectId);

        if (element) {
          setTimeout(() => {
            if (!isDesktop) {
              const elementRect = element.getBoundingClientRect();
              const headerOffset = 120;
              const targetScrollY =
                window.scrollY + elementRect.top - headerOffset;

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
          }, 50); // Short delay to allow DOM to update
        }
      }, 300); // Wait for close animation to mostly complete
    } else {
      // No project is currently open, simply open the selected one
      setSelectedProject(projectId);

      if (element) {
        setTimeout(() => {
          if (!isDesktop) {
            const elementRect = element.getBoundingClientRect();
            const headerOffset = 120;
            const targetScrollY =
              window.scrollY + elementRect.top - headerOffset;

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
    <div className='relative gap-x-8 min-h-[50vh] py-10' ref={sectionRef}>
      {/* Project filter toggle */}
      <div className='flex justify-start mb-8 pl-16 md:pl-28'>
        <div className='flex items-center gap-2 text-base'>
          <span
            onClick={() => setProjectFilter('recent')}
            className={`cursor-pointer transition-all duration-200 ${
              projectFilter === 'recent'
                ? 'font-bold text-foreground'
                : 'opacity-50 text-muted-foreground'
            }`}>
            {t('sections.projects.recent')}
          </span>
          <span className='text-muted-foreground mx-1'>/</span>
          <span
            onClick={() => setProjectFilter('legacy')}
            className={`cursor-pointer transition-all duration-200 ${
              projectFilter === 'legacy'
                ? 'font-bold text-foreground'
                : 'opacity-50 text-muted-foreground'
            }`}>
            {t('sections.projects.legacy')}
          </span>
        </div>
      </div>

      {/* Project preview */}
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
              className='relative mb-14 cursor-pointer'>
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 * index,
                  }}>
                  <motion.h3
                    className={`text-2xl font-medium transition-all duration-300 max-w-[240px] mb-2 ${
                      selectedProject === project.id
                        ? 'text-primary'
                        : 'text-foreground'
                    }`}
                    animate={{
                      fontSize:
                        selectedProject === project.id ? '2rem' : '1.5rem',
                      x: selectedProject === project.id && isDesktop ? 8 : 0,
                    }}
                    onClick={() => handleProjectClick(project.id, index)}>
                    {getLocalizedTitle(project)}

                    {/* Add project links */}
                    <span className='inline-flex ml-4 gap-4'>
                      {project.sourceUrl && (
                        <a
                          href={project.sourceUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={(e) => e.stopPropagation()}
                          className='text-muted-foreground hover:text-primary transition-colors'>
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='13'
                            height='13'
                            viewBox='0 0 24 24'
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'>
                            <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                          </svg>
                        </a>
                      )}

                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                          onClick={(e) => e.stopPropagation()}
                          className='text-muted-foreground hover:text-primary transition-colors'>
                          <SquareArrowOutUpRight size={13} />
                        </a>
                      )}
                    </span>
                  </motion.h3>

                  {project.tags && project.tags.length > 0 && (
                    <div className='flex flex-wrap gap-2 max-w-[250px]'>
                      {project.tags.map((tag, tagIndex) => (
                        <motion.span
                          key={`${project.id}-${tag}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: 0.05 * tagIndex,
                          }}
                          className='text-xs text-muted-foreground inline-block'>
                          #{tag}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </motion.div>
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
                        <div className='mt-4 mb-8 flex justify-start'>
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

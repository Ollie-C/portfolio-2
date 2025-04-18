import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout/Layout';
import { useProject, useProjects } from '../hooks/useProjects';
import { SparklesIcon } from '@heroicons/react/24/outline';

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const isJapanese = currentLanguage === 'ja';

  // Fetch current project data
  const {
    data: project,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useProject(slug || '');
  // Fetch all projects data for navigation
  const {
    data: allProjects,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useProjects();

  // Memoize calculation of prev/next slugs
  const { prevSlug, nextSlug } = useMemo(() => {
    if (!project || !allProjects || allProjects.length === 0) {
      return { prevSlug: null, nextSlug: null };
    }
    const currentIndex = allProjects.findIndex((p) => p.slug === project.slug);
    if (currentIndex === -1) {
      return { prevSlug: null, nextSlug: null };
    }

    const prevIndex =
      (currentIndex - 1 + allProjects.length) % allProjects.length;
    const nextIndex = (currentIndex + 1) % allProjects.length;

    return {
      prevSlug: allProjects[prevIndex]?.slug,
      nextSlug: allProjects[nextIndex]?.slug,
    };
  }, [project, allProjects]);

  // State for the lightbox and view mode
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Filter images based on view mode
  const getFilteredImages = () => {
    if (!project) return [];

    switch (viewMode) {
      case 'desktop':
        return project.desktopImages.length > 0 ? project.desktopImages : [];
      case 'mobile':
        return project.mobileImages.length > 0 ? project.mobileImages : [];
      default:
        return project.desktopImages.length > 0 ? project.desktopImages : [];
    }
  };

  const filteredImages = getFilteredImages();

  const handleBackClick = () => {
    navigate('/', { state: { scrollTo: 'projects' } });
  };

  // Combine loading states
  const isLoading = isLoadingCurrent || isLoadingAll;
  // Combine errors (simplified)
  const error = errorCurrent || errorAll || (!isLoading && !project);

  // Function to get localized content
  const getLocalizedContent = (
    enContent: string | undefined,
    jaContent: string | undefined
  ) => {
    if (isJapanese && jaContent) {
      return jaContent;
    }
    return enContent || '';
  };

  if (isLoading) {
    return (
      <Layout>
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className='min-h-[60vh] flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold mb-4'>Project not found</h2>
          <p className='text-muted-foreground mb-8'>
            Maybe it exists in another dimension?
          </p>
          <button
            onClick={handleBackClick}
            className='bg-accent text-white px-6 py-2 rounded-md hover:bg-accent-dark transition-colors'>
            {t('projectPage.back')}
          </button>
        </div>
      </Layout>
    );
  }

  if (!project) return null;

  // Define animation variants for page sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <Layout>
      <motion.div
        className='max-w-6xl mx-auto px-5 pt-10 pb-20'
        variants={containerVariants}
        initial='hidden'
        animate='visible'>
        {/* Back button */}
        <motion.div
          className='flex items-center gap-2 text-sm text-primary mb-20 cursor-pointer'
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackClick}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            className='rotate-180'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M5 12h14'></path>
            <path d='m12 5 7 7-7 7'></path>
          </svg>
          <span>{t('projectPage.back')}</span>
        </motion.div>

        {/* Project header */}
        <motion.header variants={itemVariants} className='mb-16'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12'>
            <div className='space-y-6'>
              <div className='space-x-4'>
                <span className='font-mono text-primary text-sm tracking-wider'>
                  PROJECT /
                </span>
                <h1 className='text-4xl md:text-5xl font-light mt-2 inline-block relative'>
                  {getLocalizedContent(project.title, project.titleJa)}
                  <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                </h1>
              </div>

              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className='flex flex-wrap gap-2'>
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className='px-3 py-1 text-sm rounded-md bg-muted text-foreground backdrop-blur-sm border border-muted/50'>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className='flex gap-3'>
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center px-3 py-2 font-medium text-white bg-accent hover:bg-accent-dark rounded-md transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3' />
                  </svg>
                </motion.a>
              )}
              {project.sourceUrl && (
                <motion.a
                  href={project.sourceUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center px-5 py-2 font-medium text-gray-300 bg-base-dark hover:bg-base-dark/80 rounded-md transition-colors border border-gray-700'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='mr-2'>
                    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                  </svg>
                  Github
                </motion.a>
              )}
            </div>
          </div>
        </motion.header>

        {/* Project overview */}
        <motion.section variants={itemVariants} className='mb-20'>
          <div className='grid grid-cols-1 md:grid-cols-6 gap-8 items-start'>
            <div className='md:col-span-2'>
              <div className='space-x-4'>
                <span className='font-mono text-primary text-sm tracking-wider'>
                  001 /
                </span>
                <h2 className='text-3xl font-light mt-2 inline-block relative'>
                  {t('projectPage.overview')}
                  <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                </h2>
              </div>
            </div>

            <div className='md:col-span-4 text-muted-foreground'>
              {project.summary && (
                <p className='text-lg leading-relaxed font-medium mb-4'>
                  {getLocalizedContent(project.summary, project.summaryJa)}
                </p>
              )}

              {project.description && (
                <p className='text-lg leading-relaxed'>
                  {getLocalizedContent(
                    project.description,
                    project.descriptionJa
                  )}
                </p>
              )}
              {project.note && (
                <p className='text-sm text-muted-foreground italic mt-4'>
                  <span className='font-bold'>NOTE: </span>
                  {getLocalizedContent(project.note, project.noteJa)}
                </p>
              )}
            </div>
          </div>
        </motion.section>

        {/* Technical details */}
        <motion.section variants={itemVariants} className='mb-20'>
          <div className='grid grid-cols-1 md:grid-cols-6 gap-8 items-start'>
            <div className='md:col-span-2'>
              <div className='space-x-4'>
                <span className='font-mono text-primary text-sm tracking-wider'>
                  002 /
                </span>
                <h2 className='text-3xl font-light mt-2 inline-block relative'>
                  {t('projectPage.details')}
                  <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                </h2>
              </div>
            </div>

            <div className='md:col-span-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
                {/* Tech Stack */}
                {project.techStack && project.techStack.length > 0 && (
                  <div>
                    <h3 className='text-xl font-medium mb-4'>
                      {t('projectPage.techStack')}
                    </h3>
                    <div className='grid grid-cols-2 gap-3'>
                      {project.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className='px-3 py-1 bg-base-dark rounded-md text-foreground border border-muted/50'>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Features */}
                {((project.features && project.features.length > 0) ||
                  (isJapanese &&
                    project.featuresJa &&
                    project.featuresJa.length > 0)) && (
                  <div>
                    <h3 className='text-xl font-medium mb-4'>
                      {t('projectPage.keyFeatures')}
                    </h3>
                    <ul className='space-y-2'>
                      {(isJapanese && project.featuresJa
                        ? project.featuresJa
                        : project.features
                      )?.map((feature, index) => (
                        <li key={index} className='flex items-start gap-3'>
                          <SparklesIcon className='w-5 h-5 text-primary mt-0.5 flex-shrink-0' />
                          <span className='text-muted-foreground'>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Image gallery */}
        {(project.desktopImages.length > 0 ||
          project.mobileImages.length > 0) && (
          <motion.section variants={itemVariants} className='mb-20'>
            <div className='grid grid-cols-1 md:grid-cols-6 gap-8 items-start'>
              <div className='md:col-span-2'>
                <div className='space-x-4'>
                  <span className='font-mono text-primary text-sm tracking-wider'>
                    003 /
                  </span>
                  <h2 className='text-3xl font-light mt-2 inline-block relative'>
                    {t('projectPage.gallery')}
                    <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                  </h2>
                </div>

                {/* View toggle */}
                <div className='mt-8 flex bg-base-dark/90 rounded-md border border-muted p-1 md:w-fit'>
                  {project.desktopImages &&
                    project.desktopImages.length > 0 && (
                      <button
                        onClick={() => setViewMode('desktop')}
                        className={`px-4 py-1.5 text-sm rounded ${
                          viewMode === 'desktop'
                            ? 'bg-accent text-white'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}>
                        {t('projectPage.desktop')}
                      </button>
                    )}
                  {project.mobileImages && project.mobileImages.length > 0 && (
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`px-4 py-1.5 text-sm rounded ${
                        viewMode === 'mobile'
                          ? 'bg-accent text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}>
                      {t('projectPage.mobile')}
                    </button>
                  )}
                </div>
              </div>

              <div className='md:col-span-4'>
                <div
                  className={`grid gap-4 ${
                    viewMode === 'mobile'
                      ? 'grid-cols-3 md:grid-cols-4'
                      : 'grid-cols-1 md:grid-cols-2'
                  }`}>
                  {filteredImages.map((image, index) => (
                    <motion.div
                      key={`${image.url}-${index}`}
                      className={`relative overflow-hidden rounded-md cursor-pointer group ${
                        viewMode === 'desktop' && 'aspect-video'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setActiveImageUrl(image.url)}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}>
                      <img
                        src={image.url}
                        alt={image.alt || `Project image ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                      <div className='absolute inset-0 bg-base-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='24'
                          height='24'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          className='text-white'>
                          <path d='M15 3h6v6M14 10l6-6M9 21H3v-6M10 14l-6 6' />
                        </svg>
                      </div>
                      {image.caption && (
                        <div className='absolute bottom-0 left-0 right-0 p-2 bg-base-dark/70 text-xs text-white'>
                          {image.caption}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Prev/Next Navigation */}
        <motion.div
          variants={itemVariants}
          className='pt-16 mt-16 border-t border-muted/20 grid grid-cols-2 gap-4'>
          <div>
            {prevSlug && (
              <Link
                to={`/project/${prevSlug}`}
                className='group inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='mr-2 transition-transform group-hover:-translate-x-1'>
                  <polyline points='15 18 9 12 15 6' />
                </svg>
                {t('projectPage.previousProject')}
              </Link>
            )}
          </div>
          <div>
            {nextSlug && (
              <Link
                to={`/project/${nextSlug}`}
                className='group inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors'>
                {t('projectPage.nextProject')}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  height='18'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='ml-2 transition-transform group-hover:translate-x-1'>
                  <polyline points='9 18 15 12 9 6' />
                </svg>
              </Link>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Image lightbox */}
      {activeImageUrl && (
        <div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
          onClick={() => setActiveImageUrl(null)}>
          <div className='relative max-w-6xl max-h-[90vh]'>
            <button
              className='absolute top-4 right-4 text-white p-2 rounded-full bg-black/50'
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageUrl(null);
              }}>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <line x1='18' y1='6' x2='6' y2='18'></line>
                <line x1='6' y1='6' x2='18' y2='18'></line>
              </svg>
            </button>
            <img
              src={activeImageUrl}
              alt='Enlarged view'
              className='max-h-[90vh] max-w-full object-contain'
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProjectPage;

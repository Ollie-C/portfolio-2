import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout/Layout';
import { useProject, useProjects } from '../hooks/useProjects';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  SquareArrowOutUpRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectFade } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/effect-fade';

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const isJapanese = currentLanguage === 'ja';

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  // Add a useEffect to handle the case when project is not found
  useEffect(() => {
    if (!isLoadingCurrent && !project && !errorCurrent) {
      // This means the project wasn't found, but we're not in error state yet
      // Wait a bit to make sure it's not just loading delay
      const timer = setTimeout(() => {
        if (!project) {
          navigate('/'); // Redirect to home when project not found
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingCurrent, project, errorCurrent, navigate]);

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
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeImageType, setActiveImageType] = useState<'desktop' | 'mobile'>(
    'desktop'
  );
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);

  // Function to open lightbox
  const openLightbox = (
    imageUrl: string,
    index: number,
    type: 'desktop' | 'mobile'
  ) => {
    setActiveImageUrl(imageUrl);
    setActiveImageIndex(index);
    setActiveImageType(type);
  };

  // Navigation functions for lightbox
  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images =
      activeImageType === 'desktop'
        ? project?.desktopImages || []
        : project?.mobileImages || [];

    if (images.length <= 1) return;

    const newIndex = (activeImageIndex - 1 + images.length) % images.length;
    setActiveImageIndex(newIndex);
    setActiveImageUrl(images[newIndex].url);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images =
      activeImageType === 'desktop'
        ? project?.desktopImages || []
        : project?.mobileImages || [];

    if (images.length <= 1) return;

    const newIndex = (activeImageIndex + 1) % images.length;
    setActiveImageIndex(newIndex);
    setActiveImageUrl(images[newIndex].url);
  };

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
        <SEO
          title='Loading Project | Ollie Cross'
          description='Loading project details...'
        />
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO
          title='Project Not Found | Ollie Cross'
          description='The requested project could not be found.'
        />
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

  // Generate SEO metadata for the project
  const projectTitle = getLocalizedContent(project.title, project.titleJa);
  const projectDescription =
    getLocalizedContent(project.summary, project.summaryJa) ||
    getLocalizedContent(project.description, project.descriptionJa);
  const projectKeywords = [
    ...(project.techStack || []),
    ...(project.tags || []),
    'project',
    'portfolio',
    'web development',
    'ollie cross',
  ];
  const projectImage =
    project.desktopImages?.[0]?.url ||
    project.mobileImages?.[0]?.url ||
    '/og-image.jpg';

  // Structured data for the project
  const projectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectTitle,
    description: projectDescription,
    author: {
      '@type': 'Person',
      name: 'Ollie Cross',
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    url: `https://olliecross.dev/project/${project.slug}`,
    ...(project.demoUrl && { url: project.demoUrl }),
    ...(project.sourceUrl && { codeRepository: project.sourceUrl }),
    ...(project.techStack && {
      about: project.techStack.map((tech) => ({
        '@type': 'Thing',
        name: tech,
      })),
    }),
    ...(projectImage && { image: projectImage }),
  };

  const hasDesktopImages =
    project.desktopImages && project.desktopImages.length > 0;
  const hasMobileImages =
    project.mobileImages && project.mobileImages.length > 0;

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

  const expandVariants = {
    hidden: { opacity: 0, height: 0, overflow: 'hidden' },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: { duration: 0.3 },
    },
  };

  return (
    <Layout>
      <SEO
        title={`${projectTitle} | Ollie Cross`}
        description={projectDescription}
        keywords={projectKeywords}
        image={projectImage}
        url={`https://olliecross.dev/project/${project.slug}`}
        type='article'
        publishedTime={project.createdAt}
        modifiedTime={project.updatedAt}
        section='Projects'
        tags={project.tags || []}
        structuredData={projectStructuredData}
      />
      {/* Custom styles for Swiper navigation */}
      <style>
        {`
          .swiper-button-next,
          .swiper-button-prev {
            color: var(--color-primary);
            background: rgba(0, 0, 0, 0.3);
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 16px;
            font-weight: bold;
          }
          
          .gallery-container {
            display: flex;
            flex-direction: column;
            align-items: stretch;
          }
          
          @media (min-width: 768px) {
            .gallery-container {
              flex-direction: row;
              height: 400px;
            }
            
            .desktop-container {
              height: 100%;
              width: 80%;
            }
            
            .mobile-container {
              height: 100%;
              width: 20%;
            }
            
            .swiper {
              height: 100%;
            }
            
            .swiper-slide {
              height: 100%;
            }
          }
        `}
      </style>
      <motion.div
        className='max-w-6xl mx-auto px-5 pt-10 pb-20 section-bg-dark'
        variants={containerVariants}
        initial='hidden'
        animate='visible'>
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Projects', href: '/#projects' },
            { label: projectTitle },
          ]}
        />

        {/* Navigation controls - Back button and project navigation */}
        <motion.div className='flex items-center justify-between mb-10'>
          {/* Back button */}
          <motion.div
            className='flex items-center gap-2 text-sm text-primary cursor-pointer'
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

          {/* Project navigation */}
          <div className='flex items-center gap-6'>
            {prevSlug && (
              <Link
                to={`/project/${prevSlug}`}
                className='group inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
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
            {nextSlug && (
              <Link
                to={`/project/${nextSlug}`}
                className='group inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors'>
                {t('projectPage.nextProject')}
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='16'
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

        {/* Image Gallery Carousels at the top */}
        {(hasDesktopImages || hasMobileImages) && (
          <motion.section variants={itemVariants} className='mb-16'>
            <div className='gallery-container gap-4'>
              {/* Desktop Carousel - 80% width */}
              {hasDesktopImages && (
                <div className='desktop-container w-full'>
                  <Swiper
                    modules={[Navigation, EffectFade]}
                    effect='fade'
                    navigation={true}
                    grabCursor={true}
                    slidesPerView={1}
                    className='w-full h-full'>
                    {project.desktopImages.map((image, index) => (
                      <SwiperSlide key={`desktop-${index}`}>
                        <div
                          className='relative w-full h-full cursor-pointer'
                          onClick={() =>
                            openLightbox(image.url, index, 'desktop')
                          }>
                          <img
                            src={image.url}
                            alt={image.alt || `Desktop view ${index + 1}`}
                            className='w-full h-full object-cover'
                          />
                          <div className='absolute inset-0 bg-base-dark/20 opacity-0 hover:opacity-100 transition-opacity'></div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className='mt-2 text-sm text-muted-foreground'>
                    {t('projectPage.desktop')}
                  </div>
                </div>
              )}

              {/* Mobile Carousel - 20% width */}
              {hasMobileImages && (
                <div className='mobile-container w-full'>
                  <Swiper
                    modules={[Navigation, EffectFade]}
                    effect='fade'
                    navigation={true}
                    grabCursor={true}
                    slidesPerView={1}
                    className='w-full h-full'>
                    {project.mobileImages.map((image, index) => (
                      <SwiperSlide key={`mobile-${index}`}>
                        <div
                          className='relative w-full h-full cursor-pointer'
                          onClick={() =>
                            openLightbox(image.url, index, 'mobile')
                          }>
                          <img
                            src={image.url}
                            alt={image.alt || `Mobile view ${index + 1}`}
                            className='w-full h-full object-cover object-center'
                          />
                          <div className='absolute inset-0 bg-base-dark/20 opacity-0 hover:opacity-100 transition-opacity'></div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                  <div className='mt-2 text-sm text-muted-foreground'>
                    {t('projectPage.mobile')}
                  </div>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Project header */}
        <motion.header variants={itemVariants} className='mb-10'>
          <div className='flex items-center justify-between gap-4 mb-8'>
            <div className='space-x-4 mt-4'>
              <span className='font-mono text-primary text-sm tracking-wider'>
                PROJECT /
              </span>
              <h1 className='text-4xl md:text-5xl font-light inline-block relative'>
                {getLocalizedContent(project.title, project.titleJa)}
                <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
              </h1>
            </div>

            <div className='flex gap-3'>
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center p-2 px-3 font-medium text-sm text-gray-300 bg-card text-primary hover:bg-base-dark/80 rounded-md transition-colors border border-gray-700'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
                  <SquareArrowOutUpRight size={16} />
                </motion.a>
              )}
              {project.sourceUrl && (
                <motion.a
                  href={project.sourceUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center justify-center p-2 px-3 font-medium text-sm text-gray-300 bg-card text-primary hover:bg-base-dark/80 rounded-md transition-colors border border-gray-700'
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}>
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
                    <path d='M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22' />
                  </svg>
                </motion.a>
              )}
            </div>
          </div>

          {/* Project Details Toggle Button */}
          <motion.button
            className='w-full flex items-center justify-center gap-2 py-3 px-4 bg-card hover:bg-card/80 text-primary border border-border rounded-md transition-colors'
            onClick={() => setDetailsExpanded(!detailsExpanded)}
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}>
            {detailsExpanded ? (
              <>
                <span>{t('projectPage.hideDetails') || 'Hide Details'}</span>
                <ChevronUp size={18} />
              </>
            ) : (
              <>
                <span>{t('projectPage.showDetails') || 'Show Details'}</span>
                <ChevronDown size={18} />
              </>
            )}
          </motion.button>
        </motion.header>

        {/* Expandable Project Details */}
        <AnimatePresence>
          {detailsExpanded && (
            <motion.div
              variants={expandVariants}
              initial='hidden'
              animate='visible'
              exit='hidden'>
              {/* Project overview */}
              <motion.section variants={itemVariants} className='mb-20'>
                <div className='grid grid-cols-1 md:grid-cols-6 gap-8 items-start'>
                  <div className='md:col-span-2'>
                    <div className='space-x-4'>
                      <span className='font-mono text-primary text-sm tracking-wider'>
                        001 /
                      </span>
                      <h2 className='text-3xl font-light inline-block relative'>
                        {t('projectPage.overview')}
                        <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                      </h2>
                    </div>
                  </div>

                  <div className='md:col-span-4 text-muted-foreground'>
                    {project.summary && (
                      <p className='text-lg leading-relaxed font-medium mb-4'>
                        {getLocalizedContent(
                          project.summary,
                          project.summaryJa
                        )}
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
                          <div className='grid grid-cols-2 md:grid-cols-1 gap-3'>
                            {project.techStack.map((tech, index) => (
                              <span
                                key={index}
                                className='px-3 py-1 bg-base-dark rounded text-foreground border border-border'>
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
                          <ul className='space-y-5'>
                            {(isJapanese && project.featuresJa
                              ? project.featuresJa
                              : project.features
                            )?.map((feature, index) => (
                              <li
                                key={index}
                                className='flex items-center gap-8'>
                                <span className='text-sm'>
                                  {' '}
                                  {String(index + 1).padStart(2, '0')}
                                </span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Image lightbox */}
      {activeImageUrl && (
        <div
          className='fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4'
          onClick={() => setActiveImageUrl(null)}>
          <div className='relative max-w-6xl max-h-[90vh]'>
            <button
              className='absolute top-4 right-4 text-white p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors'
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

            {/* Previous image button */}
            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors'
              onClick={showPrevImage}>
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
                <polyline points='15 18 9 12 15 6'></polyline>
              </svg>
            </button>

            {/* Next image button */}
            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors'
              onClick={showNextImage}>
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
                <polyline points='9 18 15 12 9 6'></polyline>
              </svg>
            </button>

            {/* Image counter */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm'>
              {activeImageIndex + 1} /{' '}
              {activeImageType === 'desktop'
                ? project.desktopImages.length
                : project.mobileImages.length}
            </div>

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

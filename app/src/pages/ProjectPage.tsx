import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout/Layout';
import { useProject, useProjects } from '../hooks/useProjects';
import SEO from '../components/SEO';
import Breadcrumbs from '../components/Breadcrumbs';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
import 'swiper/css/pagination';

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const isJapanese = currentLanguage === 'ja';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const {
    data: project,
    isLoading: isLoadingCurrent,
    error: errorCurrent,
  } = useProject(slug || '');
  const {
    data: allProjects,
    isLoading: isLoadingAll,
    error: errorAll,
  } = useProjects();

  useEffect(() => {
    if (!isLoadingCurrent && !project && !errorCurrent) {
      const timer = setTimeout(() => {
        if (!project) {
          navigate('/');
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoadingCurrent, project, errorCurrent, navigate]);

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

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [activeImageType, setActiveImageType] = useState<'desktop' | 'mobile'>(
    'desktop'
  );

  const openLightbox = (
    imageUrl: string,
    index: number,
    type: 'desktop' | 'mobile'
  ) => {
    setActiveImageUrl(imageUrl);
    setActiveImageIndex(index);
    setActiveImageType(type);
  };

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

  const isLoading = isLoadingCurrent || isLoadingAll;
  const error = errorCurrent || errorAll || (!isLoading && !project);

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
          title='Loading Project | tom name'
          description='Loading project details...'
        />
        <div className='flex items-center justify-center min-h-[60vh]'>
          <div className='w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin'></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <SEO
          title='Project Not Found | tom name'
          description='The requested project could not be found.'
        />
        <div className='min-h-[60vh] flex flex-col items-center justify-center'>
          <h2 className='text-2xl font-light mb-4'>Project not found</h2>
          <p className='text-muted-foreground mb-8'>
            Maybe it exists in another dimension?
          </p>
          <button
            onClick={handleBackClick}
            className='text-primary hover:text-primary/80 transition-colors flex items-center gap-2'>
            <ArrowLeft size={16} />
            {t('projectPage.back')}
          </button>
        </div>
      </Layout>
    );
  }

  if (!project) return null;

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
    'tom name',
  ];
  const projectImage =
    project.desktopImages?.[0]?.url ||
    project.mobileImages?.[0]?.url ||
    '/og-image.jpg';

  const projectStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: projectTitle,
    description: projectDescription,
    author: {
      '@type': 'Person',
      name: 'tom name',
    },
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    url: `https://tomname.dev/project/${project.slug}`,
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

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <Layout>
      <SEO
        title={`${projectTitle} | tom name`}
        description={projectDescription}
        keywords={projectKeywords}
        image={projectImage}
        url={`https://tomname.dev/project/${project.slug}`}
        type='article'
        publishedTime={project.createdAt}
        modifiedTime={project.updatedAt}
        section='Projects'
        tags={project.tags || []}
        structuredData={projectStructuredData}
      />

      <style>
        {`
          .swiper-pagination {
            bottom: 20px !important;
          }
          
          .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.5);
            opacity: 1;
            width: 6px;
            height: 6px;
          }
          
          .swiper-pagination-bullet-active {
            background: white;
            width: 24px;
            border-radius: 3px;
          }
          
          .swiper-button-next,
          .swiper-button-prev {
            color: white;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            backdrop-filter: blur(4px);
            transition: all 0.3s ease;
          }
          
          .swiper-button-next:hover,
          .swiper-button-prev:hover {
            background: rgba(0, 0, 0, 0.7);
          }
          
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 16px;
            font-weight: bold;
          }
          
          @media (max-width: 768px) {
            .swiper-button-next,
            .swiper-button-prev {
              display: none;
            }
          }
        `}
      </style>

      <motion.div initial='initial' animate='animate' className='min-h-screen'>
        {/* Header Section */}
        <div className='max-w-6xl mx-auto px-5 pt-10 pb-8'>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/#projects' },
              { label: projectTitle },
            ]}
          />

          {/* Navigation */}
          <motion.div
            {...fadeIn}
            className='flex items-center justify-between mt-8 mb-12'>
            <div className='flex items-center justify-end w-full gap-6'>
              {prevSlug && (
                <Link
                  to={`/project/${prevSlug}`}
                  className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'>
                  <ChevronLeft size={14} />
                  {t('projectPage.previousProject')}
                </Link>
              )}
              {nextSlug && (
                <Link
                  to={`/project/${nextSlug}`}
                  className='text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2'>
                  {t('projectPage.nextProject')}
                  <ChevronRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>

          {/* Title and Links */}
          <motion.div {...fadeIn} transition={{ delay: 0.1 }} className='mb-12'>
            <h1 className='text-5xl md:text-6xl font-light mb-6'>
              {getLocalizedContent(project.title, project.titleJa)}
            </h1>

            {project.summary && (
              <p className='text-xl text-muted-foreground font-light max-w-3xl mb-8'>
                {getLocalizedContent(project.summary, project.summaryJa)}
              </p>
            )}

            <div className='flex gap-4'>
              {project.demoUrl && (
                <motion.a
                  href={project.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors'
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}>
                  <ExternalLink size={16} />
                  Live Demo
                </motion.a>
              )}
              {project.sourceUrl && (
                <motion.a
                  href={project.sourceUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors'
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.98 }}>
                  <Github size={16} />
                  Source Code
                </motion.a>
              )}
            </div>
          </motion.div>
        </div>

        {/* Full-width Image Gallery */}
        {(hasDesktopImages || hasMobileImages) && (
          <motion.section
            {...fadeIn}
            transition={{ delay: 0.2 }}
            className='w-full mb-20'>
            <div className='flex flex-col md:flex-row gap-4 max-w-7xl xl:max-w-screen-2xl mx-auto'>
              {/* Desktop Images */}
              {hasDesktopImages && (
                <div className='w-full md:w-3/4'>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={true}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    className='w-full aspect-video bg-base-dark'>
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
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}

              {/* Mobile Images */}
              {hasMobileImages && (
                <div className='w-full md:w-1/4 overflow-hidden'>
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={true}
                    pagination={{ clickable: true }}
                    spaceBetween={0}
                    slidesPerView={1}
                    className='w-full aspect-[9/16] bg-base-dark'>
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
                            className='w-full h-full object-cover object-top'
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Project Details */}
        <div className='max-w-6xl mx-auto px-5 pb-20'>
          {/* Description */}
          {project.description && (
            <motion.section
              {...fadeIn}
              transition={{ delay: 0.3 }}
              className='mb-16'>
              <h2 className='text-sm font-mono text-muted-foreground mb-6'>
                ABOUT
              </h2>
              <p className='text-lg leading-relaxed text-foreground/80 max-w-3xl'>
                {getLocalizedContent(
                  project.description,
                  project.descriptionJa
                )}
              </p>
            </motion.section>
          )}

          <div className='grid grid-cols-1 md:grid-cols-2 gap-16'>
            {/* Tech Stack */}
            {project.techStack && project.techStack.length > 0 && (
              <motion.section {...fadeIn} transition={{ delay: 0.4 }}>
                <h2 className='text-sm font-mono text-muted-foreground mb-6'>
                  TECH STACK
                </h2>
                <div className='flex flex-wrap gap-2'>
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className='px-3 py-1.5 text-sm border border-border/50 text-foreground/70 hover:border-border hover:text-foreground transition-colors'>
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Features */}
            {((project.features && project.features.length > 0) ||
              (isJapanese &&
                project.featuresJa &&
                project.featuresJa.length > 0)) && (
              <motion.section {...fadeIn} transition={{ delay: 0.5 }}>
                <h2 className='text-sm font-mono text-muted-foreground mb-6'>
                  KEY FEATURES
                </h2>
                <ul className='space-y-3'>
                  {(isJapanese && project.featuresJa
                    ? project.featuresJa
                    : project.features
                  )?.map((feature, index) => (
                    <li
                      key={index}
                      className='flex items-start gap-3 text-foreground/80'>
                      <span className='text-xs text-muted-foreground mt-1'>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.section>
            )}
          </div>
        </div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {activeImageUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/95 z-50 flex items-center justify-center'
            onClick={() => setActiveImageUrl(null)}>
            <button
              className='absolute top-4 right-4 text-white/70 hover:text-white p-2 transition-colors'
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageUrl(null);
              }}>
              <X size={24} />
            </button>

            <button
              className='absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors'
              onClick={showPrevImage}>
              <ChevronLeft size={32} />
            </button>

            <button
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 transition-colors'
              onClick={showNextImage}>
              <ChevronRight size={32} />
            </button>

            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm'>
              {activeImageIndex + 1} /{' '}
              {activeImageType === 'desktop'
                ? project.desktopImages.length
                : project.mobileImages.length}
            </div>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={activeImageUrl}
              alt='Enlarged view'
              className='max-h-[90vh] max-w-[90vw] object-contain'
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default ProjectPage;

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsList from '../components/ProjectsList';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import SkillsSection from '../components/SkillsSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import TechLearningCard from '../components/TechLearningCard';

// Define learning tech icons
const learningTech = [
  {
    name: 'Svelte',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg',
    progress: 75,
    description: 'Modern frontend framework with excellent performance',
    learningSince: '2024',
    difficulty: 'Intermediate' as const,
  },
  {
    name: 'Three.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
    progress: 60,
    description: '3D graphics library for web applications',
    learningSince: '2024',
    difficulty: 'Advanced' as const,
  },
  {
    name: 'Astro',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
    progress: 85,
    description: 'Static site generator with component islands',
    learningSince: '2023',
    difficulty: 'Intermediate' as const,
  },
];

const ABOUT_SLIDES_COUNT = 4;

export default function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();
  const aboutScrollRef = useRef<HTMLDivElement>(null);
  const [aboutSlideIndex, setAboutSlideIndex] = useState(0);

  // Subtle fade-in animation for content
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  };

  // Staggered children animation
  const staggeredContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.1,
      },
    },
  };

  useEffect(() => {
    if (location.state?.scrollTo) {
      const sectionId = location.state.scrollTo;
      const sectionElement = document.getElementById(sectionId);

      if (sectionElement) {
        const timer = setTimeout(() => {
          // Calculate a better scroll position with offset for header height
          const headerOffset = 100; // Adjust this value as needed
          const elementPosition = sectionElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          // Use scrollTo instead of scrollIntoView for more control
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });

          window.history.replaceState({}, document.title);
        }, 300); // Increased timeout to ensure all content is rendered

        return () => clearTimeout(timer);
      }
    }
  }, [location.state]);

  // Sync about section dot indicator with horizontal scroll position
  useEffect(() => {
    const el = aboutScrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const width = el.clientWidth;
      const index = Math.round(el.scrollLeft / width);
      setAboutSlideIndex(Math.min(index, ABOUT_SLIDES_COUNT - 1));
    };
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Layout>
      <SEO
        title='Ollie Cross | Full-Stack Developer'
        description='Full-stack developer based in London, specializing in React, TypeScript, and modern web technologies. View my projects and get in touch.'
        keywords={[
          'developer',
          'react',
          'typescript',
          'full-stack',
          'web development',
          'portfolio',
          'london',
          'freelance',
          'frontend',
          'backend',
        ]}
        url='https://olliecross.dev'
        type='website'
      />
      <AnimatePresence>
        <main className='flex-grow pt-20 md:pt-28'>
          {/* Hero Section */}
          <section
            id='hero'
            className='container mx-auto px-4 text-center relative'>
            <Hero />
          </section>

          {/* About Section - horizontal scroll, one paragraph per slide */}
          <section
            id='about'
            className='section-bg-light min-h-[100vh] flex flex-col overflow-hidden'>
            <div className='md:px-28 py-8 md:py-12 shrink-0'>
              <div className='container mx-auto px-6 md:px-8'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: '-10%' }}
                  variants={fadeIn}
                  className='space-x-4'>
                  <span className='font-mono text-primary text-sm tracking-wider'>
                    001 /
                  </span>
                  <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
                    {t('sections.about.title')}
                    <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                  </h2>
                </motion.div>
              </div>
            </div>

            <div
              ref={aboutScrollRef}
              className='flex-1 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth flex w-full min-h-0'
              style={{ WebkitOverflowScrolling: 'touch' }}
              role='region'
              aria-label='About me sections'>
              {/* Slide 1: My Journey */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-center justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full flex justify-center'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='max-w-2xl w-full mx-auto text-muted-foreground'>
                    <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.myJourney')}
                    </h3>
                    <p className='text-lg leading-relaxed'>
                      {t('sections.about.paragraph1')}
                    </p>
                    <p className='text-xs text-muted-foreground/70 mt-6 uppercase tracking-widest font-mono'>
                      Scroll or swipe for more →
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Slide 2: Personal Interests */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-center justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full flex justify-center'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='max-w-2xl w-full mx-auto text-muted-foreground'>
                    <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.personalInterests')}
                    </h3>
                    <p className='text-lg leading-relaxed'>
                      {t('sections.about.paragraph2')}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Slide 3: Tech & Projects */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-center justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full flex justify-center'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='max-w-2xl w-full mx-auto text-muted-foreground'>
                    <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.myTech')}
                    </h3>
                    <p className='text-lg leading-relaxed'>
                      {t('sections.about.paragraph3')}
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Slide 4: Currently Learning */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-center justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full flex justify-center'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='max-w-4xl w-full mx-auto'>
                    <h3 className='text-xl font-light text-foreground mb-6 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.currentlyLearning')}
                    </h3>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                      {learningTech.map((tech) => (
                        <TechLearningCard
                          key={tech.name}
                          name={tech.name}
                          icon={tech.icon}
                          progress={tech.progress}
                          description={tech.description}
                          learningSince={tech.learningSince}
                          difficulty={tech.difficulty}
                        />
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Dot indicators - reflect current slide */}
            <div className='shrink-0 py-4 flex justify-center gap-2' aria-hidden>
              {Array.from({ length: ABOUT_SLIDES_COUNT }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === aboutSlideIndex
                      ? 'bg-primary'
                      : 'bg-muted-foreground/40'
                  }`}
                  title={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </section>

          {/* Skills Section */}
          <section
            id='skills'
            className='md:px-28 py-24 section-bg-dark overflow-hidden'>
            <SkillsSection />
          </section>

          {/* Projects Section - Ensure padding is pt-20 pb-32 */}
          <section
            id='projects'
            className='md:px-28 pt-20 pb-48 section-bg-light flex'>
            <div className='container mx-auto px-4 md:px-8 isolate-blur'>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: '-10%' }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { duration: 0.8 } },
                }}
                className='mb-16 space-x-4'>
                <span className='font-mono text-primary text-sm tracking-wider'>
                  003 /
                </span>
                <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
                  {t('sections.projects.title')}
                  <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                </h2>
              </motion.div>
              <ProjectsList />
            </div>
          </section>

          {/* Contact Section */}
          <section
            id='contact'
            className='md:px-28 py-24 min-h-[100vh] flex items-center section-bg-dark'>
            <div className='container mx-auto px-8'>
              <motion.div
                initial='hidden'
                whileInView='visible'
                viewport={{ once: true, margin: '-10%' }}
                variants={staggeredContainer}
                className='grid grid-cols-1 md:grid-cols-6 gap-8 items-start'>
                <div className='md:col-span-2'>
                  <motion.div variants={fadeIn} className='space-x-4'>
                    <span className='font-mono text-primary text-sm tracking-wider'>
                      004 /
                    </span>
                    <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
                      {t('sections.contact.title')}
                      <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                    </h2>
                  </motion.div>
                </div>

                <motion.div variants={fadeIn} className='md:col-span-4'>
                  <p className='text-lg text-muted-foreground leading-relaxed mb-12'>
                    {t('sections.contact.description')}
                  </p>

                  <div className='flex flex-col gap-10'>
                    <div className='md:col-span-3'>
                      <ContactForm />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 my-14'>
                      <a
                        href='https://github.com/Ollie-C'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block group'>
                        <div className='flex items-center gap-4'>
                          <span className='text-primary opacity-60 font-mono text-sm w-20'>
                            GITHUB
                          </span>
                          <span className='h-px w-8 bg-muted-foreground/30'></span>
                          <span className='text-foreground group-hover:text-primary transition-colors'>
                            github.com/Ollie-C
                          </span>
                        </div>
                      </a>

                      <a
                        href='https://linkedin.com/in/oliver-cross'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='block group'>
                        <div className='flex items-center gap-4'>
                          <span className='text-primary opacity-60 font-mono text-sm w-20'>
                            LINKEDIN
                          </span>
                          <span className='h-px w-8 bg-muted-foreground/30'></span>
                          <span className='text-foreground group-hover:text-primary transition-colors'>
                            linkedin.com/in/oliver-cross
                          </span>
                        </div>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>
      </AnimatePresence>
      <Footer />
    </Layout>
  );
}

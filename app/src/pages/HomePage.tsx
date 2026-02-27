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
    name: 'Phoenix',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/phoenix/phoenix-original.svg',
    progress: 60,
    description: "Best dev experience I've had so far.",
    learningSince: '2026',
    difficulty: 'Intermediate' as const,
  },
  {
    name: 'Three.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
    progress: 45,
    description: 'For when I need to get creative.',
    learningSince: '2024',
    difficulty: 'Beginner' as const,
  },
  {
    name: 'Astro',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg',
    progress: 80,
    description: 'So simple, so fast.',
    learningSince: '2025',
    difficulty: 'Intermediate' as const,
  },
];

const ABOUT_SLIDES_COUNT = 3;

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
        <main>
          {/* Hero Section */}
          <section
            id='hero'
            className='container mx-auto px-4 xl:px-8 text-center relative min-h-screen'>
            <Hero />
          </section>

          {/* About Section - horizontal slides, section can extend beyond viewport */}
          <section
            id='about'
            className='section-bg-light min-h-[80vh] flex flex-col'>
            <div className='px-8 xl:px-28 py-8 md:py-12 shrink-0'>
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
              className='overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth flex w-full no-scrollbar'
              style={{ WebkitOverflowScrolling: 'touch' }}
              role='region'
              aria-label='About me sections'>
              {/* Slide 1: My Journey + Personal Interests */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-start justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-5xl mx-auto'>
                    <motion.div
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true }}
                      variants={fadeIn}
                      className='text-muted-foreground'>
                      <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                        <span className='w-6 h-px bg-primary mr-3'></span>
                        {t('sections.about.myJourney')}
                      </h3>
                      <p className='text-lg leading-relaxed'>
                        {t('sections.about.paragraph1')}
                      </p>
                    </motion.div>
                    <motion.div
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true }}
                      variants={fadeIn}
                      className='text-muted-foreground'>
                      <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                        <span className='w-6 h-px bg-primary mr-3'></span>
                        {t('sections.about.personalInterests')}
                      </h3>
                      <p className='text-lg leading-relaxed'>
                        {t('sections.about.paragraph2')}
                      </p>
                    </motion.div>
                  </div>
                  <p className='text-xs text-muted-foreground/70 mt-8 text-center uppercase tracking-widest font-mono'>
                    Scroll or swipe for more →
                  </p>
                </div>
              </div>

              {/* Slide 2: Tech & Projects + Currently Learning */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-start justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full'>
                  <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 max-w-6xl mx-auto'>
                    <motion.div
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true }}
                      variants={fadeIn}
                      className='text-muted-foreground'>
                      <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                        <span className='w-6 h-px bg-primary mr-3'></span>
                        {t('sections.about.myTech')}
                      </h3>
                      <p className='text-lg leading-relaxed'>
                        {t('sections.about.paragraph3')}
                      </p>
                    </motion.div>
                    <motion.div
                      initial='hidden'
                      whileInView='visible'
                      viewport={{ once: true }}
                      variants={fadeIn}>
                      <h3 className='text-xl font-light text-foreground mb-6 flex items-center'>
                        <span className='w-6 h-px bg-primary mr-3'></span>
                        {t('sections.about.currentlyLearning')}
                      </h3>
                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
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

              {/* Slide 3: AI */}
              <div className='min-w-full w-full shrink-0 snap-start snap-always flex items-start justify-center'>
                <div className='container mx-auto px-6 md:px-8 py-8 md:py-12 w-full flex justify-center'>
                  <motion.div
                    initial='hidden'
                    whileInView='visible'
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className='max-w-2xl w-full mx-auto text-muted-foreground'>
                    <h3 className='text-xl font-light text-foreground mb-4 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.ai')}
                    </h3>
                    <p className='text-lg leading-relaxed'>
                      {t('sections.about.paragraph4')}
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Dot indicators */}
            <div
              className='shrink-0 py-4 flex justify-center gap-2'
              aria-hidden>
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
            className='px-8 xl:px-28 py-20 md:py-28 section-bg-dark overflow-hidden'>
            <SkillsSection />
          </section>

          {/* Projects Section - Ensure padding is pt-20 pb-32 */}
          <section
            id='projects'
            className='md:px-28 py-20 md:py-28 section-bg-light flex'>
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
            className='section-bg-dark flex flex-col py-20 md:py-28'>
            <div className='px-8 xl:px-28 py-8 md:py-12 shrink-0'>
              <div className='container mx-auto px-6 md:px-8'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true, margin: '-10%' }}
                  variants={fadeIn}
                  className='space-x-4'>
                  <span className='font-mono text-primary text-sm tracking-wider'>
                    004 /
                  </span>
                  <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
                    {t('sections.contact.title')}
                    <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                  </h2>
                </motion.div>
              </div>
            </div>

            <div className='flex-1 flex items-start justify-center py-12 md:py-16'>
              <div className='container mx-auto px-6 md:px-8 w-full flex justify-center'>
                <motion.div
                  initial='hidden'
                  whileInView='visible'
                  viewport={{ once: true }}
                  variants={fadeIn}
                  className='max-w-3xl w-full mx-auto'>
                  <p className='text-lg text-muted-foreground leading-relaxed mb-12 text-center'>
                    {t('sections.contact.description')}
                  </p>

                  <div className='w-full'>
                    <ContactForm />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </main>
      </AnimatePresence>
      <Footer />
    </Layout>
  );
}

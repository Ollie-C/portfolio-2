import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectsList from '../components/ProjectsList';
import { useTranslation } from 'react-i18next';
import Hero from '../components/Hero';
import SkillsSection from '../components/SkillsSection';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

// Define learning tech icons
const learningTech = [
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  },
  {
    name: 'Three.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const location = useLocation();

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

  return (
    <Layout>
      <AnimatePresence>
        <main className='flex-grow pt-20 md:pt-28'>
          {/* Hero Section */}
          <section
            id='hero'
            className='container mx-auto px-4 text-center relative'>
            <Hero />
          </section>

          {/* About Section */}
          <section
            id='about'
            className='md:px-28 py-24 section-bg-light min-h-[100vh] flex items-center'>
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
                      001 /
                    </span>
                    <h2 className='text-3xl md:text-4xl font-light mt-2 inline-block relative'>
                      {t('sections.about.title')}
                      <span className='absolute -bottom-2 left-0 w-1/3 h-px bg-primary opacity-50'></span>
                    </h2>
                  </motion.div>
                </div>

                <motion.div
                  variants={fadeIn}
                  className='md:col-span-4 text-muted-foreground'>
                  <p className='text-lg leading-relaxed mb-6'>
                    {t('sections.about.paragraph1')}
                  </p>
                  <p className='text-lg leading-relaxed'>
                    {t('sections.about.paragraph2')}
                  </p>

                  {/* Currently Learning Section */}
                  <div className='mt-12'>
                    <h3 className='text-xl font-light text-foreground mb-6 flex items-center'>
                      <span className='w-6 h-px bg-primary mr-3'></span>
                      {t('sections.about.currentlyLearning')}
                    </h3>

                    <div className='flex gap-6'>
                      {learningTech.map((tech, index) => (
                        <motion.div
                          key={tech.name}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className='flex flex-col items-center gap-2'>
                          <div className='rounded-full p-4 bg-card/80 border border-muted/30 shadow-inner w-16 h-16 flex items-center justify-center'>
                            <img
                              src={tech.icon}
                              alt={tech.name}
                              className='w-10 h-10 object-contain'
                              onError={(e) => {
                                // If image fails to load, show the first letter
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add(
                                  'show-letter'
                                );
                              }}
                            />
                            <span className='hidden text-lg font-mono'>
                              {tech.name.charAt(0)}
                            </span>
                          </div>
                          <span className='text-sm text-foreground/80'>
                            {tech.name}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
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

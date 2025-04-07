import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useSiteContent } from '../hooks/useSiteContent';
import FloatingCube from '../components/three/FloatingCube';
import FloatingSphere from '../components/three/FloatingSphere';

export default function AboutPage() {
  const { data: content, isLoading } = useSiteContent();

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <Layout>
      <section className='py-16 relative'>
        {/* Decorative elements */}
        <div className='absolute top-20 -left-20 opacity-60 hidden lg:block'>
          <FloatingSphere
            size={120}
            color='#a855f7'
            speed={0.5}
            position={[0, 0, -1]}
          />
        </div>

        <div className='absolute bottom-40 -right-20 opacity-60 hidden lg:block'>
          <FloatingCube
            size={100}
            color='#2dd4bf'
            speed={0.8}
            position={[0, 0, -1]}
          />
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <motion.div
            className='max-w-3xl mx-auto'
            initial='hidden'
            animate='visible'
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}>
            <motion.h1
              className='text-6xl md:text-7xl font-bold mb-8 text-white'
              variants={fadeInUp}>
              About Me
            </motion.h1>

            {isLoading ? (
              <motion.div
                className='animate-pulse h-8 bg-base-dark rounded w-3/4 mb-4'
                variants={fadeInUp}></motion.div>
            ) : (
              <motion.div variants={fadeInUp}>
                <p className='text-xl md:text-2xl mb-8 text-white/80 leading-relaxed'>
                  {content?.aboutText ||
                    'Creative developer with a passion for clean code and beautiful designs.'}
                </p>

                <div className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8 hover:border-teal-500/50 transition-colors duration-300'>
                  <h2 className='text-2xl font-bold mb-4 text-white'>
                    My Journey
                  </h2>
                  <p className='text-white/70 mb-4'>
                    I started my journey in web development over a decade ago,
                    fascinated by the intersection of design and technology.
                    What began as a hobby quickly evolved into a passion for
                    creating elegant solutions to complex problems.
                  </p>
                  <p className='text-white/70'>
                    Today, I specialize in building modern web applications
                    using cutting-edge technologies. I'm constantly learning and
                    experimenting with new tools and frameworks to stay at the
                    forefront of web development.
                  </p>
                </div>

                <div className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 hover:border-teal-500/50 transition-colors duration-300'>
                  <h2 className='text-2xl font-bold mb-4 text-white'>
                    My Approach
                  </h2>
                  <p className='text-white/70 mb-4'>
                    I believe in creating web experiences that are not only
                    visually appealing but also performant, accessible, and
                    user-friendly. My approach combines technical expertise with
                    an eye for design and a focus on user experience.
                  </p>
                  <p className='text-white/70'>
                    Whether it's a personal project or a client website, I bring
                    the same level of attention to detail and commitment to
                    quality. I'm passionate about creating digital experiences
                    that leave a lasting impression.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

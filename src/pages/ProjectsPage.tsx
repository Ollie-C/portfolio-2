import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import ProjectsList from '../components/ProjectsList';
import FloatingSphere from '../components/three/FloatingSphere';

export default function ProjectsPage() {
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Layout>
      <section className='py-16 relative'>
        {/* Decorative element */}
        <div className='absolute -top-20 -right-20 opacity-60 hidden lg:block'>
          <FloatingSphere
            size={150}
            color='#a855f7'
            speed={0.6}
            position={[0, 0, -1]}
          />
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <motion.div
            initial='hidden'
            animate='visible'
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}>
            <motion.div className='mb-16 text-right' variants={fadeIn}>
              <h1 className='text-5xl md:text-7xl font-bold mb-5 text-white'>
                Projects
              </h1>
              <p className='text-white/80 max-w-lg ml-auto text-lg'>
                A collection of my recent work showcasing my skills in web
                development and design.
              </p>
            </motion.div>

            <ProjectsList />
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

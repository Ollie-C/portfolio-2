import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useSkills } from '../hooks/useSkills';
import FloatingCube from '../components/three/FloatingCube';

// Define skill category types
type SkillCategory = 'ALL' | 'Frontend' | 'Backend' | 'Database' | 'Languages';

export default function SkillsPage() {
  const [activeCategory, setActiveCategory] = useState<SkillCategory>('ALL');
  const { data: skills, isLoading } = useSkills(
    activeCategory === 'ALL' ? undefined : activeCategory
  );

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  // Group skills by category
  const groupedSkills = skills?.reduce(
    (groups, skill) => {
      const category = skill.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(skill);
      return groups;
    },
    {} as Record<string, typeof skills>
  );

  return (
    <Layout>
      <section className='py-16 relative'>
        {/* Decorative elements */}
        <div className='absolute top-40 -right-20 opacity-60 hidden lg:block'>
          <FloatingCube
            size={120}
            color='#2dd4bf'
            speed={0.7}
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
            }}
            className='max-w-4xl mx-auto'>
            <motion.h1
              className='text-6xl md:text-7xl font-bold mb-8 text-white'
              variants={fadeIn}>
              Skills & Expertise
            </motion.h1>

            <motion.p
              className='text-xl text-white/80 mb-12 max-w-2xl'
              variants={fadeIn}>
              My technical skills and areas of expertise, built over years of
              hands-on experience and continuous learning.
            </motion.p>

            <motion.div
              className='flex flex-wrap gap-3 mb-12'
              variants={fadeIn}>
              {(
                [
                  'ALL',
                  'Frontend',
                  'Backend',
                  'Database',
                  'Languages',
                ] as SkillCategory[]
              ).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-5 py-2 rounded-full text-sm transition-all ${
                    activeCategory === category
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'bg-base-dark/80 backdrop-blur-sm border border-gray-700 hover:border-teal-600 text-gray-300'
                  }`}>
                  {category}
                </button>
              ))}
            </motion.div>

            {isLoading ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {[1, 2, 3, 4].map((n) => (
                  <motion.div
                    key={n}
                    className='h-20 bg-base-dark/50 rounded-lg animate-pulse'
                    variants={fadeInUp}></motion.div>
                ))}
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {activeCategory === 'ALL'
                  ? // If ALL is selected, iterate through each category
                    Object.entries(groupedSkills || {}).map(
                      ([category, categorySkills]) => (
                        <motion.div
                          key={category}
                          className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-teal-500/50 transition-all duration-300'
                          variants={fadeInUp}>
                          <div className='p-6'>
                            <h2 className='text-xl font-semibold mb-4 text-white'>
                              {category}
                            </h2>
                            <div className='space-y-4'>
                              {categorySkills?.map((skill) => (
                                <div key={skill.id}>
                                  <div className='flex justify-between mb-1'>
                                    <span className='text-white/80'>
                                      {skill.name}
                                    </span>
                                    <span className='text-white/60 text-sm'>
                                      {skill.level}/5
                                    </span>
                                  </div>
                                  <div className='w-full bg-base-dark rounded-full h-2'>
                                    <div
                                      className='bg-teal-500 h-2 rounded-full'
                                      style={{
                                        width: `${(skill.level / 5) * 100}%`,
                                      }}></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )
                    )
                  : // If a specific category is selected, show those skills
                    skills?.map((skill) => (
                      <motion.div
                        key={skill.id}
                        className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-teal-500/50 transition-colors duration-300'
                        variants={fadeInUp}>
                        <h3 className='text-lg font-medium text-white mb-2'>
                          {skill.name}
                        </h3>
                        <div className='flex items-center'>
                          <div className='flex-1 mr-4'>
                            <div className='w-full bg-base-dark rounded-full h-2'>
                              <div
                                className='bg-teal-500 h-2 rounded-full'
                                style={{
                                  width: `${(skill.level / 5) * 100}%`,
                                }}></div>
                            </div>
                          </div>
                          <span className='text-white/60 text-sm'>
                            {skill.level}/5
                          </span>
                        </div>
                      </motion.div>
                    ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

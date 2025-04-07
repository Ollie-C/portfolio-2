import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout/Layout';
import { useSiteContent } from '../hooks/useSiteContent';
import FloatingCube from '../components/three/FloatingCube';

export default function ContactPage() {
  const { data: content } = useSiteContent();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(false);

    // Simulate form submission
    try {
      // In a real app, you would send data to your backend here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (error) {
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className='py-16 relative'>
        {/* Decorative elements */}
        <div className='absolute bottom-20 -left-20 opacity-60 hidden lg:block'>
          <FloatingCube
            size={120}
            color='#a855f7'
            speed={0.6}
            position={[0, 0, -1]}
          />
        </div>

        <div className='container mx-auto px-4 md:px-8 relative z-10'>
          <motion.div
            className='max-w-3xl mx-auto'
            initial='hidden'
            animate='visible'
            variants={containerVariants}>
            <motion.h1
              className='text-6xl md:text-7xl font-bold mb-8 text-white'
              variants={fadeInUp}>
              Let's Connect
            </motion.h1>

            <motion.p
              className='text-xl text-white/80 mb-12'
              variants={fadeInUp}>
              Have a project in mind or just want to say hello? Feel free to
              reach out!
            </motion.p>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
              <motion.div variants={fadeInUp}>
                <div className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 h-full'>
                  <h2 className='text-2xl font-bold mb-4 text-white'>
                    Contact Information
                  </h2>

                  <div className='mb-6'>
                    <p className='text-white/70 mb-2'>Email:</p>
                    <a
                      href={`mailto:${content?.contactEmail || 'hello@olliec.com'}`}
                      className='text-teal-400 hover:text-teal-300 transition-colors'>
                      {content?.contactEmail || 'hello@olliec.com'}
                    </a>
                  </div>

                  <div className='mb-6'>
                    <p className='text-white/70 mb-2'>Location:</p>
                    <p className='text-white'>London, United Kingdom</p>
                  </div>

                  <div>
                    <p className='text-white/70 mb-2'>Social:</p>
                    <div className='flex space-x-4'>
                      <a
                        href='https://github.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white/80 hover:text-white transition-colors'>
                        GitHub
                      </a>
                      <a
                        href='https://linkedin.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white/80 hover:text-white transition-colors'>
                        LinkedIn
                      </a>
                      <a
                        href='https://twitter.com'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-white/80 hover:text-white transition-colors'>
                        Twitter
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <form
                  onSubmit={handleSubmit}
                  className='bg-base-dark/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8'>
                  <h2 className='text-2xl font-bold mb-6 text-white'>
                    Send a Message
                  </h2>

                  {submitSuccess && (
                    <div className='mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400'>
                      Your message has been sent successfully!
                    </div>
                  )}

                  {submitError && (
                    <div className='mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400'>
                      There was an error sending your message. Please try again.
                    </div>
                  )}

                  <div className='mb-4'>
                    <label htmlFor='name' className='block text-white/70 mb-2'>
                      Name
                    </label>
                    <input
                      type='text'
                      id='name'
                      name='name'
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className='w-full bg-base-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none'
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='email' className='block text-white/70 mb-2'>
                      Email
                    </label>
                    <input
                      type='email'
                      id='email'
                      name='email'
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className='w-full bg-base-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none'
                    />
                  </div>

                  <div className='mb-6'>
                    <label
                      htmlFor='message'
                      className='block text-white/70 mb-2'>
                      Message
                    </label>
                    <textarea
                      id='message'
                      name='message'
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className='w-full bg-base-dark/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-teal-500 focus:outline-none resize-none'></textarea>
                  </div>

                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className={`w-full py-3 rounded-lg bg-teal-500 text-white font-medium transition-all ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-teal-600'
                    }`}>
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

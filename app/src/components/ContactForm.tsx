import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (formRef.current) {
        await emailjs.sendForm(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          formRef.current,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Form submission error:', err);
      setError(
        'Something went wrong. Please try again later or email me directly at contact@olliec.dev'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setError('');
  };

  return (
    <div className='space-y-8'>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='bg-card/60 backdrop-blur-md border border-primary/20 p-8 rounded-md shadow-lg relative overflow-hidden'>
          <div className='absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0'></div>
          <div className='relative z-10'>
            <div className='flex items-center gap-2 mb-4'>
              <h3 className='text-2xl font-light text-foreground'>
                {t('contactForm.success')}
              </h3>
            </div>
            <p className='text-muted-foreground mb-6'>
              {t('contactForm.thankYou')}
            </p>
          </div>
        </motion.div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-xs uppercase tracking-wider text-primary opacity-60 font-mono mb-2'>
              {t('contactForm.name')}
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='w-full bg-transparent border-b border-muted-foreground/30 pb-2 focus:outline-none focus:border-primary text-foreground'
            />
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-xs uppercase tracking-wider text-primary opacity-60 font-mono mb-2'>
              {t('contactForm.email')}
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='w-full bg-transparent border-b border-muted-foreground/30 pb-2 focus:outline-none focus:border-primary text-foreground'
            />
          </div>

          <div>
            <label
              htmlFor='message'
              className='block text-xs uppercase tracking-wider text-primary opacity-60 font-mono mb-2'>
              {t('contactForm.message')}
            </label>
            <textarea
              id='message'
              name='message'
              value={formData.message}
              onChange={handleChange}
              required
              rows={4}
              className='w-full bg-transparent border-b border-muted-foreground/30 pb-2 focus:outline-none focus:border-primary text-foreground resize-none'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <div className='flex justify-end'>
            <motion.button
              type='submit'
              disabled={isSubmitting}
              className='group relative flex items-center gap-2 bg-transparent text-primary'
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}>
              <span className='text-sm font-light'>
                {isSubmitting
                  ? t('contactForm.sending')
                  : t('contactForm.send').toUpperCase()}
              </span>
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
                <path d='M5 12h14'></path>
                <path d='m12 5 7 7-7 7'></path>
              </svg>
            </motion.button>
          </div>
        </form>
      )}
    </div>
  );
}

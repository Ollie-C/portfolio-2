import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ContactForm() {
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
      // Temporary placeholder until Express backend is implemented
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again later.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='space-y-8'>
      {submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='bg-primary/10 border border-primary/20 p-6 rounded-sm'>
          <h3 className='text-xl font-light text-primary mb-2'>Message sent</h3>
          <p className='text-muted-foreground'>
            Thank you for reaching out. I'll get back to you as soon as
            possible.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className='mt-4 text-sm text-primary hover:underline'>
            Send another message
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-xs uppercase tracking-wider text-primary opacity-60 font-mono mb-2'>
              Name
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
              Email
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
              Message
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
              <span className='text-sm'>
                {isSubmitting ? 'Sending...' : 'Send message'}
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

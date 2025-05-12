import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id='top'
      className='relative min-h-[85vh] flex items-center justify-end overflow-hidden pb-40 px-8'>
      <div className='container mx-auto relative z-10'>
        <div className='text-right'>
          <h1 className='font-medium'>
            <span className='block uppercase tracking-widest mb-2 text-[#4752a8] text-4xl md:text-7xl'>
              {t('hero.title')}
            </span>
            <div className='text-4xl md:text-6xl lg:text-9xl mt-0'>
              <span className='block text-text-primary'>
                {t('hero.subtitle')}
              </span>
            </div>
          </h1>
        </div>
      </div>
    </section>
  );
}

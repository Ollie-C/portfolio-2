import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import SEO from '../components/SEO';

export default function NotFoundPage() {
  return (
    <Layout>
      <SEO
        title='404 - Page Not Found | Ollie Cross'
        description="The page you are looking for doesn't exist or has been moved."
        keywords={['404', 'not found', 'ollie cross']}
        url='https://olliecross.dev/404'
      />
      <div className='container mx-auto px-4 py-20 text-center'>
        <h1 className='text-6xl font-bold text-foreground mb-6'>404</h1>
        <h2 className='text-3xl font-semibold mb-6'>Page Not Found</h2>
        <p className='text-xl text-muted-foreground mb-8'>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to='/'
          className='px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/80 transition-colors inline-block'>
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}

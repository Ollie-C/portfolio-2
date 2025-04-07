import { Link } from 'react-router-dom';
import Layout from '../components/Layout/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className='container mx-auto px-4 py-20 text-center'>
        <h1 className='text-6xl font-bold text-gray-800 mb-6'>404</h1>
        <h2 className='text-3xl font-semibold mb-6'>Page Not Found</h2>
        <p className='text-xl text-gray-600 mb-8'>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          to='/'
          className='px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors inline-block'>
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}

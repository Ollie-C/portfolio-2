import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Lazy loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Placeholder components - can be replaced with actual implementations later
const PlaceholderPage = ({ title }: { title: string }) => (
  <Layout>
    <div className='container mx-auto px-4 py-20'>
      <h1 className='text-4xl font-bold mb-6'>{title}</h1>
      <p className='text-lg text-gray-600'>This page is coming soon.</p>
    </div>
  </Layout>
);

// Loading fallback
const LoadingFallback = () => (
  <div className='flex items-center justify-center min-h-screen'>
    <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600'></div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects' element={<ProjectsPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/skills' element={<SkillsPage />} />
          <Route path='/contact' element={<ContactPage />} />
          <Route path='/cv' element={<PlaceholderPage title='CV' />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

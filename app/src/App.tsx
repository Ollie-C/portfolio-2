import { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { applyThemeEffects } from './store/themeStore';
import './i18n';
import SEO from './components/SEO';

const HomePage = lazy(() => import('./pages/HomePage'));
const ProjectPage = lazy(() => import('./pages/ProjectPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoadingFallback = () => (
  <div className='fixed inset-0 flex items-center justify-center bg-background'>
    <div className='animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full'></div>
  </div>
);

function App() {
  useEffect(() => {
    applyThemeEffects();
  }, []);

  return (
    <HelmetProvider>
      <SEO />
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/project/:slug' element={<ProjectPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Router>
    </HelmetProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import CollectionPage from './pages/CollectionPage';
import PPCDetailPage from './pages/PPCDetailPage';
import PhilatelyPassportPage from './pages/PhilatelyPassportPage';
import CollectionProgressPage from './pages/CollectionProgressPage';
import StatesPage from './pages/StatesPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

// GitHub Pages uses a hash-based workaround or BrowserRouter with a 404.html.
// We use BrowserRouter with the base configured in vite.config.ts.
export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collection" element={<CollectionPage />} />
          <Route path="/ppc/:id" element={<PPCDetailPage />} />
          <Route path="/philately-passport" element={<PhilatelyPassportPage />} />
          <Route path="/collection-progress" element={<CollectionProgressPage />} />
          <Route path="/states" element={<StatesPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

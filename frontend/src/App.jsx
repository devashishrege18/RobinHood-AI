/**
 * App — Root component with routing.
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import NegotiatePage from './pages/NegotiatePage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="flex-1 relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/negotiate" element={<NegotiatePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

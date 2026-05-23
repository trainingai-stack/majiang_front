import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LobbyPage from './pages/LobbyPage';
import MerchantsPage from './pages/MerchantsPage';
import MerchantApplyPage from './pages/MerchantApplyPage';
import MerchantDashboardPage from './pages/MerchantDashboardPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/merchants" element={<MerchantsPage />} />
              <Route path="/merchant/apply" element={<MerchantApplyPage />} />
              <Route path="/merchant/dashboard" element={<MerchantDashboardPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
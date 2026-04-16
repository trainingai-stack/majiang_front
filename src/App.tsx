import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { Lobby } from './pages/Lobby';
import { Merchants } from './pages/Merchants';
import { MerchantDashboard } from './pages/MerchantDashboard';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/merchants" element={<Merchants />} />
            <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

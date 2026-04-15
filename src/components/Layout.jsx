import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Home, 
  Users, 
  Store, 
  UserCircle, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const { currentUser, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '组局大厅', icon: Home },
    { path: '/games', label: '我的组局', icon: Users },
    ...(currentUser?.isMerchant ? [{ path: '/merchant', label: '商家管理', icon: Store }] : []),
    { path: '/profile', label: '个人中心', icon: UserCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-3xl">🀄</span>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">麻将组局</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* User Info & Logout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={currentUser?.avatar}
                  alt={currentUser?.nickname}
                  className="w-8 h-8 rounded-full border-2 border-red-200"
                />
                <span className="text-sm font-medium text-gray-700">{currentUser?.nickname}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="退出登录"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-3 border-t border-gray-200 mt-3">
                <div className="flex items-center gap-3 px-4 py-3">
                  <img
                    src={currentUser?.avatar}
                    alt={currentUser?.nickname}
                    className="w-10 h-10 rounded-full border-2 border-red-200"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{currentUser?.nickname}</p>
                    <p className="text-sm text-gray-500">{currentUser?.phone}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;

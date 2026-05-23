import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Users,
  Building2,
  User,
  LogOut,
  Bell,
  Menu,
  X,
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: '首页', icon: Home },
    { path: '/lobby', label: '组局大厅', icon: Users },
    { path: '/merchants', label: '棋牌室', icon: Building2 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-mahjong-green text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-mahjong-gold rounded-lg flex items-center justify-center">
              <span className="text-mahjong-green font-bold text-xl">麻</span>
            </div>
            <span className="text-xl font-bold">麻将组局</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-white/20'
                      : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <button className="relative p-2 hover:bg-white/10 rounded-lg">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 hover:bg-white/10 px-3 py-2 rounded-lg"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full bg-white"
                  />
                  <span>{user?.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20"
                >
                  <LogOut size={18} />
                  <span>退出</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="bg-mahjong-gold text-mahjong-green px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors"
                >
                  注册
                </Link>
              </div>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-mahjong-green/95 border-t border-white/10">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    isActive(link.path) ? 'bg-white/20' : 'hover:bg-white/10'
                  }`}
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10"
                >
                  <User size={18} />
                  <span>个人中心</span>
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-white/10 w-full"
                >
                  <LogOut size={18} />
                  <span>退出登录</span>
                </button>
              </>
            ) : (
              <div className="flex space-x-3 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2 rounded-lg border border-white/30 hover:bg-white/10"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 text-center bg-mahjong-gold text-mahjong-green px-4 py-2 rounded-lg font-medium"
                >
                  注册
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Users, Store, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/lobby', label: '组局大厅', icon: Users },
    { path: '/merchants', label: '棋牌室', icon: Store },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="glass sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🀇</span>
          <span className="text-xl font-bold text-white">雀友汇</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === 'merchant' && (
                <Link
                  to="/merchant/dashboard"
                  className="px-4 py-2 bg-mahjong-gold text-mahjong-blue rounded-lg font-medium hover:bg-yellow-400 transition-all"
                >
                  商家管理
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all">
                <span className="text-2xl">{user.avatar}</span>
                <span className="text-white font-medium">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 btn-gradient text-white rounded-lg font-medium"
            >
              登录 / 注册
            </Link>
          )}
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-white/10 pt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg flex items-center gap-2 mb-1 ${
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
          {user ? (
            <>
              {user.role === 'merchant' && (
                <Link
                  to="/merchant/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-mahjong-gold text-mahjong-blue rounded-lg font-medium mb-2"
                >
                  商家管理
                </Link>
              )}
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-3 rounded-lg hover:bg-white/10 mb-1"
              >
                <span className="text-2xl">{user.avatar}</span>
                <span className="text-white font-medium">{user.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 rounded-lg text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-2"
              >
                <LogOut size={18} />
                <span>退出登录</span>
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-3 btn-gradient text-white rounded-lg font-medium text-center mt-2"
            >
              登录 / 注册
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

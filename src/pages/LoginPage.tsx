import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!phone || !password) {
      setError('请填写完整信息');
      setLoading(false);
      return;
    }

    const success = await login(phone, password);
    if (success) {
      navigate('/');
    } else {
      setError('手机号或密码错误');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg mahjong-pattern flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-mahjong-green rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-mahjong-gold font-bold text-3xl">麻</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">欢迎回来</h2>
            <p className="text-gray-500 mt-2">登录您的账号</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-mahjong-green focus:ring-mahjong-green" />
                <span className="ml-2 text-gray-600">记住我</span>
              </label>
              <a href="#" className="text-mahjong-green hover:underline">
                忘记密码？
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            还没有账号？{' '}
            <Link to="/register" className="text-mahjong-green font-medium hover:underline">
              立即注册
            </Link>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 text-center mb-2">测试账号</p>
            <p className="text-sm text-gray-600 text-center">手机号：13800138001 密码：任意</p>
            <p className="text-sm text-gray-600 text-center">手机号：13800138002 密码：任意（商家账号）</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

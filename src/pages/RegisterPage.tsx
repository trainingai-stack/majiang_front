import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Phone, Lock, User, Eye, EyeOff } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !phone || !password || !confirmPassword) {
      setError('请填写完整信息');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('两次密码不一致');
      setLoading(false);
      return;
    }

    if (phone.length !== 11) {
      setError('请输入正确的手机号');
      setLoading(false);
      return;
    }

    const success = await register(username, phone, password);
    if (success) {
      navigate('/');
    } else {
      setError('该手机号已注册');
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
            <h2 className="text-2xl font-bold text-gray-800">创建账号</h2>
            <p className="text-gray-500 mt-2">加入我们，开始组局</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="input-field pl-10"
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                确认密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="rounded text-mahjong-green focus:ring-mahjong-green" />
              <span className="ml-2 text-sm text-gray-600">
                我已阅读并同意{' '}
                <a href="#" className="text-mahjong-green hover:underline">
                  用户协议
                </a>{' '}
                和{' '}
                <a href="#" className="text-mahjong-green hover:underline">
                  隐私政策
                </a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            已有账号？{' '}
            <Link to="/login" className="text-mahjong-green font-medium hover:underline">
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

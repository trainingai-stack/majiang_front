import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Phone, Lock, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(phone, password);
      if (success) {
        navigate('/');
      } else {
        setError('登录失败，请使用测试账号：13800138000');
      }
    } else {
      if (!username || !phone || !password) {
        setError('请填写完整信息');
        return;
      }
      register(username, phone, password);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-4xl">🀇</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isLogin ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-white/60">
            {isLogin ? '登录账号开始组局' : '加入雀友汇，开启麻将时光'}
          </p>
        </div>

        <div className="glass rounded-3xl p-8 card-hover">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  昵称
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="请输入昵称"
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-mahjong-red text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 btn-gradient text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2"
            >
              {isLogin ? '登录' : '注册'}
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/60">
              {isLogin ? '还没有账号？' : '已有账号？'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary-400 font-medium ml-1 hover:text-primary-300 transition-colors"
              >
                {isLogin ? '立即注册' : '去登录'}
              </button>
            </p>
          </div>

          {isLogin && (
            <div className="mt-6 p-4 bg-white/5 rounded-xl">
              <p className="text-white/60 text-sm text-center">
                测试账号：13800138000（普通用户）
                <br />
                测试账号：13900139000（商家）
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          <Link to="/" className="hover:text-white/60 transition-colors">
            ← 返回首页
          </Link>
        </p>
      </div>
    </div>
  );
};

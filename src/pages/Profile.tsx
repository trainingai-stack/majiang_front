import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { User as UserIcon, Phone, Gamepad2, Store, MapPin, Clock, FileText, Star, Check, X } from 'lucide-react';

export const Profile = () => {
  const { user, applyMerchant } = useApp();
  const [showMerchantForm, setShowMerchantForm] = useState(false);
  const [merchantData, setMerchantData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    openTime: '09:00',
    closeTime: '24:00'
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleApplyMerchant = (e: React.FormEvent) => {
    e.preventDefault();
    applyMerchant(merchantData);
    setShowMerchantForm(false);
  };

  const getRoleBadge = () => {
    switch (user.role) {
      case 'merchant':
        return <span className="px-3 py-1 bg-mahjong-gold text-mahjong-blue rounded-full text-sm font-bold">认证商家</span>;
      case 'pending':
        return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">审核中</span>;
      default:
        return <span className="px-3 py-1 bg-white/10 text-white/70 rounded-full text-sm">普通用户</span>;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">个人中心</h1>

        <div className="glass rounded-2xl p-6 mb-6 card-hover">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-primary-500/20 flex items-center justify-center text-5xl">
              {user.avatar}
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{user.username}</h2>
                {getRoleBadge()}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-white/70">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 size={16} />
                  <span>参与 {user.gamesCount} 局</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="glass rounded-xl px-6 py-4">
                <p className="text-white/60 text-sm">账户余额</p>
                <p className="text-3xl font-bold text-primary-400">¥{user.balance}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <UserIcon className="text-blue-400" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">账号信息</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">用户ID</span>
                <span className="text-white font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/60">注册时间</span>
                <span className="text-white">2026-01-15</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-white/60">身份认证</span>
                <span className="text-mahjong-green flex items-center gap-1">
                  <Check size={16} /> 已认证
                </span>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-6 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-mahjong-green/20 flex items-center justify-center">
                <Star className="text-mahjong-green" size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">我的成就</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: '🎯', name: '雀圣初现', desc: '完成首局' },
                { icon: '🤝', name: '社交达人', desc: '邀请3位好友' },
                { icon: '⭐', name: '忠实玩家', desc: '注册满30天' }
              ].map((achievement, i) => (
                <div key={i} className="text-center p-3 bg-white/5 rounded-xl">
                  <span className="text-2xl">{achievement.icon}</span>
                  <p className="text-white text-sm font-medium mt-1">{achievement.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {user.role === 'user' && (
          <div className="glass rounded-2xl p-6 card-hover">
            {!showMerchantForm ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/20 flex items-center justify-center">
                  <Store className="text-primary-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">申请商家入驻</h3>
                <p className="text-white/60 mb-6 max-w-md mx-auto">
                  拥有棋牌室？加入我们成为认证商家，获得更多曝光和客户
                </p>
                <button
                  onClick={() => setShowMerchantForm(true)}
                  className="px-8 py-3 btn-gradient text-white rounded-xl font-bold"
                >
                  立即申请
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyMerchant}>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Store size={24} className="text-primary-400" />
                  商家入驻申请
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      棋牌室名称 *
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantData.name}
                      onChange={(e) => setMerchantData({ ...merchantData, name: e.target.value })}
                      placeholder="请输入棋牌室名称"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      联系电话 *
                    </label>
                    <input
                      type="tel"
                      required
                      value={merchantData.phone}
                      onChange={(e) => setMerchantData({ ...merchantData, phone: e.target.value })}
                      placeholder="请输入联系电话"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <MapPin size={16} className="inline mr-1" />
                      详细地址 *
                    </label>
                    <input
                      type="text"
                      required
                      value={merchantData.address}
                      onChange={(e) => setMerchantData({ ...merchantData, address: e.target.value })}
                      placeholder="请输入详细地址"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <Clock size={16} className="inline mr-1" />
                      开门时间
                    </label>
                    <input
                      type="time"
                      value={merchantData.openTime}
                      onChange={(e) => setMerchantData({ ...merchantData, openTime: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <Clock size={16} className="inline mr-1" />
                      关门时间
                    </label>
                    <input
                      type="time"
                      value={merchantData.closeTime}
                      onChange={(e) => setMerchantData({ ...merchantData, closeTime: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      <FileText size={16} className="inline mr-1" />
                      店铺简介
                    </label>
                    <textarea
                      rows={3}
                      value={merchantData.description}
                      onChange={(e) => setMerchantData({ ...merchantData, description: e.target.value })}
                      placeholder="请简单介绍您的棋牌室特色、设施等"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all resize-none"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowMerchantForm(false)}
                    className="px-6 py-3 glass text-white rounded-xl font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <X size={18} />
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 btn-gradient text-white rounded-xl font-bold flex items-center gap-2"
                  >
                    <Check size={18} />
                    提交申请
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {user.role === 'pending' && (
          <div className="glass rounded-2xl p-8 text-center card-hover">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Clock className="text-yellow-400" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">商家审核中</h3>
            <p className="text-white/60 max-w-md mx-auto">
              您的商家入驻申请已提交，我们将在1-3个工作日内完成审核，请耐心等待
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

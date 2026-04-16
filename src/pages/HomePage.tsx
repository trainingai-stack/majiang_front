import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Users,
  Building2,
  Calendar,
  Star,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import { dataStore } from '../data/store';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const gameGroups = dataStore.getGameGroups().slice(0, 3);
  const merchants = dataStore.getMerchants().filter(m => m.status === 'approved').slice(0, 3);

  const features = [
    {
      icon: Users,
      title: '快速组局',
      description: '一键发布组局信息，快速找到志同道合的牌友',
    },
    {
      icon: Building2,
      title: '优质场地',
      description: '精选正规棋牌室，环境舒适设施齐全',
    },
    {
      icon: Calendar,
      title: '灵活预约',
      description: '自由选择时间地点，组局更便捷',
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="gradient-bg mahjong-pattern text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            找牌友，就上麻将组局
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            专业的麻将组局平台，让找牌友变得简单
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/lobby"
                className="bg-mahjong-gold text-mahjong-green px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all flex items-center justify-center space-x-2"
              >
                <span>进入组局大厅</span>
                <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="bg-mahjong-gold text-mahjong-green px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
                >
                  立即注册
                </Link>
                <Link
                  to="/login"
                  className="bg-white/20 backdrop-blur px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/30 transition-all"
                >
                  登录账号
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">平台特色</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center"
                >
                  <div className="w-16 h-16 bg-mahjong-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-mahjong-green" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">热门组局</h2>
            <Link
              to="/lobby"
              className="text-mahjong-green hover:text-mahjong-green/80 flex items-center space-x-1"
            >
              <span>查看更多</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {gameGroups.map((group) => (
              <div key={group.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-mahjong-green/10 text-mahjong-green text-sm rounded-full">
                    {group.gameType === 'sichuan' ? '四川麻将' :
                     group.gameType === 'guangdong' ? '广东麻将' :
                     group.gameType === 'shanghai' ? '上海麻将' : '其他'}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${
                    group.status === 'recruiting' ? 'bg-green-100 text-green-600' :
                    group.status === 'full' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {group.status === 'recruiting' ? '招募中' :
                     group.status === 'full' ? '已满员' : '已结束'}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2">{group.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar size={16} className="mr-2" />
                  <span>{group.scheduledTime}</span>
                </div>
                {group.merchantName && (
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Building2 size={16} className="mr-2" />
                    <span>{group.merchantName} - {group.roomName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center">
                    <Users size={16} className="mr-1 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {group.currentPlayers}/{group.maxPlayers}人
                    </span>
                  </div>
                  <span className="text-mahjong-green font-bold">¥{group.fee}/人</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">推荐棋牌室</h2>
            <Link
              to="/merchants"
              className="text-mahjong-green hover:text-mahjong-green/80 flex items-center space-x-1"
            >
              <span>查看更多</span>
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {merchants.map((merchant) => (
              <div key={merchant.id} className="card">
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={merchant.images[0] || 'https://via.placeholder.com/400x200'}
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">{merchant.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{merchant.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 font-medium">{merchant.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {merchant.businessHours.open} - {merchant.businessHours.close}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 gradient-bg mahjong-pattern text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">成为商家入驻</h2>
          <p className="text-xl mb-8 text-white/90">
            拥有棋牌室？立即入驻平台，获取更多客源
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {['免费入驻', '流量扶持', '专业服务'].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <CheckCircle className="text-mahjong-gold" />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate(isAuthenticated ? '/merchant/apply' : '/login')}
            className="bg-mahjong-gold text-mahjong-green px-8 py-3 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all"
          >
            立即入驻
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

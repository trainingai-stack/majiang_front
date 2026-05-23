import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../data/store';
import {
  User,
  Building2,
  Calendar,
  Settings,
  Bell,
  ChevronRight,
  Edit2,
} from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');

  const merchant = user?.isMerchant && user.merchantId
    ? dataStore.getMerchantById(user.merchantId)
    : null;
  const myGroups = user
    ? dataStore.getGameGroups().filter(
        (g) => g.creatorId === user.id || g.players.some((p) => p.id === user.id)
      )
    : [];

  const handleSave = () => {
    if (username.trim()) {
      updateUser({ username: username.trim() });
      setIsEditing(false);
    }
  };

  const menuItems = [
    {
      icon: Calendar,
      label: '我的组局',
      description: '查看参与的组局记录',
      path: '/my-groups',
    },
    {
      icon: Building2,
      label: merchant ? '商家管理' : '商家入驻',
      description: merchant ? '管理您的棋牌室' : '申请成为商家',
      path: merchant ? '/merchant/dashboard' : '/merchant/apply',
    },
    {
      icon: Bell,
      label: '消息通知',
      description: '查看系统消息',
      path: '/notifications',
    },
    {
      icon: Settings,
      label: '账号设置',
      description: '修改密码等设置',
      path: '/settings',
    },
  ];

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="gradient-bg mahjong-pattern h-32"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-16">
              <img
                src={user.avatar}
                alt={user.username}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg bg-white"
              />
              <div className="sm:ml-6 mt-4 sm:mt-0 sm:mb-2 text-center sm:text-left">
                {isEditing ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="text-xl font-bold border-b-2 border-mahjong-green focus:outline-none px-2 py-1"
                    />
                    <button
                      onClick={handleSave}
                      className="text-sm text-mahjong-green hover:underline"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setUsername(user.username);
                      }}
                      className="text-sm text-gray-500 hover:underline"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <h1 className="text-xl font-bold">{user.username}</h1>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <p className="text-gray-500 mt-1">{user.phone}</p>
              </div>
              {user.isMerchant && (
                <div className="sm:ml-auto mt-4 sm:mt-0">
                  <span className="px-4 py-2 bg-mahjong-gold/20 text-mahjong-gold rounded-full font-medium">
                    商家认证
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-mahjong-green">{myGroups.length}</div>
            <div className="text-gray-500 mt-1">参与组局</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-mahjong-green">
              {myGroups.filter((g) => g.status === 'finished').length}
            </div>
            <div className="text-gray-500 mt-1">已完成</div>
          </div>
          <div className="bg-white rounded-xl p-6 text-center shadow">
            <div className="text-3xl font-bold text-mahjong-green">
              {myGroups.filter((g) => g.status === 'recruiting' || g.status === 'full').length}
            </div>
            <div className="text-gray-500 mt-1">进行中</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <h2 className="px-6 py-4 border-b font-bold text-lg">功能菜单</h2>
          <div className="divide-y">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-mahjong-green/10 rounded-lg flex items-center justify-center">
                    <Icon className="text-mahjong-green" size={20} />
                  </div>
                  <div className="ml-4 flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-gray-500">{item.description}</div>
                  </div>
                  <ChevronRight className="text-gray-400" size={20} />
                </button>
              );
            })}
          </div>
        </div>

        {merchant && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mt-6">
            <h2 className="px-6 py-4 border-b font-bold text-lg">我的棋牌室</h2>
            <div className="p-6">
              <div className="flex items-center">
                <img
                  src={merchant.images[0] || 'https://via.placeholder.com/100'}
                  alt={merchant.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="ml-4 flex-1">
                  <h3 className="font-bold">{merchant.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{merchant.address}</p>
                  <div className="flex items-center mt-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        merchant.status === 'approved'
                          ? 'bg-green-100 text-green-600'
                          : merchant.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {merchant.status === 'approved'
                        ? '已认证'
                        : merchant.status === 'pending'
                        ? '审核中'
                        : '已拒绝'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/merchant/dashboard')}
                  className="btn-primary"
                >
                  管理后台
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

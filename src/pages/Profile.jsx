import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Phone, 
  Store, 
  ChevronRight,
  Edit2,
  Check,
  X,
  Award
} from 'lucide-react';

const Profile = () => {
  const { currentUser, updateUser, applyMerchant } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showMerchantApply, setShowMerchantApply] = useState(false);
  const [formData, setFormData] = useState({
    nickname: currentUser?.nickname || '',
    phone: currentUser?.phone || ''
  });

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-500 p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={currentUser?.avatar}
                alt={currentUser?.nickname}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
              {currentUser?.isMerchant && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                  <Store className="w-4 h-4 text-yellow-800" />
                </div>
              )}
            </div>
            <div className="text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{currentUser?.nickname}</h1>
              <p className="text-red-100 mt-1">{currentUser?.phone}</p>
              {currentUser?.isMerchant && (
                <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 bg-white/20 rounded-full text-sm">
                  <Award className="w-4 h-4" />
                  认证商家
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">昵称</label>
                <input
                  type="text"
                  value={formData.nickname}
                  onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <Check className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={() => { setIsEditing(false); setFormData({ nickname: currentUser?.nickname, phone: currentUser?.phone }); }}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">昵称</span>
                </div>
                <span className="font-medium text-gray-800">{currentUser?.nickname}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">手机号</span>
                </div>
                <span className="font-medium text-gray-800">{currentUser?.phone}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600">商家身份</span>
                </div>
                <span className={`font-medium ${currentUser?.isMerchant ? 'text-green-600' : 'text-gray-500'}`}>
                  {currentUser?.isMerchant ? '已认证' : '未认证'}
                </span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                <Edit2 className="w-4 h-4" />
                编辑资料
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Merchant Section */}
      {!currentUser?.isMerchant && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">成为商家</h3>
                <p className="text-sm text-gray-500">入驻平台，展示您的棋牌室</p>
              </div>
            </div>
            <button
              onClick={() => setShowMerchantApply(true)}
              className="flex items-center gap-1 px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 transition-all"
            >
              立即申请
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-red-600">12</p>
          <p className="text-sm text-gray-500 mt-1">参与组局</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-blue-600">5</p>
          <p className="text-sm text-gray-500 mt-1">创建组局</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-3xl font-bold text-green-600">98%</p>
          <p className="text-sm text-gray-500 mt-1">好评率</p>
        </div>
      </div>

      {/* Merchant Apply Modal */}
      {showMerchantApply && (
        <MerchantApplyModal onClose={() => setShowMerchantApply(false)} />
      )}
    </div>
  );
};

// Merchant Apply Modal
const MerchantApplyModal = ({ onClose }) => {
  const { applyMerchant } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    businessHours: { start: '09:00', end: '22:00' }
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    applyMerchant({
      ...formData,
      rooms: [
        { id: `r${Date.now()}_1`, name: 'VIP包间1', capacity: 4, price: 80, status: 'available' },
        { id: `r${Date.now()}_2`, name: 'VIP包间2', capacity: 4, price: 80, status: 'available' },
        { id: `r${Date.now()}_3`, name: '普通包间1', capacity: 4, price: 50, status: 'available' },
        { id: `r${Date.now()}_4`, name: '普通包间2', capacity: 4, price: 50, status: 'available' },
      ]
    });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">申请已提交</h3>
          <p className="text-gray-500 mb-6">我们会在3个工作日内审核您的申请，请耐心等待。</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
          >
            知道了
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">商家入驻申请</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">棋牌室名称 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="请输入棋牌室名称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">详细地址 *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="请输入详细地址"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系电话 *</label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="请输入联系电话"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">营业时间</label>
            <div className="flex items-center gap-3">
              <input
                type="time"
                value={formData.businessHours.start}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  businessHours: { ...formData.businessHours, start: e.target.value }
                })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <span className="text-gray-500">至</span>
              <input
                type="time"
                value={formData.businessHours.end}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  businessHours: { ...formData.businessHours, end: e.target.value }
                })}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">商家介绍</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="介绍一下您的棋牌室..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>提示：</strong> 提交申请后，我们会尽快审核。审核通过后，您可以在商家管理界面添加房间信息。
            </p>
          </div>
        </form>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
          >
            提交申请
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

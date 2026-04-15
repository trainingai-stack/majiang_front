import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  Plus, 
  Edit2, 
  Trash2,
  Check,
  X,
  Users,
  DollarSign,
  Settings,
  Home
} from 'lucide-react';

const Merchant = () => {
  const { currentUser, updateMerchantInfo } = useApp();
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const merchantInfo = currentUser?.merchantInfo;

  const tabs = [
    { id: 'info', label: '基本信息', icon: Home },
    { id: 'rooms', label: '房间管理', icon: Store },
    { id: 'settings', label: '营业设置', icon: Settings },
  ];

  if (!currentUser?.isMerchant) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
          <Store className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-800 mb-2">您还不是认证商家</h3>
        <p className="text-gray-500 mb-4">请先申请商家入驻</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-6 h-6" />
              <h1 className="text-2xl sm:text-3xl font-bold">{merchantInfo?.name}</h1>
            </div>
            <p className="text-white/80 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {merchantInfo?.address}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">营业中</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-gray-800">{merchantInfo?.rooms?.length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">房间总数</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-green-600">{merchantInfo?.rooms?.filter(r => r.status === 'available').length || 0}</p>
          <p className="text-sm text-gray-500 mt-1">空闲房间</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-blue-600">128</p>
          <p className="text-sm text-gray-500 mt-1">今日预约</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-2xl font-bold text-yellow-600">¥2,560</p>
          <p className="text-sm text-gray-500 mt-1">今日收入</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                activeTab === tab.id
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'info' && (
            <MerchantInfo 
              merchantInfo={merchantInfo} 
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              onSave={updateMerchantInfo}
            />
          )}
          {activeTab === 'rooms' && (
            <RoomManagement 
              rooms={merchantInfo?.rooms || []}
              onAdd={() => setShowAddRoom(true)}
              onEdit={setEditingRoom}
              onSave={updateMerchantInfo}
              merchantInfo={merchantInfo}
            />
          )}
          {activeTab === 'settings' && (
            <BusinessSettings 
              merchantInfo={merchantInfo}
              onSave={updateMerchantInfo}
            />
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddRoom && (
        <RoomModal 
          onClose={() => setShowAddRoom(false)}
          onSave={(room) => {
            const newRooms = [...(merchantInfo?.rooms || []), { ...room, id: `r${Date.now()}` }];
            updateMerchantInfo({ rooms: newRooms });
            setShowAddRoom(false);
          }}
        />
      )}
      {editingRoom && (
        <RoomModal 
          room={editingRoom}
          onClose={() => setEditingRoom(null)}
          onSave={(room) => {
            const newRooms = merchantInfo?.rooms.map(r => r.id === room.id ? room : r) || [];
            updateMerchantInfo({ rooms: newRooms });
            setEditingRoom(null);
          }}
        />
      )}
    </div>
  );
};

// Merchant Info Component
const MerchantInfo = ({ merchantInfo, isEditing, setIsEditing, onSave }) => {
  const [formData, setFormData] = useState({
    name: merchantInfo?.name || '',
    address: merchantInfo?.address || '',
    phone: merchantInfo?.phone || '',
    description: merchantInfo?.description || ''
  });

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">棋牌室名称</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">详细地址</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">商家介绍</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            <Check className="w-4 h-4" />
            保存
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
          >
            <X className="w-4 h-4" />
            取消
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
        >
          <Edit2 className="w-4 h-4" />
          编辑信息
        </button>
      </div>
      <div className="grid gap-4">
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <Store className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">棋牌室名称</p>
            <p className="font-medium text-gray-800">{merchantInfo?.name}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">详细地址</p>
            <p className="font-medium text-gray-800">{merchantInfo?.address}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm text-gray-500">联系电话</p>
            <p className="font-medium text-gray-800">{merchantInfo?.phone}</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="w-5 h-5 flex items-center justify-center text-gray-400 mt-0.5">📝</div>
          <div>
            <p className="text-sm text-gray-500">商家介绍</p>
            <p className="font-medium text-gray-800">{merchantInfo?.description || '暂无介绍'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Room Management Component
const RoomManagement = ({ rooms, onAdd, onEdit, onSave, merchantInfo }) => {
  const handleDelete = (roomId) => {
    if (confirm('确定要删除这个房间吗？')) {
      const newRooms = rooms.filter(r => r.id !== roomId);
      onSave({ rooms: newRooms });
    }
  };

  const handleToggleStatus = (room) => {
    const newStatus = room.status === 'available' ? 'occupied' : 'available';
    const newRooms = rooms.map(r => r.id === room.id ? { ...r, status: newStatus } : r);
    onSave({ rooms: newRooms });
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
        >
          <Plus className="w-5 h-5" />
          添加房间
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">暂无房间，请添加房间</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`border-2 rounded-xl p-5 transition-all ${
                room.status === 'available' 
                  ? 'border-green-200 bg-green-50/50' 
                  : 'border-red-200 bg-red-50/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-800">{room.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{room.capacity}人桌</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  room.status === 'available'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {room.status === 'available' ? '空闲' : '使用中'}
                </span>
              </div>

              <div className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
                <DollarSign className="w-5 h-5 text-red-500" />
                {room.price}
                <span className="text-sm font-normal text-gray-500">/小时</span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(room)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                <button
                  onClick={() => handleToggleStatus(room)}
                  className={`flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all text-sm ${
                    room.status === 'available'
                      ? 'border border-red-300 text-red-600 hover:bg-red-50'
                      : 'border border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {room.status === 'available' ? '设为占用' : '设为空闲'}
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Room Modal
const RoomModal = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    capacity: room?.capacity || 4,
    price: room?.price || 50,
    status: room?.status || 'available'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-5">
          {room ? '编辑房间' : '添加房间'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房间名称</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：VIP包间1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">容纳人数</label>
            <select
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value={2}>2人</option>
              <option value={3}>3人</option>
              <option value={4}>4人</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">价格（元/小时）</label>
            <input
              type="number"
              required
              min={1}
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Business Settings Component
const BusinessSettings = ({ merchantInfo, onSave }) => {
  const [formData, setFormData] = useState({
    businessHours: merchantInfo?.businessHours || { start: '09:00', end: '22:00' }
  });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">营业时间</label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">开始时间</label>
            <input
              type="time"
              value={formData.businessHours.start}
              onChange={(e) => setFormData({
                ...formData,
                businessHours: { ...formData.businessHours, start: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <span className="text-gray-400 mt-5">至</span>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">结束时间</label>
            <input
              type="time"
              value={formData.businessHours.end}
              onChange={(e) => setFormData({
                ...formData,
                businessHours: { ...formData.businessHours, end: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          营业时间说明
        </h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>设置的营业时间将展示给用户</li>
          <li>用户只能在营业时间内预约组局</li>
          <li>建议根据实际经营情况设置</li>
        </ul>
      </div>

      <button
        onClick={handleSave}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all"
      >
        保存设置
      </button>
    </div>
  );
};

export default Merchant;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../data/store';
import { Merchant, Room } from '../types';
import {
  Building2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  DollarSign,
  Users,
  Settings,
  X,
} from 'lucide-react';

const MerchantDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState<Merchant | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeTab, setActiveTab] = useState<'rooms' | 'settings'>('rooms');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (!user || !user.isMerchant || !user.merchantId) {
      navigate('/merchant/apply');
      return;
    }
    loadData();
  }, [user]);

  const loadData = () => {
    if (user?.merchantId) {
      const merchantData = dataStore.getMerchantById(user.merchantId);
      setMerchant(merchantData || null);
      if (merchantData) {
        const roomsData = dataStore.getRoomsByMerchantId(merchantData.id);
        setRooms(roomsData);
      }
    }
  };

  const handleSaveRoom = (roomData: Partial<Room>) => {
    if (!merchant) return;

    if (editingRoom) {
      dataStore.updateRoom(editingRoom.id, roomData);
    } else {
      dataStore.createRoom({
        merchantId: merchant.id,
        merchantName: merchant.name,
        name: roomData.name!,
        type: roomData.type as Room['type'],
        price: roomData.price!,
        capacity: roomData.capacity!,
        facilities: roomData.facilities!,
        images: roomData.images || [],
        status: 'available',
      });
    }
    loadData();
    setShowRoomModal(false);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (window.confirm('确定要删除这个房间吗？')) {
      dataStore.deleteRoom(roomId);
      loadData();
    }
  };

  const handleUpdateMerchant = (updates: Partial<Merchant>) => {
    if (!merchant) return;
    dataStore.updateMerchant(merchant.id, updates);
    loadData();
  };

  if (!merchant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-bold text-gray-400">您还没有商家信息</h2>
          <button
            onClick={() => navigate('/merchant/apply')}
            className="btn-primary mt-4"
          >
            立即入驻
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="gradient-bg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                  <Building2 className="text-white" size={32} />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-white">{merchant.name}</h1>
                  <div className="flex items-center text-white/80 text-sm mt-1">
                    <span>{merchant.address}</span>
                  </div>
                </div>
              </div>
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  merchant.status === 'approved'
                    ? 'bg-green-100 text-green-600'
                    : merchant.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {merchant.status === 'approved' ? '已认证' : merchant.status === 'pending' ? '审核中' : '已拒绝'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 divide-x border-b">
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-mahjong-green">{rooms.length}</div>
              <div className="text-gray-500 text-sm">房间数</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-mahjong-green">
                {rooms.filter(r => r.status === 'available').length}
              </div>
              <div className="text-gray-500 text-sm">可用</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-mahjong-green">
                ¥{Math.min(...rooms.map(r => r.price), 0)}
              </div>
              <div className="text-gray-500 text-sm">最低价</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-2xl font-bold text-mahjong-green">{merchant.rating}</div>
              <div className="text-gray-500 text-sm">评分</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('rooms')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'rooms'
                  ? 'text-mahjong-green border-b-2 border-mahjong-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              房间管理
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'text-mahjong-green border-b-2 border-mahjong-green'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              商家设置
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'rooms' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold">房间列表</h2>
                  <button
                    onClick={() => {
                      setEditingRoom(null);
                      setShowRoomModal(true);
                    }}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Plus size={18} />
                    <span>添加房间</span>
                  </button>
                </div>

                {rooms.length === 0 ? (
                  <div className="text-center py-12">
                    <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-400">暂无房间，请添加</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                      <div key={room.id} className="border rounded-xl overflow-hidden">
                        <div className="h-32 bg-gray-200 flex items-center justify-center">
                          <Building2 className="text-gray-400" size={40} />
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold">{room.name}</h3>
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                room.type === 'premium'
                                  ? 'bg-purple-100 text-purple-600'
                                  : room.type === 'vip'
                                  ? 'bg-yellow-100 text-yellow-600'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {room.type === 'premium' ? '豪华' : room.type === 'vip' ? 'VIP' : '标准'}
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Users size={14} className="mr-1" />
                            <span>{room.capacity}人</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <DollarSign size={14} className="mr-1" />
                            <span>¥{room.price}/小时</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {room.facilities.map((f, i) => (
                              <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {f}
                              </span>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingRoom(room);
                                setShowRoomModal(true);
                              }}
                              className="flex-1 py-2 text-sm border rounded-lg hover:bg-gray-50 flex items-center justify-center space-x-1"
                            >
                              <Edit2 size={14} />
                              <span>编辑</span>
                            </button>
                            <button
                              onClick={() => handleDeleteRoom(room.id)}
                              className="px-3 py-2 text-sm border border-red-200 text-red-500 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-4">商家信息</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">商家名称</label>
                      <input
                        type="text"
                        value={merchant.name}
                        onChange={(e) => handleUpdateMerchant({ name: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-500 mb-1">联系电话</label>
                      <input
                        type="tel"
                        value={merchant.phone}
                        onChange={(e) => handleUpdateMerchant({ phone: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">地址</label>
                      <input
                        type="text"
                        value={merchant.address}
                        onChange={(e) => handleUpdateMerchant({ address: e.target.value })}
                        className="input-field"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-500 mb-1">简介</label>
                      <textarea
                        value={merchant.description}
                        onChange={(e) => handleUpdateMerchant({ description: e.target.value })}
                        className="input-field min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-4">营业时间</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">开始时间</label>
                      <input
                        type="time"
                        value={merchant.businessHours.open}
                        onChange={(e) =>
                          handleUpdateMerchant({
                            businessHours: { ...merchant.businessHours, open: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </div>
                    <span className="text-gray-400 mt-6">至</span>
                    <div className="flex-1">
                      <label className="block text-sm text-gray-500 mb-1">结束时间</label>
                      <input
                        type="time"
                        value={merchant.businessHours.close}
                        onChange={(e) =>
                          handleUpdateMerchant({
                            businessHours: { ...merchant.businessHours, close: e.target.value },
                          })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                <button className="btn-primary">保存修改</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showRoomModal && (
        <RoomModal
          room={editingRoom}
          onClose={() => {
            setShowRoomModal(false);
            setEditingRoom(null);
          }}
          onSave={handleSaveRoom}
        />
      )}
    </div>
  );
};

interface RoomModalProps {
  room: Room | null;
  onClose: () => void;
  onSave: (room: Partial<Room>) => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: room?.name || '',
    type: room?.type || 'standard',
    price: room?.price || 30,
    capacity: room?.capacity || 4,
    facilities: room?.facilities || ['空调', 'WiFi'],
  });

  const allFacilities = ['空调', 'WiFi', '茶水', '独立卫生间', '沙发', '电视', '麻将机'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{room ? '编辑房间' : '添加房间'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房间名称</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="例如：VIP包间1号"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">房间类型</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Room['type'] })}
              className="input-field"
            >
              <option value="standard">标准间</option>
              <option value="vip">VIP包间</option>
              <option value="premium">豪华包间</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">价格(元/小时)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="1"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">容纳人数</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                min="2"
                max="8"
                className="input-field"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">设施</label>
            <div className="flex flex-wrap gap-2">
              {allFacilities.map((facility) => (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    formData.facilities.includes(facility)
                      ? 'bg-mahjong-green text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {facility}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" className="btn-primary flex-1">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MerchantDashboardPage;
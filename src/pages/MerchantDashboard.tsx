import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Home, Users, Plus, Edit, Trash2, Clock, DollarSign, MapPin, Store, ChevronRight, X, Check, Settings } from 'lucide-react';

export const MerchantDashboard = () => {
  const { user, merchants, rooms, addRoom, updateRoom, deleteRoom } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'rooms' | 'settings'>('overview');
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    pricePerHour: 50,
    capacity: 4,
    facilities: ['新风系统']
  });

  if (!user || user.role !== 'merchant') {
    return <Navigate to="/login" />;
  }

  const merchant = merchants.find(m => m.userId === user.id) || merchants[0];
  const merchantRooms = rooms.filter(r => r.merchantId === merchant?.id);

  const stats = [
    { label: '总订单', value: '156', icon: Home, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { label: '活跃用户', value: '89', icon: Users, color: 'text-mahjong-green', bg: 'bg-green-500/20' },
    { label: '开放房间', value: merchantRooms.length.toString(), icon: Store, color: 'text-primary-400', bg: 'bg-primary-500/20' },
    { label: '今日收入', value: '¥1,280', icon: DollarSign, color: 'text-mahjong-gold', bg: 'bg-yellow-500/20' },
  ];

  const facilityOptions = ['独立卫生间', '新风系统', '免费茶水', '吸烟区', '真皮沙发', '电视', '茶台', '用餐区'];

  const handleSubmitRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const roomData = {
      ...roomForm,
      id: editingRoom ? editingRoom.id : Date.now().toString(),
      merchantId: merchant.id,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400&h=300'
    };

    if (editingRoom) {
      updateRoom(editingRoom.id, roomData);
    } else {
      addRoom(roomData);
    }

    setShowRoomModal(false);
    setEditingRoom(null);
    setRoomForm({ name: '', pricePerHour: 50, capacity: 4, facilities: ['新风系统'] });
  };

  const openEditModal = (room: any) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      pricePerHour: room.pricePerHour,
      capacity: room.capacity,
      facilities: room.facilities
    });
    setShowRoomModal(true);
  };

  const toggleFacility = (facility: string) => {
    if (roomForm.facilities.includes(facility)) {
      setRoomForm({ ...roomForm, facilities: roomForm.facilities.filter(f => f !== facility) });
    } else {
      setRoomForm({ ...roomForm, facilities: [...roomForm.facilities, facility] });
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to="/" className="text-white/60 text-sm hover:text-white transition-colors mb-2 inline-flex items-center gap-1">
              <ChevronRight className="rotate-180" size={16} />
              返回首页
            </Link>
            <h1 className="text-3xl font-bold text-white">商家管理中心</h1>
            <p className="text-white/60">{merchant?.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{user.avatar}</span>
            <span className="text-white font-medium">{user.username}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: '数据概览', icon: Home },
            { id: 'rooms', label: '房间管理', icon: Store },
            { id: 'settings', label: '店铺设置', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-xl flex items-center gap-2 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary-500 text-white'
                  : 'glass text-white/70 hover:bg-white/10'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="glass rounded-2xl p-5 card-hover">
                  <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                    <stat.icon className={stat.color} size={24} />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-6 card-hover mb-6">
              <h3 className="text-xl font-bold text-white mb-4">店铺信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <img
                    src={merchant?.image}
                    alt={merchant?.name}
                    className="w-32 h-24 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-white">{merchant?.name}</h4>
                    <div className="flex items-center gap-1 text-mahjong-gold text-sm mb-2">
                      <Star size={14} />
                      <span>{merchant?.rating}</span>
                    </div>
                    <p className="text-white/60 text-sm flex items-center gap-1">
                      <MapPin size={14} />
                      {merchant?.address}
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/70">
                    <Clock size={18} className="text-mahjong-green" />
                    <span>营业时间：{merchant?.openTime} - {merchant?.closeTime}</span>
                  </div>
                  <p className="text-white/60 text-sm">{merchant?.description}</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-6 card-hover">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">房间列表</h3>
                <button
                  onClick={() => setActiveTab('rooms')}
                  className="text-primary-400 text-sm font-medium hover:text-primary-300"
                >
                  管理全部 →
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {merchantRooms.slice(0, 3).map((room) => (
                  <div key={room.id} className="bg-white/5 rounded-xl overflow-hidden">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="font-bold text-white">{room.name}</h4>
                      <p className="text-primary-400 font-bold">¥{room.pricePerHour}/小时</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">房间管理</h3>
              <button
                onClick={() => {
                  setEditingRoom(null);
                  setRoomForm({ name: '', pricePerHour: 50, capacity: 4, facilities: ['新风系统'] });
                  setShowRoomModal(true);
                }}
                className="px-5 py-3 btn-gradient text-white rounded-xl font-bold flex items-center gap-2"
              >
                <Plus size={20} />
                添加房间
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {merchantRooms.map((room) => (
                <div key={room.id} className="glass rounded-2xl overflow-hidden card-hover">
                  <div className="relative">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-sm rounded-full font-medium">
                      营业中
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-bold text-white">{room.name}</h4>
                      <p className="text-xl font-bold text-primary-400">¥{room.pricePerHour}<span className="text-sm text-white/50">/小时</span></p>
                    </div>
                    <p className="text-white/60 text-sm mb-4">
                      容纳 {room.capacity} 人
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.facilities.map((f, i) => (
                        <span key={i} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => openEditModal(room)}
                        className="flex-1 py-2 glass text-white rounded-lg font-medium hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Edit size={16} />
                        编辑
                      </button>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="py-2 px-4 bg-red-500/20 text-red-400 rounded-lg font-medium hover:bg-red-500/30 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {merchantRooms.length === 0 && (
                <div className="col-span-2 glass rounded-2xl p-12 text-center">
                  <Store size={48} className="mx-auto text-white/30 mb-4" />
                  <p className="text-white/60">暂无房间，点击右上角添加房间</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass rounded-2xl p-6 card-hover">
            <h3 className="text-xl font-bold text-white mb-6">店铺设置</h3>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">棋牌室名称</label>
                <input
                  type="text"
                  defaultValue={merchant?.name}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">详细地址</label>
                <input
                  type="text"
                  defaultValue={merchant?.address}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">开门时间</label>
                  <input
                    type="time"
                    defaultValue={merchant?.openTime}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">关门时间</label>
                  <input
                    type="time"
                    defaultValue={merchant?.closeTime}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">店铺简介</label>
                <textarea
                  rows={4}
                  defaultValue={merchant?.description}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all resize-none"
                />
              </div>
              <button className="px-6 py-3 btn-gradient text-white rounded-xl font-bold">
                保存设置
              </button>
            </div>
          </div>
        )}

        {showRoomModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingRoom ? '编辑房间' : '添加房间'}
                </h3>
                <button
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmitRoom} className="space-y-5">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">房间名称</label>
                  <input
                    type="text"
                    required
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    placeholder="如：豪华包间A"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">价格（元/小时）</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={roomForm.pricePerHour}
                      onChange={(e) => setRoomForm({ ...roomForm, pricePerHour: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">容纳人数</label>
                    <input
                      type="number"
                      required
                      min="2"
                      value={roomForm.capacity}
                      onChange={(e) => setRoomForm({ ...roomForm, capacity: Number(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-3">配套设施</label>
                  <div className="flex flex-wrap gap-2">
                    {facilityOptions.map((facility) => (
                      <button
                        key={facility}
                        type="button"
                        onClick={() => toggleFacility(facility)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          roomForm.facilities.includes(facility)
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {facility}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowRoomModal(false);
                      setEditingRoom(null);
                    }}
                    className="flex-1 py-3 glass text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 btn-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    {editingRoom ? '保存修改' : '添加房间'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Star = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

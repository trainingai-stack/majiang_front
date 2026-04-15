import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Users, 
  MapPin, 
  Clock, 
  ChevronRight,
  Filter,
  Search,
  X
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, games, joinGame } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningGame, setJoiningGame] = useState(null);

  const gameTypes = ['全部', '四川麻将', '国标麻将', '广东麻将', '上海麻将'];
  
  const filteredGames = games.filter(game => {
    const matchesType = filterType === 'all' || filterType === '全部' || game.gameType === filterType;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.creator.nickname.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch && game.status === 'open';
  });

  const handleJoinGame = async (gameId) => {
    setJoiningGame(gameId);
    const result = joinGame(gameId);
    if (result.success) {
      navigate('/games');
    } else {
      alert(result.message);
    }
    setJoiningGame(null);
  };

  const getMerchantName = (merchantId) => {
    // 这里简化处理，实际应该从商家列表获取
    return '欢乐棋牌室';
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              欢迎回来，{currentUser?.nickname}！
            </h1>
            <p className="text-red-100">找到志同道合的麻友，开启精彩对局</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            创建组局
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索组局标题或创建者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
            {gameTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type === '全部' ? 'all' : type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  (filterType === 'all' && type === '全部') || filterType === type
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Games List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Users className="w-5 h-5 text-red-500" />
          热门组局
          <span className="text-sm font-normal text-gray-500">({filteredGames.length})</span>
        </h2>

        {filteredGames.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">暂无符合条件的组局</h3>
            <p className="text-gray-500 mb-4">快来创建第一个组局吧！</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              创建组局
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{game.title}</h3>
                        <p className="text-gray-500 text-sm mb-3">{game.description}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                        组局中
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">玩法:</span>
                        <span className="font-medium">{game.gameType}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">底注:</span>
                        <span className="font-medium text-red-600">{game.stake}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{game.startTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{getMerchantName(game.merchantId)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={game.creator.avatar}
                          alt={game.creator.nickname}
                          className="w-8 h-8 rounded-full border border-gray-200"
                        />
                        <span className="text-sm text-gray-600">
                          创建者: <span className="font-medium">{game.creator.nickname}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col justify-between sm:justify-center items-center gap-4 sm:min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {game.currentPlayers.slice(0, 3).map((player, idx) => (
                          <img
                            key={player.id}
                            src={player.avatar}
                            alt={player.nickname}
                            className="w-8 h-8 rounded-full border-2 border-white"
                            style={{ zIndex: 3 - idx }}
                          />
                        ))}
                        {game.currentPlayers.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            +{game.currentPlayers.length - 3}
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {game.currentPlayers.length}/{game.maxPlayers}人
                      </span>
                    </div>

                    {game.currentPlayers.find(p => p.id === currentUser?.id) ? (
                      <button
                        onClick={() => navigate('/games')}
                        className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm font-medium"
                      >
                        已加入
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinGame(game.id)}
                        disabled={joiningGame === game.id || game.currentPlayers.length >= game.maxPlayers}
                        className="w-full sm:w-auto px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {joiningGame === game.id ? '加入中...' : '加入组局'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Game Modal */}
      {showCreateModal && (
        <CreateGameModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

// Create Game Modal Component
const CreateGameModal = ({ onClose }) => {
  const navigate = useNavigate();
  const { currentUser, createGame, getMerchants } = useApp();
  const [step, setStep] = useState(1);
  const [merchants] = useState(getMerchants());
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    gameType: '四川麻将',
    stake: '5元/番',
    startTime: '',
    maxPlayers: 4,
    description: ''
  });

  const gameTypes = ['四川麻将', '国标麻将', '广东麻将', '上海麻将'];
  const stakes = ['1元/番', '2元/番', '5元/番', '10元/番', '20元/番'];

  const handleSubmit = () => {
    const result = createGame({
      ...formData,
      merchantId: selectedMerchant.id,
      roomId: selectedRoom.id
    });
    if (result.success) {
      onClose();
      navigate('/games');
    }
  };

  const canProceed = () => {
    if (step === 1) return formData.title && formData.startTime;
    if (step === 2) return selectedMerchant && selectedRoom;
    return true;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">创建组局</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 px-6 py-4 bg-gray-50">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              <span className={`text-sm ${step >= s ? 'text-gray-800' : 'text-gray-400'}`}>
                {s === 1 ? '基本信息' : s === 2 ? '选择场地' : '确认创建'}
              </span>
              {s < 3 && <div className="w-8 h-px bg-gray-300 mx-2" />}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">组局标题 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="例如：周末欢乐麻将局"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">玩法类型</label>
                  <select
                    value={formData.gameType}
                    onChange={(e) => setFormData({ ...formData, gameType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {gameTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">底注</label>
                  <select
                    value={formData.stake}
                    onChange={(e) => setFormData({ ...formData, stake: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    {stakes.map(stake => <option key={stake} value={stake}>{stake}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">开始时间 *</label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">人数上限</label>
                <div className="flex gap-3">
                  {[2, 3, 4].map(num => (
                    <button
                      key={num}
                      onClick={() => setFormData({ ...formData, maxPlayers: num })}
                      className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.maxPlayers === num
                          ? 'border-red-600 bg-red-50 text-red-600'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {num}人
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">组局描述</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="介绍一下组局规则或备注信息..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 mb-4">选择商家和房间</p>
              
              {merchants.map((merchant) => (
                <div key={merchant.id} className="border border-gray-200 rounded-xl overflow-hidden">
                  <div 
                    className={`p-4 cursor-pointer transition-all ${
                      selectedMerchant?.id === merchant.id ? 'bg-red-50 border-b border-red-200' : 'bg-gray-50 border-b border-gray-200'
                    }`}
                    onClick={() => { setSelectedMerchant(merchant); setSelectedRoom(null); }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-800">{merchant.merchantInfo.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{merchant.merchantInfo.address}</p>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedMerchant?.id === merchant.id ? 'border-red-600 bg-red-600' : 'border-gray-300'
                      }`}>
                        {selectedMerchant?.id === merchant.id && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                      </div>
                    </div>
                  </div>

                  {selectedMerchant?.id === merchant.id && (
                    <div className="p-4 bg-white">
                      <p className="text-sm font-medium text-gray-700 mb-3">选择房间：</p>
                      <div className="grid grid-cols-2 gap-3">
                        {merchant.merchantInfo.rooms.map((room) => (
                          <button
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${
                              selectedRoom?.id === room.id
                                ? 'border-red-600 bg-red-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <p className="font-medium text-gray-800">{room.name}</p>
                            <p className="text-sm text-gray-500">{room.capacity}人桌 · ¥{room.price}/小时</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-800 mb-4">组局信息确认</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">标题</span>
                    <span className="font-medium text-gray-800">{formData.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">玩法</span>
                    <span className="font-medium text-gray-800">{formData.gameType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">底注</span>
                    <span className="font-medium text-red-600">{formData.stake}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">开始时间</span>
                    <span className="font-medium text-gray-800">{formData.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">人数</span>
                    <span className="font-medium text-gray-800">{formData.maxPlayers}人</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">商家</span>
                      <span className="font-medium text-gray-800">{selectedMerchant?.merchantInfo.name}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-500">房间</span>
                      <span className="font-medium text-gray-800">{selectedRoom?.name}</span>
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-gray-500">房间价格</span>
                      <span className="font-medium text-red-600">¥{selectedRoom?.price}/小时</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-6 border-t border-gray-200">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
          >
            {step === 1 ? '取消' : '上一步'}
          </button>
          <button
            onClick={() => step < 3 ? setStep(step + 1) : handleSubmit()}
            disabled={!canProceed()}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === 3 ? '确认创建' : '下一步'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Plus, Users, Clock, MapPin, X, Check, UserPlus, LogOut, Search, Filter } from 'lucide-react';

export const Lobby = () => {
  const { user, games, merchants, rooms, createGame, joinGame, leaveGame } = useApp();
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'hasRoom' | 'noRoom'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [gameForm, setGameForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    maxPlayers: 4,
    merchantId: '',
    roomId: ''
  });

  const selectedMerchant = merchants.find(m => m.id === gameForm.merchantId);
  const selectedRooms = rooms.filter(r => r.merchantId === gameForm.merchantId);
  const selectedRoom = rooms.find(r => r.id === gameForm.roomId);

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'hasRoom') return matchesSearch && game.roomId;
    if (filter === 'noRoom') return matchesSearch && !game.roomId;
    return matchesSearch;
  });

  const handleCreateGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    createGame({
      creatorId: user.id,
      creatorName: user.username,
      ...gameForm,
      merchantName: selectedMerchant?.name,
      roomName: selectedRoom?.name,
      pricePerHour: selectedRoom?.pricePerHour
    });

    setShowCreateModal(false);
    setGameForm({
      title: '',
      description: '',
      date: '',
      time: '',
      maxPlayers: 4,
      merchantId: '',
      roomId: ''
    });
  };

  const handleJoinGame = (gameId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    joinGame(gameId, { id: user.id, name: user.username, avatar: user.avatar });
  };

  const handleLeaveGame = (gameId: string) => {
    if (!user) return;
    leaveGame(gameId, user.id);
  };

  const isPlayerInGame = (game: typeof games[0]) => {
    if (!user) return false;
    return game.players.some(p => p.id === user.id);
  };

  const isGameFull = (game: typeof games[0]) => {
    return game.currentPlayers >= game.maxPlayers;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">组局大厅</h1>
            <p className="text-white/60">找到志同道合的麻友，随时开玩</p>
          </div>
          <button
            onClick={() => user ? setShowCreateModal(true) : navigate('/login')}
            className="px-6 py-3 btn-gradient text-white rounded-xl font-bold flex items-center gap-2 animate-pulse-glow"
          >
            <Plus size={20} />
            创建组局
          </button>
        </div>

        <div className="glass rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索组局..."
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-white/60" />
            {[
              { id: 'all', label: '全部' },
              { id: 'hasRoom', label: '有场地' },
              { id: 'noRoom', label: '待订场' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === f.id
                    ? 'bg-primary-500 text-white'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGames.map((game) => {
            const isInGame = isPlayerInGame(game);
            const gameFull = isGameFull(game);

            return (
              <div key={game.id} className="glass rounded-2xl p-6 card-hover">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{game.title}</h3>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {game.creatorName} 发起
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    gameFull
                      ? 'bg-gray-500/20 text-gray-400'
                      : isInGame
                        ? 'bg-mahjong-green/20 text-mahjong-green'
                        : 'bg-primary-500/20 text-primary-400'
                  }`}>
                    {gameFull ? '已满' : isInGame ? '已加入' : '招募中'}
                  </div>
                </div>

                <p className="text-white/70 mb-4">{game.description}</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Clock size={16} className="text-primary-400" />
                    {game.date} {game.time}
                  </div>
                  <div className="flex items-center gap-2 text-white/70 text-sm">
                    <Users size={16} className="text-mahjong-green" />
                    {game.currentPlayers}/{game.maxPlayers} 人
                  </div>
                </div>

                {game.roomId && (
                  <div className="p-3 bg-mahjong-green/10 rounded-xl mb-4">
                    <div className="flex items-center gap-2 text-mahjong-green text-sm mb-1">
                      <MapPin size={16} />
                      <span className="font-medium">{game.merchantName}</span>
                    </div>
                    <div className="text-white/70 text-sm">
                      {game.roomName} · ¥{game.pricePerHour}/小时
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  {game.players.map((player) => (
                    <div
                      key={player.id}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xl"
                      title={player.name}
                    >
                      {player.avatar}
                    </div>
                  ))}
                  {Array.from({ length: game.maxPlayers - game.currentPlayers }).map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center text-white/30"
                    >
                      ?
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {isInGame ? (
                    <button
                      onClick={() => handleLeaveGame(game.id)}
                      className="flex-1 py-3 bg-red-500/20 text-red-400 rounded-xl font-medium hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <LogOut size={18} />
                      退出组局
                    </button>
                  ) : gameFull ? (
                    <button
                      disabled
                      className="flex-1 py-3 bg-gray-500/20 text-gray-400 rounded-xl font-medium cursor-not-allowed"
                    >
                      人已满员
                    </button>
                  ) : (
                    <button
                      onClick={() => handleJoinGame(game.id)}
                      className="flex-1 py-3 btn-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2"
                    >
                      <UserPlus size={18} />
                      加入组局
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredGames.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Users size={64} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60 text-lg">暂无组局</p>
            <p className="text-white/40 text-sm mt-2">点击右上角创建第一个组局吧！</p>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">创建新组局</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all text-white/70"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateGame} className="space-y-5">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">组局标题 *</label>
                  <input
                    type="text"
                    required
                    value={gameForm.title}
                    onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                    placeholder="如：周末休闲局，新手友好"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">组局说明</label>
                  <textarea
                    rows={3}
                    value={gameForm.description}
                    onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })}
                    placeholder="简单说明一下规则、玩法、注意事项等"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-primary-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">日期 *</label>
                    <input
                      type="date"
                      required
                      value={gameForm.date}
                      onChange={(e) => setGameForm({ ...gameForm, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">时间 *</label>
                    <input
                      type="time"
                      required
                      value={gameForm.time}
                      onChange={(e) => setGameForm({ ...gameForm, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">人数</label>
                  <div className="flex gap-3">
                    {[2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGameForm({ ...gameForm, maxPlayers: num })}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                          gameForm.maxPlayers === num
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/5 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        {num}人局
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    选择场地（可选）
                  </label>
                  
                  <div className="mb-4">
                    <label className="block text-white/60 text-xs mb-2">选择棋牌室</label>
                    <select
                      value={gameForm.merchantId}
                      onChange={(e) => setGameForm({ ...gameForm, merchantId: e.target.value, roomId: '' })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-primary-500 transition-all"
                    >
                      <option value="">暂不选择场地</option>
                      {merchants.map((m) => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>

                  {gameForm.merchantId && selectedRooms.length > 0 && (
                    <div>
                      <label className="block text-white/60 text-xs mb-2">选择房间</label>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedRooms.map((room) => (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => setGameForm({ ...gameForm, roomId: room.id })}
                            className={`p-4 rounded-xl text-left transition-all ${
                              gameForm.roomId === room.id
                                ? 'bg-primary-500/30 border-2 border-primary-500'
                                : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                            }`}
                          >
                            <p className="font-medium text-white">{room.name}</p>
                            <p className="text-primary-400 font-bold">¥{room.pricePerHour}/小时</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {room.facilities.slice(0, 2).map((f, i) => (
                                <span key={i} className="text-xs text-white/50">{f}</span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 glass text-white rounded-xl font-medium hover:bg-white/20 transition-all"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 btn-gradient text-white rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    创建组局
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

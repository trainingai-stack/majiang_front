import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../data/store';
import { GameGroup, Room } from '../types';
import {
  Plus,
  Filter,
  Calendar,
  Users,
  MapPin,
  X,
  Clock,
} from 'lucide-react';

const LobbyPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [gameGroups, setGameGroups] = useState<GameGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<GameGroup[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GameGroup | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    loadGameGroups();
  }, []);

  useEffect(() => {
    filterGroups();
  }, [gameGroups, filterStatus, filterType]);

  const loadGameGroups = () => {
    const groups = dataStore.getGameGroups();
    setGameGroups(groups);
  };

  const filterGroups = () => {
    let filtered = [...gameGroups];
    if (filterStatus !== 'all') {
      filtered = filtered.filter((g) => g.status === filterStatus);
    }
    if (filterType !== 'all') {
      filtered = filtered.filter((g) => g.gameType === filterType);
    }
    setFilteredGroups(filtered);
  };

  const handleJoin = (groupId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const group = dataStore.getGameGroupById(groupId);
    if (group && !group.players.some((p) => p.id === user.id)) {
      dataStore.joinGameGroup(groupId, {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
      });
      loadGameGroups();
      setShowDetailModal(false);
    }
  };

  const handleLeave = (groupId: string) => {
    if (user) {
      dataStore.leaveGameGroup(groupId, user.id);
      loadGameGroups();
      setShowDetailModal(false);
    }
  };

  const handleDelete = (groupId: string) => {
    dataStore.deleteGameGroup(groupId);
    loadGameGroups();
    setShowDetailModal(false);
  };

  const openDetail = (group: GameGroup) => {
    setSelectedGroup(group);
    setShowDetailModal(true);
  };

  const getGameTypeName = (type: string) => {
    const types: Record<string, string> = {
      sichuan: '四川麻将',
      guangdong: '广东麻将',
      shanghai: '上海麻将',
      other: '其他',
    };
    return types[type] || type;
  };

  const getStatusName = (status: string) => {
    const statuses: Record<string, string> = {
      recruiting: '招募中',
      full: '已满员',
      playing: '进行中',
      finished: '已结束',
      cancelled: '已取消',
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      recruiting: 'bg-green-100 text-green-600',
      full: 'bg-yellow-100 text-yellow-600',
      playing: 'bg-blue-100 text-blue-600',
      finished: 'bg-gray-100 text-gray-600',
      cancelled: 'bg-red-100 text-red-600',
    };
    return colors[status] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">组局大厅</h1>
            <p className="text-gray-500 mt-1">找到志同道合的牌友，开始组局</p>
          </div>
          <button
            onClick={() => {
              if (!user) {
                navigate('/login');
              } else {
                setShowCreateModal(true);
              }
            }}
            className="btn-primary mt-4 md:mt-0 flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>创建组局</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter size={18} className="text-gray-400" />
              <span className="text-gray-600">筛选：</span>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mahjong-green"
            >
              <option value="all">全部状态</option>
              <option value="recruiting">招募中</option>
              <option value="full">已满员</option>
              <option value="playing">进行中</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-mahjong-green"
            >
              <option value="all">全部类型</option>
              <option value="sichuan">四川麻将</option>
              <option value="guangdong">广东麻将</option>
              <option value="shanghai">上海麻将</option>
              <option value="other">其他</option>
            </select>
          </div>
        </div>

        {filteredGroups.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <Users className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400">暂无组局</h3>
            <p className="text-gray-400 mt-2">快来创建第一个组局吧</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <div
                key={group.id}
                className="card cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => openDetail(group)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="px-3 py-1 bg-mahjong-green/10 text-mahjong-green text-sm rounded-full">
                    {getGameTypeName(group.gameType)}
                  </span>
                  <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(group.status)}`}>
                    {getStatusName(group.status)}
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
                    <MapPin size={16} className="mr-2" />
                    <span>{group.merchantName}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {group.players.slice(0, 4).map((player) => (
                        <img
                          key={player.id}
                          src={player.avatar}
                          alt={player.username}
                          className="w-8 h-8 rounded-full border-2 border-white"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">
                      {group.currentPlayers}/{group.maxPlayers}人
                    </span>
                  </div>
                  <span className="text-mahjong-green font-bold">¥{group.fee}/人</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateGameModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadGameGroups();
          }}
        />
      )}

      {showDetailModal && selectedGroup && (
        <GameDetailModal
          group={selectedGroup}
          onClose={() => setShowDetailModal(false)}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

interface CreateGameModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameType, setGameType] = useState('sichuan');
  const [scheduledTime, setScheduledTime] = useState('');
  const [duration, setDuration] = useState(4);
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [fee, setFee] = useState(30);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showRoomSelector, setShowRoomSelector] = useState(false);

  const rooms = dataStore.getRooms();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    dataStore.createGameGroup({
      creatorId: user.id,
      creatorName: user.username,
      title,
      description,
      gameType: gameType as GameGroup['gameType'],
      roomId: selectedRoom?.id,
      roomName: selectedRoom?.name,
      merchantId: selectedRoom?.merchantId,
      merchantName: selectedRoom?.merchantName,
      scheduledTime,
      duration,
      maxPlayers,
      fee,
    });
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">创建组局</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">组局标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：周末麻将局"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">详细描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下组局详情..."
              className="input-field min-h-[100px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">麻将类型</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
              className="input-field"
            >
              <option value="sichuan">四川麻将</option>
              <option value="guangdong">广东麻将</option>
              <option value="shanghai">上海麻将</option>
              <option value="other">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">开始时间</label>
            <input
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">时长(小时)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                min="1"
                max="12"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">人数</label>
              <input
                type="number"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                min="2"
                max="8"
                className="input-field"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">人均费用(元)</label>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              min="0"
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择房间（可选）</label>
            {selectedRoom ? (
              <div className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{selectedRoom.name}</div>
                  <div className="text-sm text-gray-500">{selectedRoom.merchantName}</div>
                  <div className="text-sm text-mahjong-green">¥{selectedRoom.price}/小时</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRoom(null)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <X size={20} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowRoomSelector(true)}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-mahjong-green hover:text-mahjong-green transition-colors"
              >
                <MapPin className="mx-auto mb-2" size={24} />
                <span>点击选择棋牌室房间</span>
              </button>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              取消
            </button>
            <button type="submit" className="btn-primary flex-1">
              创建组局
            </button>
          </div>
        </form>

        {showRoomSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">选择房间</h2>
                  <button onClick={() => setShowRoomSelector(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowRoomSelector(false);
                      }}
                      className="border rounded-lg p-4 cursor-pointer hover:border-mahjong-green hover:bg-mahjong-green/5 transition-all"
                    >
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
                      <p className="text-sm text-gray-500 mb-2">{room.merchantName}</p>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {room.facilities.slice(0, 3).map((f, i) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="text-mahjong-green font-bold">¥{room.price}/小时</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface GameDetailModalProps {
  group: GameGroup;
  onClose: () => void;
  onJoin: (groupId: string) => void;
  onLeave: (groupId: string) => void;
  onDelete: (groupId: string) => void;
}

const GameDetailModal: React.FC<GameDetailModalProps> = ({
  group,
  onClose,
  onJoin,
  onLeave,
  onDelete,
}) => {
  const { user } = useAuth();
  const isJoined = user && group.players.some((p) => p.id === user.id);
  const isCreator = user && group.creatorId === user.id;

  const getGameTypeName = (type: string) => {
    const types: Record<string, string> = {
      sichuan: '四川麻将',
      guangdong: '广东麻将',
      shanghai: '上海麻将',
      other: '其他',
    };
    return types[type] || type;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">{group.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="flex space-x-2 mb-4">
            <span className="px-3 py-1 bg-mahjong-green/10 text-mahjong-green text-sm rounded-full">
              {getGameTypeName(group.gameType)}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full ${
                group.status === 'recruiting'
                  ? 'bg-green-100 text-green-600'
                  : group.status === 'full'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {group.status === 'recruiting' ? '招募中' : group.status === 'full' ? '已满员' : '已结束'}
            </span>
          </div>

          <p className="text-gray-600 mb-6">{group.description}</p>

          <div className="space-y-4 mb-6">
            <div className="flex items-center text-gray-600">
              <Calendar size={20} className="mr-3 text-gray-400" />
              <span>时间：{group.scheduledTime}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock size={20} className="mr-3 text-gray-400" />
              <span>时长：{group.duration}小时</span>
            </div>
            {group.merchantName && (
              <div className="flex items-center text-gray-600">
                <MapPin size={20} className="mr-3 text-gray-400" />
                <span>
                  地点：{group.merchantName} {group.roomName && `- ${group.roomName}`}
                </span>
              </div>
            )}
            <div className="flex items-center text-gray-600">
              <Users size={20} className="mr-3 text-gray-400" />
              <span>人数：{group.currentPlayers}/{group.maxPlayers}人</span>
            </div>
            <div className="flex items-center text-mahjong-green font-bold">
              <span className="mr-3">¥</span>
              <span>费用：{group.fee}元/人</span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-3">参与玩家</h3>
            <div className="space-y-2">
              {group.players.map((player) => (
                <div key={player.id} className="flex items-center">
                  <img
                    src={player.avatar}
                    alt={player.username}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-medium">{player.username}</div>
                    {player.id === group.creatorId && (
                      <div className="text-xs text-mahjong-green">发起人</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex space-x-4">
            <button onClick={onClose} className="btn-secondary flex-1">
              关闭
            </button>
            {isCreator ? (
              <button onClick={() => onDelete(group.id)} className="btn-danger flex-1">
                取消组局
              </button>
            ) : isJoined ? (
              <button onClick={() => onLeave(group.id)} className="btn-danger flex-1">
                退出组局
              </button>
            ) : (
              <button
                onClick={() => onJoin(group.id)}
                disabled={group.status !== 'recruiting' || group.currentPlayers >= group.maxPlayers}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {group.status !== 'recruiting' ? '已结束' : group.currentPlayers >= group.maxPlayers ? '已满员' : '加入组局'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LobbyPage;
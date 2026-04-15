import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  MapPin, 
  Clock, 
  LogOut,
  MessageCircle,
  Crown
} from 'lucide-react';

const MyGames = () => {
  const { currentUser, games, leaveGame, users } = useApp();

  // 获取我参与的组局
  const myGames = games.filter(game => 
    game.currentPlayers.some(p => p.id === currentUser?.id)
  );

  const getMerchantInfo = (merchantId) => {
    const merchant = users.find(u => u.id === merchantId);
    return merchant?.merchantInfo;
  };

  const getRoomInfo = (merchantId, roomId) => {
    const merchant = users.find(u => u.id === merchantId);
    return merchant?.merchantInfo?.rooms.find(r => r.id === roomId);
  };

  const handleLeaveGame = (gameId) => {
    if (confirm('确定要退出这个组局吗？')) {
      leaveGame(gameId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="w-7 h-7 text-red-500" />
          我的组局
        </h1>
        <p className="text-gray-500 mt-2">管理您创建或参与的麻将组局</p>
      </div>

      {/* Games List */}
      {myGames.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">暂无组局</h3>
          <p className="text-gray-500">您还没有参与任何组局，快去组局大厅加入吧！</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myGames.map((game) => {
            const isCreator = game.creator.id === currentUser?.id;
            const merchantInfo = getMerchantInfo(game.merchantId);
            const roomInfo = getRoomInfo(game.merchantId, game.roomId);

            return (
              <div
                key={game.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 px-6 py-4 border-b border-red-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-800">{game.title}</h3>
                        {isCreator && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            创建者
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-sm">{game.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      game.status === 'open' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {game.status === 'open' ? '组局中' : '已结束'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">玩法类型</p>
                      <p className="font-medium text-gray-800">{game.gameType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">底注</p>
                      <p className="font-medium text-red-600">{game.stake}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">开始时间</p>
                      <p className="font-medium text-gray-800 flex items-center gap-1">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {game.startTime}
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-500 mb-1">人数</p>
                      <p className="font-medium text-gray-800">
                        {game.currentPlayers.length}/{game.maxPlayers}人
                      </p>
                    </div>
                  </div>

                  {/* Venue Info */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <h4 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      场地信息
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600/70">商家：</span>
                        <span className="text-blue-900 font-medium">{merchantInfo?.name}</span>
                      </div>
                      <div>
                        <span className="text-blue-600/70">房间：</span>
                        <span className="text-blue-900 font-medium">{roomInfo?.name}</span>
                      </div>
                      <div>
                        <span className="text-blue-600/70">地址：</span>
                        <span className="text-blue-900">{merchantInfo?.address}</span>
                      </div>
                      <div>
                        <span className="text-blue-600/70">价格：</span>
                        <span className="text-blue-900 font-medium">¥{roomInfo?.price}/小时</span>
                      </div>
                    </div>
                  </div>

                  {/* Players */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">参与玩家</h4>
                    <div className="flex flex-wrap gap-3">
                      {game.currentPlayers.map((player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-2 bg-gray-50 rounded-full pl-1 pr-3 py-1"
                        >
                          <img
                            src={player.avatar}
                            alt={player.nickname}
                            className="w-8 h-8 rounded-full border border-gray-200"
                          />
                          <span className="text-sm font-medium text-gray-700">{player.nickname}</span>
                          {player.id === game.creator.id && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                      ))}
                      {/* Empty slots */}
                      {Array.from({ length: game.maxPlayers - game.currentPlayers.length }).map((_, idx) => (
                        <div
                          key={`empty-${idx}`}
                          className="flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 border-2 border-dashed border-gray-300"
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">?</span>
                          </div>
                          <span className="text-sm text-gray-400">待加入</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all">
                      <MessageCircle className="w-5 h-5" />
                      进入群聊
                    </button>
                    <button
                      onClick={() => handleLeaveGame(game.id)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      退出组局
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyGames;

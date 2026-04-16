import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, Clock, Star, ChevronRight, Store } from 'lucide-react';

export const Merchants = () => {
  const { merchants, rooms } = useApp();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">棋牌室</h1>
          <p className="text-white/60">精选认证商家，环境舒适，设备专业</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => {
            const merchantRooms = rooms.filter(r => r.merchantId === merchant.id);
            const minPrice = Math.min(...merchantRooms.map(r => r.pricePerHour), 0);

            return (
              <div key={merchant.id} className="glass rounded-2xl overflow-hidden card-hover group">
                <div className="relative">
                  <img
                    src={merchant.image}
                    alt={merchant.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-mahjong-gold text-mahjong-blue rounded-full text-sm font-bold flex items-center gap-1">
                    <Star size={14} fill="currentColor" />
                    {merchant.rating}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{merchant.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <p className="text-white/70 text-sm flex items-start gap-2">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0 text-primary-400" />
                      {merchant.address}
                    </p>
                    <p className="text-white/70 text-sm flex items-center gap-2">
                      <Clock size={16} className="flex-shrink-0 text-mahjong-green" />
                      营业时间：{merchant.openTime} - {merchant.closeTime}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    {merchantRooms.slice(0, 3).map((room) => (
                      <span key={room.id} className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                        {room.name}
                      </span>
                    ))}
                    {merchantRooms.length > 3 && (
                      <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-lg">
                        +{merchantRooms.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary-400 font-bold text-xl">¥{minPrice}</span>
                      <span className="text-white/50 text-sm">/小时起</span>
                    </div>
                    <Link
                      to="/lobby"
                      className="px-4 py-2 btn-gradient text-white rounded-lg font-medium text-sm flex items-center gap-1"
                    >
                      预约房间
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {merchants.length === 0 && (
          <div className="glass rounded-2xl p-12 text-center">
            <Store size={64} className="mx-auto text-white/30 mb-4" />
            <p className="text-white/60 text-lg">暂无入驻商家</p>
            <p className="text-white/40 text-sm mt-2">敬请期待...</p>
          </div>
        )}
      </div>
    </div>
  );
};

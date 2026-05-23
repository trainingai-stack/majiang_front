import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dataStore } from '../data/store';
import { Merchant } from '../types';
import {
  Search,
  Star,
  MapPin,
  Phone,
  Clock,
  Filter,
} from 'lucide-react';

const MerchantsPage: React.FC = () => {
  const navigate = useNavigate();
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filteredMerchants, setFilteredMerchants] = useState<Merchant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState<Merchant | null>(null);

  useEffect(() => {
    loadMerchants();
  }, []);

  useEffect(() => {
    filterMerchants();
  }, [merchants, searchTerm]);

  const loadMerchants = () => {
    const approvedMerchants = dataStore.getMerchants().filter(m => m.status === 'approved');
    setMerchants(approvedMerchants);
  };

  const filterMerchants = () => {
    if (!searchTerm) {
      setFilteredMerchants(merchants);
    } else {
      const filtered = merchants.filter(
        (m) =>
          m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMerchants(filtered);
    }
  };

  const openDetail = (merchant: Merchant) => {
    setSelectedMerchant(merchant);
    setShowDetailModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">棋牌室</h1>
          <p className="text-gray-500 mt-1">发现附近优质棋牌室</p>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索棋牌室名称或地址..."
              className="input-field pl-10"
            />
          </div>
        </div>

        {filteredMerchants.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-bold text-gray-400">暂无棋牌室</h3>
            <p className="text-gray-400 mt-2">敬请期待更多商家入驻</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMerchants.map((merchant) => (
              <div
                key={merchant.id}
                className="card cursor-pointer"
                onClick={() => openDetail(merchant)}
              >
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={merchant.images[0] || 'https://via.placeholder.com/400x200'}
                    alt={merchant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold mb-2">{merchant.name}</h3>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {merchant.address}
                </p>
                <p className="text-gray-600 text-sm mb-3 flex items-center">
                  <Phone size={16} className="mr-1" />
                  {merchant.phone}
                </p>
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center text-yellow-500">
                    <Star size={16} className="fill-current" />
                    <span className="ml-1 font-medium">{merchant.rating}</span>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Clock size={16} className="mr-1" />
                    <span>{merchant.businessHours.open}-{merchant.businessHours.close}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDetailModal && selectedMerchant && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative h-64">
              <img
                src={selectedMerchant.images[0] || 'https://via.placeholder.com/800x400'}
                alt={selectedMerchant.name}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setShowDetailModal(false)}
                className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{selectedMerchant.name}</h2>
              <div className="flex items-center mb-4">
                <div className="flex items-center text-yellow-500 mr-4">
                  <Star size={18} className="fill-current" />
                  <span className="ml-1 font-medium">{selectedMerchant.rating}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock size={18} className="mr-1" />
                  <span>{selectedMerchant.businessHours.open} - {selectedMerchant.businessHours.close}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold mb-2">地址</h3>
                <p className="text-gray-600 flex items-center">
                  <MapPin size={18} className="mr-2" />
                  {selectedMerchant.address}
                </p>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold mb-2">电话</h3>
                <p className="text-gray-600 flex items-center">
                  <Phone size={18} className="mr-2" />
                  {selectedMerchant.phone}
                </p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-bold mb-2">简介</h3>
                <p className="text-gray-600">{selectedMerchant.description}</p>
              </div>

              {selectedMerchant.images.length > 1 && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">环境展示</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMerchant.images.slice(1).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`环境${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  navigate('/lobby');
                }}
                className="btn-primary w-full"
              >
                去组局
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantsPage;
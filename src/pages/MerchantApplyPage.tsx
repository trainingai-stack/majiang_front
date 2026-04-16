import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dataStore } from '../data/store';
import { Building2, MapPin, Phone, Clock, FileText, Upload, X, Check } from 'lucide-react';

const MerchantApplyPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: '',
    businessHoursOpen: '09:00',
    businessHoursClose: '23:00',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const merchant = dataStore.createMerchant({
      userId: user.id,
      name: formData.name,
      address: formData.address,
      phone: formData.phone,
      description: formData.description,
      images: [],
      businessHours: {
        open: formData.businessHoursOpen,
        close: formData.businessHoursClose,
      },
    });

    updateUser({ isMerchant: true, merchantId: merchant.id });
    
    setLoading(false);
    setSuccess(true);
    
    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen gradient-bg mahjong-pattern flex items-center justify-center py-12 px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-500" size={40} />
          </div>
          <h2 className="text-2xl font-bold mb-4">提交成功！</h2>
          <p className="text-gray-500 mb-6">您的商家入驻申请已提交，请耐心等待审核</p>
          <p className="text-sm text-gray-400">正在跳转到个人中心...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="gradient-bg p-6">
            <h1 className="text-2xl font-bold text-white">商家入驻申请</h1>
            <p className="text-white/80 mt-1">填写您的棋牌室信息</p>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-mahjong-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                  1
                </div>
                <div className="ml-2 text-sm">基本信息</div>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-4">
                <div className={`h-full bg-mahjong-green transition-all ${step >= 2 ? 'w-full' : 'w-0'}`}></div>
              </div>
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-mahjong-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                  2
                </div>
                <div className="ml-2 text-sm">营业信息</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">棋牌室名称</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入棋牌室名称"
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">详细地址</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="请输入详细地址"
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="请输入联系电话"
                        className="input-field pl-10"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (formData.name && formData.address && formData.phone) {
                        setStep(2);
                      } else {
                        alert('请填写完整信息');
                      }
                    }}
                    className="btn-primary w-full"
                  >
                    下一步
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">营业时间</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={formData.businessHoursOpen}
                          onChange={(e) => setFormData({ ...formData, businessHoursOpen: e.target.value })}
                          className="input-field pl-10"
                          required
                        />
                      </div>
                      <span className="text-gray-400">至</span>
                      <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="time"
                          value={formData.businessHoursClose}
                          onChange={(e) => setFormData({ ...formData, businessHoursClose: e.target.value })}
                          className="input-field pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">商家简介</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="请介绍您的棋牌室..."
                        className="input-field pl-10 min-h-[120px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="btn-secondary flex-1"
                    >
                      上一步
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary flex-1 disabled:opacity-50"
                    >
                      {loading ? '提交中...' : '提交申请'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantApplyPage;
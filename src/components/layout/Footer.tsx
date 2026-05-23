import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-mahjong-gold rounded-lg flex items-center justify-center">
                <span className="text-mahjong-green font-bold text-xl">麻</span>
              </div>
              <span className="text-xl font-bold">麻将组局</span>
            </div>
            <p className="text-gray-400 text-sm">
              专业的麻将组局平台，让找牌友变得更简单
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">快速链接</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">首页</a></li>
              <li><a href="/lobby" className="hover:text-white transition-colors">组局大厅</a></li>
              <li><a href="/merchants" className="hover:text-white transition-colors">棋牌室</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">帮助中心</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">使用指南</a></li>
              <li><a href="#" className="hover:text-white transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-white transition-colors">联系客服</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">联系我们</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>客服电话：400-123-4567</li>
              <li>工作时间：9:00-21:00</li>
              <li>邮箱：support@majiang.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2024 麻将组局平台. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Link } from 'react-router-dom';
import { Users, Store, Shield, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Home = () => {
  const { user, games, merchants } = useApp();

  const features = [
    {
      icon: Users,
      title: '快速组局',
      description: '一键发布局，实时匹配麻友，再也不用担心三缺一',
      color: 'text-mahjong-red'
    },
    {
      icon: Store,
      title: '优质场地',
      description: '精选认证棋牌室，环境舒适，设备专业',
      color: 'text-mahjong-green'
    },
    {
      icon: Shield,
      title: '安全保障',
      description: '实名认证商家，平台担保交易，放心娱乐',
      color: 'text-mahjong-blue'
    },
    {
      icon: Clock,
      title: '时间自由',
      description: '24小时随时组局，灵活安排时间',
      color: 'text-mahjong-gold'
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-white/80 mb-6">
                <span className="animate-pulse w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-sm">正在进行 {games.length} 局 · 入驻商家 {merchants.length} 家</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                告别<span className="text-primary-400">三缺一</span>
                <br />
                麻将组局从未如此简单
              </h1>
              
              <p className="text-lg text-white/70 mb-8 max-w-xl">
                连接百万麻友，精选优质场地，随时随地开启欢乐麻将时光
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/lobby"
                  className="px-8 py-4 btn-gradient text-white rounded-xl font-bold text-lg shadow-lg animate-pulse-glow"
                >
                  立即开始组局
                </Link>
                <Link
                  to="/merchants"
                  className="px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                >
                  查看棋牌室
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative w-full max-w-md mx-auto">
                <div className="glass rounded-3xl p-8 card-hover">
                  <div className="flex justify-center gap-2 mb-6">
                    {['🀇', '🀑', '🀘', '🀀'].map((tile, i) => (
                      <div
                        key={i}
                        className="mahjong-tile animate-float"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      >
                        {tile}
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎲</span>
                        <div>
                          <p className="text-white font-medium">周末休闲局</p>
                          <p className="text-white/50 text-sm">本周六 14:00</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-400 font-bold">3/4</p>
                        <p className="text-white/50 text-sm">差1人</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <p className="text-white font-medium">高手竞技场</p>
                          <p className="text-white/50 text-sm">今晚 19:00</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-mahjong-green font-bold">4/4</p>
                        <p className="text-white/50 text-sm">已满</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary-500/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-mahjong-green/30 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">为什么选择雀友汇</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              我们致力于为每一位麻将爱好者提供最佳的组局体验
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 card-hover text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center bg-white/10 ${feature.color}`}>
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass rounded-3xl p-8 md:p-12 text-center card-hover">
            <h2 className="text-3xl font-bold text-white mb-4">
              {user ? '准备好开始新一局了吗？' : '加入我们，开启麻将新体验'}
            </h2>
            <p className="text-white/60 mb-8 max-w-xl mx-auto">
              {user 
                ? '立即前往组局大厅，寻找志同道合的麻友'
                : '注册即送新人礼包，首次组局立减20元'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/lobby"
                    className="px-8 py-4 btn-gradient text-white rounded-xl font-bold text-lg"
                  >
                    去组局大厅
                  </Link>
                  <Link
                    to="/profile"
                    className="px-8 py-4 glass text-white rounded-xl font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    个人中心
                  </Link>
                </>
              ) : (
                <Link
                  to="/register"
                  className="px-8 py-4 btn-gradient text-white rounded-xl font-bold text-lg"
                >
                  立即注册
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🀇</span>
            <span className="text-lg font-bold text-white">雀友汇</span>
          </div>
          <p className="text-white/40 text-sm">
            © 2026 雀友汇 - 让麻将组局更简单 · 健康娱乐，禁止赌博
          </p>
        </div>
      </footer>
    </div>
  );
};

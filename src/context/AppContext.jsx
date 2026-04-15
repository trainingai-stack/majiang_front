import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  // 用户数据
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  // 用户列表
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        phone: '13800138000',
        password: '123456',
        nickname: '麻将达人',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        isMerchant: true,
        merchantInfo: {
          name: '欢乐棋牌室',
          address: '北京市朝阳区建国路88号',
          phone: '010-12345678',
          description: '环境优雅，设备齐全，欢迎光临！',
          businessHours: { start: '09:00', end: '02:00' },
          rooms: [
            { id: 'r1', name: 'VIP包间1', capacity: 4, price: 80, status: 'available' },
            { id: 'r2', name: 'VIP包间2', capacity: 4, price: 80, status: 'available' },
            { id: 'r3', name: '普通包间1', capacity: 4, price: 50, status: 'available' },
            { id: 'r4', name: '普通包间2', capacity: 4, price: 50, status: 'available' },
          ]
        }
      },
      {
        id: '2',
        phone: '13900139000',
        password: '123456',
        nickname: '雀神',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
        isMerchant: false,
        merchantInfo: null
      }
    ];
  });

  // 组局列表
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('games');
    return saved ? JSON.parse(saved) : [
      {
        id: 'g1',
        title: '周末欢乐麻将局',
        creator: { id: '2', nickname: '雀神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
        merchantId: '1',
        roomId: 'r1',
        gameType: '四川麻将',
        stake: '5元/番',
        startTime: '2026-04-16 14:00',
        maxPlayers: 4,
        currentPlayers: [
          { id: '2', nickname: '雀神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' }
        ],
        status: 'open',
        description: '休闲娱乐，欢迎新手加入！',
        createdAt: '2026-04-15T10:00:00'
      },
      {
        id: 'g2',
        title: '高手对决',
        creator: { id: '1', nickname: '麻将达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
        merchantId: '1',
        roomId: 'r2',
        gameType: '国标麻将',
        stake: '10元/番',
        startTime: '2026-04-16 19:00',
        maxPlayers: 4,
        currentPlayers: [
          { id: '1', nickname: '麻将达人', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
          { id: '2', nickname: '雀神', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' }
        ],
        status: 'open',
        description: '高手过招，切磋技艺',
        createdAt: '2026-04-15T09:00:00'
      }
    ];
  });

  // 商家入驻申请列表
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });

  // 保存到 localStorage
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  // 登录
  const login = (phone, password) => {
    const user = users.find(u => u.phone === phone && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: '手机号或密码错误' };
  };

  // 注册
  const register = (phone, password, nickname) => {
    if (users.find(u => u.phone === phone)) {
      return { success: false, message: '手机号已注册' };
    }
    const newUser = {
      id: Date.now().toString(),
      phone,
      password,
      nickname,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
      isMerchant: false,
      merchantInfo: null
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    return { success: true, user: newUser };
  };

  // 退出登录
  const logout = () => {
    setCurrentUser(null);
  };

  // 更新用户信息
  const updateUser = (updates) => {
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 申请商家入驻
  const applyMerchant = (merchantInfo) => {
    const application = {
      id: Date.now().toString(),
      userId: currentUser.id,
      status: 'pending',
      merchantInfo,
      createdAt: new Date().toISOString()
    };
    setApplications([...applications, application]);
    return { success: true };
  };

  // 批准商家入驻
  const approveMerchant = (applicationId) => {
    const application = applications.find(a => a.id === applicationId);
    if (application) {
      setApplications(applications.map(a => 
        a.id === applicationId ? { ...a, status: 'approved' } : a
      ));
      setUsers(users.map(u => 
        u.id === application.userId 
          ? { ...u, isMerchant: true, merchantInfo: application.merchantInfo }
          : u
      ));
      if (currentUser?.id === application.userId) {
        setCurrentUser({ ...currentUser, isMerchant: true, merchantInfo: application.merchantInfo });
      }
    }
  };

  // 更新商家信息
  const updateMerchantInfo = (updates) => {
    const updatedUser = { 
      ...currentUser, 
      merchantInfo: { ...currentUser.merchantInfo, ...updates } 
    };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
  };

  // 创建组局
  const createGame = (gameData) => {
    const newGame = {
      id: `g${Date.now()}`,
      creator: { 
        id: currentUser.id, 
        nickname: currentUser.nickname, 
        avatar: currentUser.avatar 
      },
      currentPlayers: [
        { id: currentUser.id, nickname: currentUser.nickname, avatar: currentUser.avatar }
      ],
      status: 'open',
      createdAt: new Date().toISOString(),
      ...gameData
    };
    setGames([newGame, ...games]);
    return { success: true, game: newGame };
  };

  // 加入组局
  const joinGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return { success: false, message: '组局不存在' };
    if (game.status !== 'open') return { success: false, message: '组局已结束或已满' };
    if (game.currentPlayers.find(p => p.id === currentUser.id)) {
      return { success: false, message: '您已在该组局中' };
    }
    if (game.currentPlayers.length >= game.maxPlayers) {
      return { success: false, message: '组局已满员' };
    }
    
    const updatedGame = {
      ...game,
      currentPlayers: [...game.currentPlayers, { 
        id: currentUser.id, 
        nickname: currentUser.nickname, 
        avatar: currentUser.avatar 
      }]
    };
    setGames(games.map(g => g.id === gameId ? updatedGame : g));
    return { success: true };
  };

  // 退出组局
  const leaveGame = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return { success: false, message: '组局不存在' };
    
    const updatedPlayers = game.currentPlayers.filter(p => p.id !== currentUser.id);
    let updatedGame = { ...game, currentPlayers: updatedPlayers };
    
    // 如果退出后没有玩家了，删除组局
    if (updatedPlayers.length === 0) {
      setGames(games.filter(g => g.id !== gameId));
      return { success: true };
    }
    
    // 如果创建者退出，转让创建者身份
    if (game.creator.id === currentUser.id && updatedPlayers.length > 0) {
      updatedGame.creator = updatedPlayers[0];
    }
    
    setGames(games.map(g => g.id === gameId ? updatedGame : g));
    return { success: true };
  };

  // 获取商家列表
  const getMerchants = () => {
    return users.filter(u => u.isMerchant);
  };

  // 获取商家房间
  const getMerchantRooms = (merchantId) => {
    const merchant = users.find(u => u.id === merchantId);
    return merchant?.merchantInfo?.rooms || [];
  };

  const value = {
    currentUser,
    users,
    games,
    applications,
    login,
    register,
    logout,
    updateUser,
    applyMerchant,
    approveMerchant,
    updateMerchantInfo,
    createGame,
    joinGame,
    leaveGame,
    getMerchants,
    getMerchantRooms
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

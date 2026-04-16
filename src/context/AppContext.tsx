import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  role: 'user' | 'merchant' | 'pending';
  balance: number;
  gamesCount: number;
}

interface Merchant {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  rating: number;
  image: string;
  openTime: string;
  closeTime: string;
}

interface Room {
  id: string;
  merchantId: string;
  name: string;
  pricePerHour: number;
  capacity: number;
  facilities: string[];
  image: string;
}

interface Game {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  date: string;
  time: string;
  currentPlayers: number;
  maxPlayers: number;
  players: { id: string; name: string; avatar: string }[];
  roomId?: string;
  merchantId?: string;
  roomName?: string;
  merchantName?: string;
  pricePerHour?: number;
  status: 'waiting' | 'playing' | 'finished';
}

interface AppContextType {
  user: User | null;
  merchants: Merchant[];
  rooms: Room[];
  games: Game[];
  login: (phone: string, password: string) => boolean;
  register: (username: string, phone: string, password: string) => boolean;
  logout: () => void;
  applyMerchant: (data: Partial<Merchant>) => void;
  addMerchant: (merchant: Merchant) => void;
  addRoom: (room: Room) => void;
  updateRoom: (roomId: string, data: Partial<Room>) => void;
  deleteRoom: (roomId: string) => void;
  createGame: (game: Omit<Game, 'id' | 'currentPlayers' | 'players' | 'status'>) => void;
  joinGame: (gameId: string, player: { id: string; name: string; avatar: string }) => boolean;
  leaveGame: (gameId: string, userId: string) => void;
  approveMerchant: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialMerchants: Merchant[] = [
  {
    id: '1',
    userId: '2',
    name: '金牌棋牌室',
    address: '北京市朝阳区建国路88号SOHO现代城3层',
    phone: '010-88888888',
    description: '豪华装修，新风系统，免费茶水小吃，24小时营业',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1559091251-69132ccd0f82?auto=format&fit=crop&q=80&w=400&h=300',
    openTime: '09:00',
    closeTime: '24:00'
  },
  {
    id: '2',
    userId: '3',
    name: '雀友汇棋牌会所',
    address: '上海市浦东新区陆家嘴环路1000号恒生银行大厦B1层',
    phone: '021-66666666',
    description: '专业比赛级麻将桌，真皮座椅，VIP包间',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=400&h=300',
    openTime: '10:00',
    closeTime: '02:00'
  }
];

const initialRooms: Room[] = [
  {
    id: '1',
    merchantId: '1',
    name: '豪华包间A',
    pricePerHour: 68,
    capacity: 4,
    facilities: ['独立卫生间', '新风系统', '免费茶水', '吸烟区'],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: '2',
    merchantId: '1',
    name: '标准包间B',
    pricePerHour: 48,
    capacity: 4,
    facilities: ['新风系统', '免费茶水'],
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=400&h=300'
  },
  {
    id: '3',
    merchantId: '2',
    name: 'VIP钻石包间',
    pricePerHour: 128,
    capacity: 6,
    facilities: ['独立卫生间', '真皮沙发', '茶台', '电视', '用餐区'],
    image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80&w=400&h=300'
  }
];

const initialGames: Game[] = [
  {
    id: '1',
    creatorId: '1',
    creatorName: '麻将小王子',
    title: '周末休闲局，新手友好',
    description: '周末下午轻松娱乐，输赢不大，主要是交朋友~',
    date: '2026-04-18',
    time: '14:00',
    currentPlayers: 2,
    maxPlayers: 4,
    players: [
      { id: '1', name: '麻将小王子', avatar: '🀄' },
      { id: '2', name: '雀神在手', avatar: '🎲' }
    ],
    roomId: '1',
    merchantId: '1',
    roomName: '豪华包间A',
    merchantName: '金牌棋牌室',
    pricePerHour: 68,
    status: 'waiting'
  },
  {
    id: '2',
    creatorId: '3',
    creatorName: '雀后大人',
    title: '高手竞技局，川麻血战到底',
    description: '只接受有经验玩家，血战到底规则，打够8圈',
    date: '2026-04-17',
    time: '19:00',
    currentPlayers: 3,
    maxPlayers: 4,
    players: [
      { id: '3', name: '雀后大人', avatar: '👑' },
      { id: '4', name: '清一色', avatar: '🀇' },
      { id: '5', name: '杠上花', avatar: '🌸' }
    ],
    status: 'waiting'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [merchants, setMerchants] = useState<Merchant[]>(initialMerchants);
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [games, setGames] = useState<Game[]>(initialGames);

  useEffect(() => {
    const savedUser = localStorage.getItem('majiang_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('majiang_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('majiang_user');
    }
  }, [user]);

  const login = (phone: string, _password: string): boolean => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: '麻将小王子',
        phone: '13800138000',
        avatar: '🀄',
        role: 'user',
        balance: 256,
        gamesCount: 28
      },
      {
        id: '2',
        username: '金牌老板',
        phone: '13900139000',
        avatar: '🏆',
        role: 'merchant',
        balance: 5800,
        gamesCount: 0
      }
    ];
    const foundUser = mockUsers.find(u => u.phone === phone);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const register = (username: string, phone: string, _password: string): boolean => {
    const newUser: User = {
      id: Date.now().toString(),
      username,
      phone,
      avatar: '🎮',
      role: 'user',
      balance: 0,
      gamesCount: 0
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const applyMerchant = (_data: Partial<Merchant>) => {
    if (user) {
      setUser({ ...user, role: 'pending' });
    }
  };

  const approveMerchant = (userId: string) => {
    if (user && user.id === userId) {
      setUser({ ...user, role: 'merchant' });
    }
  };

  const addMerchant = (merchant: Merchant) => {
    setMerchants([...merchants, merchant]);
  };

  const addRoom = (room: Room) => {
    setRooms([...rooms, room]);
  };

  const updateRoom = (roomId: string, data: Partial<Room>) => {
    setRooms(rooms.map(r => r.id === roomId ? { ...r, ...data } : r));
  };

  const deleteRoom = (roomId: string) => {
    setRooms(rooms.filter(r => r.id !== roomId));
  };

  const createGame = (game: Omit<Game, 'id' | 'currentPlayers' | 'players' | 'status'>) => {
    const newGame: Game = {
      ...game,
      id: Date.now().toString(),
      currentPlayers: 1,
      players: user ? [{ id: user.id, name: user.username, avatar: user.avatar }] : [],
      status: 'waiting'
    };
    setGames([newGame, ...games]);
  };

  const joinGame = (gameId: string, player: { id: string; name: string; avatar: string }): boolean => {
    const game = games.find(g => g.id === gameId);
    if (!game || game.currentPlayers >= game.maxPlayers) return false;
    
    if (game.players.some(p => p.id === player.id)) return false;

    setGames(games.map(g => 
      g.id === gameId 
        ? { ...g, currentPlayers: g.currentPlayers + 1, players: [...g.players, player] }
        : g
    ));
    return true;
  };

  const leaveGame = (gameId: string, userId: string) => {
    setGames(games.map(g => {
      if (g.id === gameId) {
        const newPlayers = g.players.filter(p => p.id !== userId);
        return {
          ...g,
          currentPlayers: newPlayers.length,
          players: newPlayers
        };
      }
      return g;
    }).filter(g => g.currentPlayers > 0));
  };

  return (
    <AppContext.Provider value={{
      user,
      merchants,
      rooms,
      games,
      login,
      register,
      logout,
      applyMerchant,
      addMerchant,
      addRoom,
      updateRoom,
      deleteRoom,
      createGame,
      joinGame,
      leaveGame,
      approveMerchant
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

import { User, Merchant, Room, GameGroup, Notification } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockUsers: User[] = [
  {
    id: '1',
    username: '张三',
    phone: '13800138001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    isMerchant: false,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    username: '李四',
    phone: '13800138002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    isMerchant: true,
    merchantId: '1',
    createdAt: '2024-01-02',
  },
  {
    id: '3',
    username: '王五',
    phone: '13800138003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3',
    isMerchant: true,
    merchantId: '2',
    createdAt: '2024-01-03',
  },
];

export const mockMerchants: Merchant[] = [
  {
    id: '1',
    userId: '2',
    name: '聚贤棋牌室',
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    description: '环境优雅，设施齐全，提供茶水服务。24小时营业，空调开放，免费WiFi。',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    ],
    businessHours: {
      open: '09:00',
      close: '23:00',
    },
    rating: 4.8,
    status: 'approved',
    createdAt: '2024-01-02',
  },
  {
    id: '2',
    userId: '3',
    name: '龙门棋牌会所',
    address: '北京市海淀区中关村大街66号',
    phone: '010-87654321',
    description: '高端棋牌会所，VIP包间，专业服务。提供餐饮服务，停车方便。',
    images: [
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
    ],
    businessHours: {
      open: '10:00',
      close: '02:00',
    },
    rating: 4.5,
    status: 'approved',
    createdAt: '2024-01-03',
  },
];

export const mockRooms: Room[] = [
  {
    id: '1',
    merchantId: '1',
    merchantName: '聚贤棋牌室',
    name: '标准间1号',
    type: 'standard',
    price: 30,
    capacity: 4,
    facilities: ['空调', 'WiFi', '茶水'],
    images: ['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400'],
    status: 'available',
  },
  {
    id: '2',
    merchantId: '1',
    merchantName: '聚贤棋牌室',
    name: 'VIP包间',
    type: 'vip',
    price: 50,
    capacity: 4,
    facilities: ['空调', 'WiFi', '茶水', '独立卫生间', '沙发'],
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'],
    status: 'available',
  },
  {
    id: '3',
    merchantId: '1',
    merchantName: '聚贤棋牌室',
    name: '豪华包间',
    type: 'premium',
    price: 80,
    capacity: 4,
    facilities: ['空调', 'WiFi', '茶水', '独立卫生间', '沙发', '电视', '麻将机'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'],
    status: 'available',
  },
  {
    id: '4',
    merchantId: '2',
    merchantName: '龙门棋牌会所',
    name: '普通房A',
    type: 'standard',
    price: 35,
    capacity: 4,
    facilities: ['空调', 'WiFi', '茶水'],
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400'],
    status: 'available',
  },
  {
    id: '5',
    merchantId: '2',
    merchantName: '龙门棋牌会所',
    name: 'VIP套房',
    type: 'vip',
    price: 60,
    capacity: 4,
    facilities: ['空调', 'WiFi', '茶水', '独立卫生间', '沙发', '麻将机'],
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'],
    status: 'available',
  },
];

export const mockGameGroups: GameGroup[] = [
  {
    id: '1',
    creatorId: '1',
    creatorName: '张三',
    title: '周末麻将局',
    description: '周六下午打麻将，缺两人，欢迎加入！',
    gameType: 'sichuan',
    roomId: '1',
    roomName: '标准间1号',
    merchantId: '1',
    merchantName: '聚贤棋牌室',
    scheduledTime: '2024-12-21 14:00',
    duration: 4,
    maxPlayers: 4,
    currentPlayers: 2,
    players: [
      {
        id: '1',
        username: '张三',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
        joinedAt: '2024-12-18 10:00',
      },
      {
        id: '4',
        username: '赵六',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        joinedAt: '2024-12-18 11:00',
      },
    ],
    status: 'recruiting',
    fee: 30,
    createdAt: '2024-12-18 10:00',
  },
  {
    id: '2',
    creatorId: '4',
    creatorName: '赵六',
    title: '晚上组局',
    description: '晚上7点开始，打4小时，AA制',
    gameType: 'guangdong',
    roomId: '2',
    roomName: 'VIP包间',
    merchantId: '1',
    merchantName: '聚贤棋牌室',
    scheduledTime: '2024-12-20 19:00',
    duration: 4,
    maxPlayers: 4,
    currentPlayers: 3,
    players: [
      {
        id: '4',
        username: '赵六',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4',
        joinedAt: '2024-12-17 15:00',
      },
      {
        id: '5',
        username: '钱七',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        joinedAt: '2024-12-17 16:00',
      },
      {
        id: '6',
        username: '孙八',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6',
        joinedAt: '2024-12-17 17:00',
      },
    ],
    status: 'recruiting',
    fee: 50,
    createdAt: '2024-12-17 15:00',
  },
  {
    id: '3',
    creatorId: '5',
    creatorName: '钱七',
    title: '新手局',
    description: '欢迎新手，轻松娱乐为主',
    gameType: 'shanghai',
    scheduledTime: '2024-12-22 10:00',
    duration: 3,
    maxPlayers: 4,
    currentPlayers: 1,
    players: [
      {
        id: '5',
        username: '钱七',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5',
        joinedAt: '2024-12-19 09:00',
      },
    ],
    status: 'recruiting',
    fee: 25,
    createdAt: '2024-12-19 09:00',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'info',
    title: '组局提醒',
    message: '您参与的"周末麻将局"将于明天下午2点开始',
    read: false,
    createdAt: '2024-12-20 10:00',
  },
  {
    id: '2',
    type: 'success',
    title: '组局成功',
    message: '您创建的组局已有玩家加入',
    read: true,
    createdAt: '2024-12-19 15:00',
  },
];

class DataStore {
  private users: User[] = [...mockUsers];
  private merchants: Merchant[] = [...mockMerchants];
  private rooms: Room[] = [...mockRooms];
  private gameGroups: GameGroup[] = [...mockGameGroups];
  private notifications: Notification[] = [...mockNotifications];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByPhone(phone: string): User | undefined {
    return this.users.find(u => u.phone === phone);
  }

  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: generateId(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(id: string, updates: Partial<User>): User | undefined {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updates };
      return this.users[index];
    }
    return undefined;
  }

  getMerchants(): Merchant[] {
    return this.merchants;
  }

  getMerchantById(id: string): Merchant | undefined {
    return this.merchants.find(m => m.id === id);
  }

  getMerchantByUserId(userId: string): Merchant | undefined {
    return this.merchants.find(m => m.userId === userId);
  }

  createMerchant(merchant: Omit<Merchant, 'id' | 'createdAt' | 'rating' | 'status'>): Merchant {
    const newMerchant: Merchant = {
      ...merchant,
      id: generateId(),
      rating: 0,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.merchants.push(newMerchant);
    return newMerchant;
  }

  updateMerchant(id: string, updates: Partial<Merchant>): Merchant | undefined {
    const index = this.merchants.findIndex(m => m.id === id);
    if (index !== -1) {
      this.merchants[index] = { ...this.merchants[index], ...updates };
      return this.merchants[index];
    }
    return undefined;
  }

  getRooms(): Room[] {
    return this.rooms;
  }

  getRoomsByMerchantId(merchantId: string): Room[] {
    return this.rooms.filter(r => r.merchantId === merchantId);
  }

  getRoomById(id: string): Room | undefined {
    return this.rooms.find(r => r.id === id);
  }

  createRoom(room: Omit<Room, 'id'>): Room {
    const newRoom: Room = {
      ...room,
      id: generateId(),
    };
    this.rooms.push(newRoom);
    return newRoom;
  }

  updateRoom(id: string, updates: Partial<Room>): Room | undefined {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rooms[index] = { ...this.rooms[index], ...updates };
      return this.rooms[index];
    }
    return undefined;
  }

  deleteRoom(id: string): boolean {
    const index = this.rooms.findIndex(r => r.id === id);
    if (index !== -1) {
      this.rooms.splice(index, 1);
      return true;
    }
    return false;
  }

  getGameGroups(): GameGroup[] {
    return this.gameGroups;
  }

  getGameGroupById(id: string): GameGroup | undefined {
    return this.gameGroups.find(g => g.id === id);
  }

  getGameGroupsByCreatorId(creatorId: string): GameGroup[] {
    return this.gameGroups.filter(g => g.creatorId === creatorId);
  }

  createGameGroup(group: Omit<GameGroup, 'id' | 'createdAt' | 'currentPlayers' | 'players' | 'status'>): GameGroup {
    const newGroup: GameGroup = {
      ...group,
      id: generateId(),
      currentPlayers: 1,
      players: [
        {
          id: group.creatorId,
          username: group.creatorName,
          avatar: this.getUserById(group.creatorId)?.avatar || '',
          joinedAt: new Date().toISOString(),
        },
      ],
      status: 'recruiting',
      createdAt: new Date().toISOString(),
    };
    this.gameGroups.push(newGroup);
    return newGroup;
  }

  joinGameGroup(groupId: string, player: { id: string; username: string; avatar: string }): GameGroup | undefined {
    const group = this.getGameGroupById(groupId);
    if (group && group.currentPlayers < group.maxPlayers && group.status === 'recruiting') {
      group.players.push({
        ...player,
        joinedAt: new Date().toISOString(),
      });
      group.currentPlayers++;
      if (group.currentPlayers === group.maxPlayers) {
        group.status = 'full';
      }
      return group;
    }
    return undefined;
  }

  leaveGameGroup(groupId: string, playerId: string): GameGroup | undefined {
    const group = this.getGameGroupById(groupId);
    if (group) {
      const playerIndex = group.players.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        group.players.splice(playerIndex, 1);
        group.currentPlayers--;
        group.status = 'recruiting';
        if (group.creatorId === playerId && group.players.length > 0) {
          group.creatorId = group.players[0].id;
          group.creatorName = group.players[0].username;
        }
        return group;
      }
    }
    return undefined;
  }

  deleteGameGroup(groupId: string): boolean {
    const index = this.gameGroups.findIndex(g => g.id === groupId);
    if (index !== -1) {
      this.gameGroups.splice(index, 1);
      return true;
    }
    return false;
  }

  getNotifications(): Notification[] {
    return this.notifications;
  }

  createNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.push(newNotification);
    return newNotification;
  }

  markNotificationAsRead(id: string): boolean {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      return true;
    }
    return false;
  }
}

export const dataStore = new DataStore();

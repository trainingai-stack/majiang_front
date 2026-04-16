export interface User {
  id: string;
  username: string;
  phone: string;
  avatar: string;
  isMerchant: boolean;
  merchantId?: string;
  createdAt: string;
}

export interface Merchant {
  id: string;
  userId: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  images: string[];
  businessHours: {
    open: string;
    close: string;
  };
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Room {
  id: string;
  merchantId: string;
  merchantName: string;
  name: string;
  type: 'standard' | 'vip' | 'premium';
  price: number;
  capacity: number;
  facilities: string[];
  images: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

export interface GameGroup {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  gameType: 'sichuan' | 'guangdong' | 'shanghai' | 'other';
  roomId?: string;
  roomName?: string;
  merchantId?: string;
  merchantName?: string;
  scheduledTime: string;
  duration: number;
  maxPlayers: number;
  currentPlayers: number;
  players: Player[];
  status: 'recruiting' | 'full' | 'playing' | 'finished' | 'cancelled';
  fee: number;
  createdAt: string;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  joinedAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

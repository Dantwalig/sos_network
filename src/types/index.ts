// src/types/index.ts
export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  location: GeoLocation;
  isVerified: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'moto' | 'taxi' | 'volunteer';
  location: GeoLocation;
  trustScore: number;
  totalRides: number;
  badges: string[];
  isAvailable: boolean;
  distance?: number;
  eta?: number;
}

export interface SOSRequest {
  id: string;
  userId: string;
  userName: string;
  category: 'medical' | 'maternity' | 'injury' | 'safety' | 'disability';
  location: GeoLocation;
  status: 'pending' | 'assigned' | 'pickup' | 'completed' | 'cancelled';
  driverId?: string;
  driverName?: string;
  verificationCode: string;
  createdAt: Date;
  assignedAt?: Date;
  pickedUpAt?: Date;
  completedAt?: Date;
  isOffline: boolean;
  channel: 'app' | 'ussd' | 'sms';
}

export interface SectorEventLog {
  id: string;
  sosId: string;
  type: 'created' | 'broadcast' | 'assigned' | 'pickup' | 'completed';
  message: string;
  timestamp: Date;
}
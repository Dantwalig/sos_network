'use client'
import React, { useState, useEffect } from 'react';
import { AlertCircle, Phone, MapPin, Clock, Shield, Zap, Users, CheckCircle, Radio, Wifi, WifiOff, Star, Award, Target, Navigation, Car, User, Bell, AlertTriangle, Activity } from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  location: GeoLocation;
  isVerified: boolean;
}

interface Driver {
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

interface SOSRequest {
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

interface SectorEventLog {
  id: string;
  sosId: string;
  type: 'created' | 'broadcast' | 'assigned' | 'pickup' | 'completed';
  message: string;
  timestamp: Date;
}

// ============================================================================
// MOCK DATA & UTILITIES
// ============================================================================

const generateVerificationCode = () => Math.floor(1000 + Math.random() * 9000).toString();

const mockDrivers: Driver[] = [
  {
    id: 'd1',
    name: 'Jean-Baptiste',
    phone: '+250788123456',
    vehicleType: 'moto',
    location: { lat: -1.9536, lng: 30.0606, address: 'Kigali City' },
    trustScore: 98,
    totalRides: 234,
    badges: ['Trusted Responder', 'Swift Arrival', 'Certified Helper'],
    isAvailable: true
  },
  {
    id: 'd2',
    name: 'Marie Claire',
    phone: '+250788234567',
    vehicleType: 'taxi',
    location: { lat: -1.9442, lng: 30.0619, address: 'Remera' },
    trustScore: 95,
    totalRides: 189,
    badges: ['Trusted Responder', 'Night Hero'],
    isAvailable: true
  },
  {
    id: 'd3',
    name: 'Patrick',
    phone: '+250788345678',
    vehicleType: 'volunteer',
    location: { lat: -1.9706, lng: 30.1044, address: 'Nyarutarama' },
    trustScore: 92,
    totalRides: 156,
    badges: ['Community Hero', 'Verified Volunteer'],
    isAvailable: true
  }
];

const mockScenarios = [
  {
    id: 's1',
    title: 'Pregnant Mother - Emergency',
    user: 'Grace Uwase',
    category: 'maternity' as const,
    description: 'Labor started at night, need immediate transport to hospital',
    urgency: 'critical'
  },
  {
    id: 's2',
    title: 'Injured Youth - Urgent',
    user: 'David Mugisha',
    category: 'injury' as const,
    description: 'Motorcycle accident, leg injury needs medical attention',
    urgency: 'high'
  },
  {
    id: 's3',
    title: 'Disabled Person Transport',
    user: 'Claire Umutoni',
    category: 'disability' as const,
    description: 'Wheelchair user needs accessible transport to clinic',
    urgency: 'medium'
  },
  {
    id: 's4',
    title: 'Safety Emergency - Silent SOS',
    user: 'Anonymous',
    category: 'safety' as const,
    description: 'GBV survivor needs safe extraction',
    urgency: 'critical'
  }
];

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function EmergencySOSNetwork() {
  const [view, setView] = useState<'landing' | 'citizen' | 'driver' | 'dashboard'>('landing');
  const [isOnline, setIsOnline] = useState(true);
  const [activeSOSRequests, setActiveSOSRequests] = useState<SOSRequest[]>([]);
  const [eventLogs, setEventLogs] = useState<SectorEventLog[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Simulate offline mode
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.05) {
        setIsOnline(false);
        setTimeout(() => setIsOnline(true), 3000);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const createSOS = (category: SOSRequest['category'], channel: SOSRequest['channel'] = 'app') => {
    const newSOS: SOSRequest = {
      id: `sos_${Date.now()}`,
      userId: 'u1',
      userName: 'Grace Uwase',
      category,
      location: { lat: -1.9536, lng: 30.0606, address: 'Kigali, Gasabo District' },
      status: 'pending',
      verificationCode: generateVerificationCode(),
      createdAt: new Date(),
      isOffline: !isOnline,
      channel
    };

    setActiveSOSRequests(prev => [...prev, newSOS]);
    
    addLog({
      id: `log_${Date.now()}`,
      sosId: newSOS.id,
      type: 'created',
      message: `🚨 SOS created via ${channel.toUpperCase()} - ${category}`,
      timestamp: new Date()
    });

    // Simulate driver assignment after 2 seconds
    setTimeout(() => assignDriver(newSOS.id), 2000);
  };

  const assignDriver = (sosId: string) => {
    const driver = mockDrivers[0];
    const distance = Math.floor(Math.random() * 5 + 1);
    const eta = Math.floor(distance * 3);

    setActiveSOSRequests(prev => prev.map(sos => 
      sos.id === sosId 
        ? { 
            ...sos, 
            status: 'assigned', 
            driverId: driver.id, 
            driverName: driver.name,
            assignedAt: new Date()
          }
        : sos
    ));

    addLog({
      id: `log_${Date.now()}_assign`,
      sosId,
      type: 'assigned',
      message: `✅ ${driver.name} (${driver.vehicleType}) assigned - ETA ${eta} min`,
      timestamp: new Date()
    });
  };

  const addLog = (log: SectorEventLog) => {
    setEventLogs(prev => [log, ...prev]);
  };

  // ============================================================================
  // LANDING PAGE
  // ============================================================================

  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 via-white to-orange-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-r from-red-600 to-orange-600 opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-red-600 p-4 rounded-full animate-pulse">
                  <AlertCircle className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                Emergency Transport SOS Network
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Hyper-local community emergency response system connecting citizens with verified drivers instantly - even offline
              </p>
              
              {/* Key Features */}
              <div className="grid md:grid-cols-3 gap-6 mt-12 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-red-100 hover:border-red-300 transition-all">
                  <Zap className="w-12 h-12 text-red-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Triple-Channel SOS</h3>
                  <p className="text-gray-600 text-sm">App, USSD, SMS - works anywhere</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-orange-100 hover:border-orange-300 transition-all">
                  <Shield className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Verified Drivers</h3>
                  <p className="text-gray-600 text-sm">4-digit safety verification code</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border-2 border-yellow-100 hover:border-yellow-300 transition-all">
                  <Activity className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Real-Time Dashboard</h3>
                  <p className="text-gray-600 text-sm">Live sector monitoring & control</p>
                </div>
              </div>

              {/* Role Selection */}
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <button
                  onClick={() => setView('citizen')}
                  className="bg-linear-to-r from-red-600 to-red-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <User className="w-12 h-12 mx-auto mb-3" />
                  <div className="font-bold text-xl mb-2">Citizen App</div>
                  <div className="text-sm opacity-90">Request emergency transport</div>
                </button>
                
                <button
                  onClick={() => setView('driver')}
                  className="bg-linear-to-r from-orange-600 to-orange-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <Car className="w-12 h-12 mx-auto mb-3" />
                  <div className="font-bold text-xl mb-2">Driver App</div>
                  <div className="text-sm opacity-90">Respond to emergencies</div>
                </button>
                
                <button
                  onClick={() => setView('dashboard')}
                  className="bg-linear-to-r from-yellow-600 to-yellow-700 text-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                >
                  <Activity className="w-12 h-12 mx-auto mb-3" />
                  <div className="font-bold text-xl mb-2">Sector Office</div>
                  <div className="text-sm opacity-90">Monitor & manage responses</div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white py-12 border-t-2 border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-red-600">2.3s</div>
                <div className="text-gray-600 mt-2">Avg Response Time</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-orange-600">98%</div>
                <div className="text-gray-600 mt-2">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-600">24/7</div>
                <div className="text-gray-600 mt-2">Coverage</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">15K+</div>
                <div className="text-gray-600 mt-2">Lives Helped</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // CITIZEN APP
  // ============================================================================

  if (view === 'citizen') {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-orange-50">
        {/* Header */}
        <div className="bg-linear-to-r from-red-600 to-orange-600 text-white p-6 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => setView('landing')} className="hover:opacity-80">
              ← Back
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <AlertCircle className="w-8 h-8" />
              Emergency SOS
            </h1>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <>
                  <Wifi className="w-5 h-5" />
                  <span className="text-sm">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 animate-pulse" />
                  <span className="text-sm">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Offline Banner */}
          {!isOnline && (
            <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 mb-6 flex items-center gap-3">
              <WifiOff className="w-6 h-6 text-yellow-700" />
              <div>
                <div className="font-bold text-yellow-900">Offline Mode Active</div>
                <div className="text-sm text-yellow-700">SOS will be sent via SMS when connection is restored</div>
              </div>
            </div>
          )}

          {/* Emergency Categories */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-7 h-7 text-red-600" />
              Select Emergency Type
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { category: 'medical' as const, icon: '🏥', label: 'Medical Emergency', color: 'red' },
                { category: 'maternity' as const, icon: '🤰', label: 'Maternity/Labor', color: 'pink' },
                { category: 'injury' as const, icon: '🩹', label: 'Injury/Accident', color: 'orange' },
                { category: 'safety' as const, icon: '🛡️', label: 'Safety/GBV', color: 'purple' },
                { category: 'disability' as const, icon: '♿', label: 'Disability Support', color: 'blue' }
              ].map(({ category, icon, label, color }) => (
                <button
                  key={category}
                  onClick={() => createSOS(category)}
                  className={`bg-${color}-50 hover:bg-${color}-100 border-2 border-${color}-300 p-6 rounded-xl transition-all transform hover:scale-105 hover:shadow-lg`}
                >
                  <div className="text-4xl mb-2">{icon}</div>
                  <div className="font-bold text-lg text-gray-800">{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Alternative SOS Channels */}
          <div className="bg-linear-to-r from-orange-600 to-red-600 rounded-2xl shadow-xl p-8 text-white">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Radio className="w-6 h-6" />
              Alternative SOS Channels
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => createSOS('medical', 'ussd')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all"
              >
                <Phone className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">USSD</div>
                <div className="text-sm opacity-90">*123*911#</div>
              </button>
              <button
                onClick={() => createSOS('medical', 'sms')}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-lg transition-all"
              >
                <Bell className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">SMS</div>
                <div className="text-sm opacity-90">Text "SOS" to 911</div>
              </button>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Auto Location</div>
                <div className="text-sm opacity-90">GPS Enabled</div>
              </div>
            </div>
          </div>

          {/* Active SOS */}
          {activeSOSRequests.length > 0 && (
            <div className="mt-6 bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-600" />
                Active Emergency
              </h3>
              {activeSOSRequests.map(sos => (
                <div key={sos.id} className="border-2 border-green-200 rounded-xl p-6 bg-green-50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-600 p-3 rounded-full">
                        <CheckCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="font-bold text-lg">Help is on the way!</div>
                        <div className="text-sm text-gray-600">SOS #{sos.id.slice(-6)}</div>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold ${
                      sos.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {sos.status.toUpperCase()}
                    </div>
                  </div>

                  {sos.driverName && (
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <div className="font-bold text-gray-800 mb-2">Driver Assigned</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Car className="w-5 h-5 text-orange-600" />
                          <span className="font-semibold">{sos.driverName}</span>
                        </div>
                        <div className="text-sm text-gray-600">ETA: 5-8 min</div>
                      </div>
                    </div>
                  )}

                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-yellow-700" />
                      <span className="font-bold text-yellow-900">Verification Code</span>
                    </div>
                    <div className="text-3xl font-mono font-bold text-yellow-900 tracking-wider">
                      {sos.verificationCode}
                    </div>
                    <div className="text-sm text-yellow-700 mt-2">
                      Show this code to your driver upon arrival
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // DRIVER APP
  // ============================================================================

  if (view === 'driver') {
    const driver = mockDrivers[0];
    
    return (
      <div className="min-h-screen bg-linear-to-br from-orange-50 to-yellow-50">
        {/* Header */}
        <div className="bg-linear-to-r from-orange-600 to-yellow-600 text-white p-6 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button onClick={() => setView('landing')} className="hover:opacity-80">
              ← Back
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Car className="w-8 h-8" />
              Driver Dashboard
            </h1>
            <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-bold">
              AVAILABLE
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-6">
          {/* Driver Profile */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-linear-to-br from-orange-500 to-yellow-500 p-4 rounded-full text-white">
                  <User className="w-12 h-12" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{driver.name}</h2>
                  <div className="text-gray-600">{driver.vehicleType.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-yellow-600 mb-1">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="font-bold text-xl">{driver.trustScore}%</span>
                </div>
                <div className="text-sm text-gray-600">{driver.totalRides} rides</div>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {driver.badges.map(badge => (
                <div key={badge} className="bg-linear-to-r from-orange-100 to-yellow-100 border-2 border-orange-300 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                  <Award className="w-4 h-4 text-orange-600" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Incoming SOS Alerts */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="w-6 h-6 text-red-600 animate-pulse" />
              Incoming Emergency Alerts
            </h3>

            {activeSOSRequests.filter(sos => sos.status === 'pending').length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Radio className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>No active emergencies nearby</p>
                <p className="text-sm mt-2">You'll be notified when help is needed</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSOSRequests.filter(sos => sos.status === 'pending').map(sos => (
                  <div key={sos.id} className="border-2 border-red-300 rounded-xl p-6 bg-red-50 animate-pulse">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-6 h-6 text-red-600" />
                          <span className="font-bold text-lg text-red-900">EMERGENCY: {sos.category.toUpperCase()}</span>
                        </div>
                        <div className="text-gray-700 mb-1">Patient: {sos.userName}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          {sos.location.address}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Navigation className="w-4 h-4" />
                          ~2.3 km away · ETA 6 min
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(sos.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <button
                      onClick={() => assignDriver(sos.id)}
                      className="w-full bg-linear-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-6 h-6" />
                      I'M RESPONDING
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Mission */}
          {activeSOSRequests.some(sos => sos.status === 'assigned' && sos.driverId === driver.id) && (
            <div className="bg-linear-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                Active Mission
              </h3>
              {activeSOSRequests
                .filter(sos => sos.status === 'assigned' && sos.driverId === driver.id)
                .map(sos => (
                  <div key={sos.id}>
                    <div className="bg-white bg-opacity-20 rounded-xl p-6 mb-4">
                      <div className="font-bold text-2xl mb-2">{sos.userName}</div>
                      <div className="opacity-90 mb-4">{sos.location.address}</div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-5 h-5" />
                          <span>2.3 km</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-5 h-5" />
                          <span>6 min</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-400 text-yellow-900 rounded-xl p-6">
                      <div className="font-bold mb-2">Verification Code</div>
                      <div className="text-4xl font-mono font-bold tracking-wider">
                        {sos.verificationCode}
                      </div>
                      <div className="text-sm mt-2 opacity-80">
                        Confirm this code with the patient
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ============================================================================
  // SECTOR OFFICE DASHBOARD
  // ============================================================================

  if (view === 'dashboard') {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-purple-600 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button onClick={() => setView('landing')} className="hover:opacity-80">
              ← Back
            </button>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Activity className="w-8 h-8" />
              Sector Office - Live Command Center
            </h1>
            <div className="flex items-center gap-2">
              <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
              <span className="text-sm">LIVE</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-linear-to-br from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="w-8 h-8" />
                <span className="text-3xl font-bold">{activeSOSRequests.filter(s => s.status === 'pending').length}</span>
              </div>
              <div className="text-sm opacity-90">Pending SOS</div>
            </div>
            
            <div className="bg-linear-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Car className="w-8 h-8" />
                <span className="text-3xl font-bold">{activeSOSRequests.filter(s => s.status === 'assigned').length}</span>
              </div>
              <div className="text-sm opacity-90">En Route</div>
            </div>
            
            <div className="bg-linear-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8" />
                <span className="text-3xl font-bold">{activeSOSRequests.filter(s => s.status === 'completed').length}</span>
              </div>
              <div className="text-sm opacity-90">Completed</div>
            </div>
            
            <div className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-8 h-8" />
                <span className="text-3xl font-bold">{mockDrivers.filter(d => d.isAvailable).length}</span>
              </div>
              <div className="text-sm opacity-90">Available Drivers</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Active SOS Requests */}
            <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Activity className="w-6 h-6 text-indigo-600" />
                Active Emergency Requests
              </h2>
              
              <div className="space-y-3">
                {activeSOSRequests.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <AlertCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No active emergencies</p>
                    <button
                      onClick={() => createSOS('medical')}
                      className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                    >
                      Simulate Emergency
                    </button>
                  </div>
                ) : (
                  activeSOSRequests.map(sos => (
                    <div key={sos.id} className="border-2 border-gray-200 hover:border-indigo-300 rounded-xl p-4 transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">#{sos.id.slice(-6)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                              sos.status === 'pending' ? 'bg-red-100 text-red-700' :
                              sos.status === 'assigned' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {sos.status.toUpperCase()}
                            </span>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{sos.channel.toUpperCase()}</span>
                          </div>
                          <div className="text-sm text-gray-600 mb-1">{sos.userName} • {sos.category}</div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin className="w-4 h-4" />
                            {sos.location.address}
                          </div>
                          {sos.driverName && (
                            <div className="mt-2 flex items-center gap-2 text-sm">
                              <Car className="w-4 h-4 text-orange-600" />
                              <span className="font-semibold">{sos.driverName}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          {new Date(sos.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="bg-gray-50 rounded-lg p-3 text-xs">
                        <div className="flex items-center gap-2 text-green-600 mb-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>Created: {new Date(sos.createdAt).toLocaleTimeString()}</span>
                        </div>
                        {sos.assignedAt && (
                          <div className="flex items-center gap-2 text-green-600 mb-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>Assigned: {new Date(sos.assignedAt).toLocaleTimeString()}</span>
                          </div>
                        )}
                        {sos.status === 'pending' && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>Waiting for driver...</span>
                          </div>
                        )}
                        {sos.status === 'assigned' && (
                          <div className="flex items-center gap-2 text-yellow-600">
                            <Clock className="w-3 h-3 animate-pulse" />
                            <span>ETA: 5-8 minutes</span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {sos.status === 'assigned' && (
                        <button className="mt-3 w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold py-2 rounded-lg transition-all text-sm">
                          Reassign Driver
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Event Logs & Available Drivers */}
            <div className="space-y-6">
              {/* Real-Time Event Log */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Radio className="w-6 h-6 text-green-600" />
                  Live Event Log
                </h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {eventLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No events yet
                    </div>
                  ) : (
                    eventLogs.map(log => (
                      <div key={log.id} className="text-xs border-l-2 border-indigo-300 pl-3 py-2">
                        <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                        <div className="font-medium text-gray-800">{log.message}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Available Drivers */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-orange-600" />
                  Available Drivers
                </h2>
                <div className="space-y-3">
                  {mockDrivers.filter(d => d.isAvailable).map(driver => (
                    <div key={driver.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">{driver.name}</span>
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-bold">{driver.trustScore}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {driver.vehicleType.toUpperCase()} • {driver.totalRides} rides
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {driver.badges.slice(0, 2).map(badge => (
                          <span key={badge} className="text-xs bg-orange-50 text-orange-700 px-2 py-1 rounded-full">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mock Scenarios */}
          <div className="mt-6 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Demo Scenarios (Click to Simulate)
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {mockScenarios.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => {
                    setSelectedScenario(scenario.id);
                    createSOS(scenario.category);
                  }}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-4 rounded-xl text-left transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="font-bold">{scenario.title}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scenario.urgency === 'critical' ? 'bg-red-500' :
                      scenario.urgency === 'high' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}>
                      {scenario.urgency.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm opacity-90">{scenario.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
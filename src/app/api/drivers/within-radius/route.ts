import { NextRequest, NextResponse } from 'next/server';

const mockDrivers = [
  {
    id: 'd1',
    name: 'Jean-Baptiste',
    vehicleType: 'moto',
    location: { lat: -1.9536, lng: 30.0606 },
    trustScore: 98,
    isAvailable: true,
  },
  // ... more drivers
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = parseFloat(searchParams.get('lat') || '0');
  const lng = parseFloat(searchParams.get('lng') || '0');
  const radius = parseFloat(searchParams.get('radius') || '5');
  
  // Calculate distance for each driver
  const nearby = mockDrivers.filter(driver => {
    const distance = calculateDistance(
      { lat, lng },
      driver.location
    );
    return distance <= radius;
  });
  
  return NextResponse.json(nearby);
}

function calculateDistance(point1: any, point2: any): number {
  // Haversine formula
  const R = 6371; // Earth's radius in km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLng = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat * Math.PI / 180) * 
            Math.cos(point2.lat * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
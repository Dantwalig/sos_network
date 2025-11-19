import { NextRequest, NextResponse } from 'next/server';

interface SOSRequest {
  userId: string;
  userName: string;
  category: 'medical' | 'maternity' | 'injury' | 'safety' | 'disability';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  channel: 'app' | 'ussd' | 'sms';
}

// In-memory storage (replace with database)
const sosRequests = new Map();

export async function POST(request: NextRequest) {
  try {
    const body: SOSRequest = await request.json();
    
    const sos = {
      id: `sos_${Date.now()}`,
      ...body,
      status: 'pending',
      verificationCode: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      isOffline: false,
    };
    
    sosRequests.set(sos.id, sos);
    
    // TODO: Broadcast to nearby drivers
    // TODO: Log event to database
    
    return NextResponse.json(sos, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create SOS' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const allSOS = Array.from(sosRequests.values());
  return NextResponse.json(allSOS);
}
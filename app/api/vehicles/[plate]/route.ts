import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import { rateLimit } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: { plate: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const key = `veh:${ip}`;
    const rl = rateLimit(key);
    
    if (rl.limited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' }, 
        { 
          status: 429, 
          headers: { 'Retry-After': String(rl.retryAfter) } 
        }
      );
    }

    const plate = params.plate;
    const vehicle = db.getVehicleByPlate(plate);

    if (vehicle) {
      const owner = db.getOwnerById(vehicle.ownerId);
      const insurer = db.getInsurerById(vehicle.insurerId);
      const policyStatus = db.getPolicyStatus(vehicle.policyEndDate);

      return NextResponse.json({
        found: true,
        vehicle: {
          plate: vehicle.plate,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          policyNumber: vehicle.policyNumber,
          policyStartDate: vehicle.policyStartDate,
          policyEndDate: vehicle.policyEndDate,
          ...policyStatus
        },
        owner,
        insurer
      });
    } else {
      return NextResponse.json({
        found: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    console.error('Vehicle lookup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
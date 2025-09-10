import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { auditLog } from '@/lib/audit';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { plate: string } }
) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const key = `veh:${ip}`;
    const rl = rateLimit(key);
    if (rl.limited) {
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': String(rl.retryAfter) } });
    }
    const plate = params.plate;
    const vehicle = db.getVehicleByPlate(plate);

    if (vehicle) {
      const owner = db.getOwnerById(vehicle.ownerId);
      const insurer = db.getInsurerById(vehicle.insurerId);
      const policyStatus = db.getPolicyStatus(vehicle.policyEndDate);

      return Response.json({
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
      return Response.json({
        found: false,
        message: 'Vehicle not found'
      });
    }
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
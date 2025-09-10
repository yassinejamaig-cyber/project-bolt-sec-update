import { NextRequest } from 'next/server';
import { db } from '@/lib/database';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rl = rateLimit(`veh-bulk:${ip}`);
    if (rl.limited) {
      return Response.json({ error: 'Rate limit exceeded' }, { status: 429, headers: { 'Retry-After': '60' } });
    }

    const { plates } = await request.json();
    if (!Array.isArray(plates) || plates.length === 0) {
      return Response.json({ error: 'plates must be a non-empty array' }, { status: 400 });
    }

    const results = plates.map((plate: string) => {
      const vehicle = db.findVehicleByPlate(plate);
      if (!vehicle) return { plate, found: false };
      const insurer = db.getInsurerById(vehicle.insurerId);
      const status = db.getInsuranceStatus(vehicle.policyEndDate);
      return { plate, found: true, vehicle, insurer, status };
    });

    return Response.json({ results });
  } catch (e) {
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

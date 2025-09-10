import { NextResponse } from 'next/server';
import { getJwks } from '@/lib/keys';

export async function GET() {
  try {
    const jwks = getJwks();
    return NextResponse.json(jwks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
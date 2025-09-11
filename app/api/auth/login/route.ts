import { NextRequest, NextResponse } from 'next/server';
import { authenticate, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Login attempt:', { username, password: password ? '[PROVIDED]' : '[MISSING]' });

    const user = await authenticate(username, password);
    
    if (!user) {
      console.log('Login failed for username:', username);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('Creating token for user:', user.name);
    const token = await createToken(user);
    
    const response = NextResponse.json({ user });
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    console.log('Login successful for:', user.name);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
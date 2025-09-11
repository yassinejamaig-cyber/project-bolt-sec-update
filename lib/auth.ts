import { SignJWT, jwtVerify } from 'jose';
import { getPrivateKey, getPublicKey } from './keys';
import { db } from './database';

const privateKey = getPrivateKey();
const publicKey = getPublicKey();

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'officer' | 'supervisor' | 'admin';
}

export async function authenticate(username: string, password: string): Promise<User | null> {
  const officer = db.getOfficerByUsername(username);
  
  if (!officer || officer.password !== password) {
    return null;
  }

  return {
    id: officer.id,
    username: officer.username,
    name: officer.name,
    role: officer.role
  };
}

export async function createToken(user: User): Promise<string> {
  return await new SignJWT({ user })
    .setProtectedHeader({ alg: 'RS256', kid: 'dev-rsa-1' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(privateKey);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, publicKey);
    return payload.user as User;
  } catch {
    return null;
  }
}
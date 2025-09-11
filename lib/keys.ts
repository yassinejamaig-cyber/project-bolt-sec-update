import { createPrivateKey, createPublicKey, generateKeyPairSync, KeyObject } from 'crypto';

// Generate an RSA key pair for development if none is provided.
// In production, keys should be supplied via environment variables.
let privateKey: KeyObject;
let publicKey: KeyObject;

if (process.env.JWT_PRIVATE_KEY_PEM && process.env.JWT_PUBLIC_KEY_PEM) {
  privateKey = createPrivateKey(process.env.JWT_PRIVATE_KEY_PEM);
  publicKey = createPublicKey(process.env.JWT_PUBLIC_KEY_PEM);
} else {
  const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
  privateKey = pair.privateKey;
  publicKey = pair.publicKey;
}

export function getPrivateKey() {
  return privateKey;
}

export function getPublicKey() {
  return publicKey;
}

export function getJwks() {
  const jwk = publicKey.export({ format: 'jwk' }) as any;
  return {
    keys: [
      {
        ...jwk,
        kid: 'dev-rsa-1',
        use: 'sig',
        alg: 'RS256',
      },
    ],
  };
}


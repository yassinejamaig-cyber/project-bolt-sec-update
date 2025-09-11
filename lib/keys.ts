import { createPrivateKey, createPublicKey, generateKeyPairSync, KeyObject } from 'crypto';

// Use a shared global object so that keys persist across route bundles in Next.js.
// This avoids regenerating a new pair for each API route which would invalidate
// previously issued tokens.
interface KeyPair {
  privateKey: KeyObject;
  publicKey: KeyObject;
}

const globalForKeys = globalThis as unknown as { __jwtKeys?: KeyPair };

function loadKeys(): KeyPair {
  // Prefer environment-provided PEM strings so production deployments use
  // stable keys across restarts.
  if (process.env.JWT_PRIVATE_KEY_PEM && process.env.JWT_PUBLIC_KEY_PEM) {
    return {
      privateKey: createPrivateKey(process.env.JWT_PRIVATE_KEY_PEM),
      publicKey: createPublicKey(process.env.JWT_PUBLIC_KEY_PEM),
    };
  }

  // Fall back to a generated development pair, caching it on the global
  // object so all route modules share the same keys during a single process
  // lifetime.
  if (!globalForKeys.__jwtKeys) {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
    });
    globalForKeys.__jwtKeys = { privateKey, publicKey };
  }

  return globalForKeys.__jwtKeys;
}

export function getPrivateKey() {
  return loadKeys().privateKey;
}

export function getPublicKey() {
  return loadKeys().publicKey;
}

export function getJwks() {
  const jwk = getPublicKey().export({ format: 'jwk' }) as any;
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


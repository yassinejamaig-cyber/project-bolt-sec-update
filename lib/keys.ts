import { createPrivateKey, createPublicKey } from 'crypto';

// RSA PEMs from env in production. Dev fallback below (DO NOT use in prod).
const DEV_RSA_PRIVATE = process.env.JWT_PRIVATE_KEY_PEM || `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAqQm6eQW0x0Ww3lKk8lZQm0H1Vv0i7c6j6J5lVQYw0M5yH5p3
LRhCqz8kqZC2w7u5zq5QvOe2f9D3G2a5IhjZf2m8Q4E1Sg9p7x4c1qg8I7G9v3d2
VZk0C7b7o0E8E2k5ZJYQ1C2iLwJ3v+F7U5QZt7dC8eJfJH5yB4t8z5uU6aV5n+7C
H3Z9m5m6R8V2m6V6pG0l9h0o3m2k7n5l6m7n8o9p0q1r2s3t4u5v6wIDAQABAoIB
AHs4XlLWk8Gd6lTg8m2Lk3l2a1d8p7q5s6r7t8u9v0w1x2y3z4A5B6C7D8E9F0G1
...
-----END RSA PRIVATE KEY-----`;

const DEV_RSA_PUBLIC = process.env.JWT_PUBLIC_KEY_PEM || `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqQm6eQW0x0Ww3lKk8lZQ
m0H1Vv0i7c6j6J5lVQYw0M5yH5p3LRhCqz8kqZC2w7u5zq5QvOe2f9D3G2a5IhjZ
f2m8Q4E1Sg9p7x4c1qg8I7G9v3d2VZk0C7b7o0E8E2k5ZJYQ1C2iLwJ3v+F7U5QZ
t7dC8eJfJH5yB4t8z5uU6aV5n+7CH3Z9m5m6R8V2m6V6pG0l9h0o3m2k7n5l6m7n
8o9p0q1r2s3t4u5v6wIDAQAB
-----END PUBLIC KEY-----`;

export function getPrivateKey() {
  return createPrivateKey(DEV_RSA_PRIVATE);
}

export function getPublicKey() {
  return createPublicKey(DEV_RSA_PUBLIC);
}

// NOTE: JWKS static for demo. In prod, compute n,e from the RSA key or store pre-computed values.
export function getJwks() {
  return {
    keys: [
      {
        kty: "RSA",
        kid: "dev-rsa-1",
        use: "sig",
        alg: "RS256",
        n: "qQb...devN_base64url_truncated",
        e: "AQAB"
      }
    ]
  };
}

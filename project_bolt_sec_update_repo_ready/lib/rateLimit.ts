// Very simple in-memory rate limiter for demo purposes (per IP + route).
// For production, use a durable store (Redis) or a provider.
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // per window

type Hit = { ts: number };
const buckets = new Map<string, Hit[]>();

export function rateLimit(key: string) {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const arr = buckets.get(key) || [];
  const recent = arr.filter(h => h.ts >= windowStart);
  recent.push({ ts: now });
  buckets.set(key, recent);
  if (recent.length > MAX_REQUESTS) {
    return { limited: true, retryAfter: 60 };
  }
  return { limited: false };
}

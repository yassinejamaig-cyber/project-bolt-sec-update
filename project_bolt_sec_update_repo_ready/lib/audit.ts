import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const LOG_PATH = process.env.AUDIT_LOG_PATH || path.join(process.cwd(), 'data', 'audit.log');

function ensureDir() {
  const dir = path.dirname(LOG_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(LOG_PATH)) fs.writeFileSync(LOG_PATH, '', 'utf-8');
}

function lastHash(): string {
  ensureDir();
  const data = fs.readFileSync(LOG_PATH, 'utf-8');
  const lastLine = data.trim().split('\n').pop() || '';
  try {
    const parsed = JSON.parse(lastLine);
    return parsed.hash || '';
  } catch {
    return '';
  }
}

export async function auditLog(entry: Record<string, any>) {
  ensureDir();
  const prev = lastHash();
  const payload = { ts: new Date().toISOString(), prev, ...entry };
  const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  const line = JSON.stringify({ ...payload, hash });
  fs.appendFileSync(LOG_PATH, line + '\n', 'utf-8');
}

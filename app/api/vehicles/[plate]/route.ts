@@ .. @@
 import { NextRequest } from 'next/server';
 import { db } from '@/lib/database';
 import { auditLog } from '@/lib/audit';
+import { rateLimit } from '@/lib/rateLimit';

-export const runtime = 'edge';
-
 export async function GET(
   request: NextRequest,
   { params }: { params: { plate: string } }
 )
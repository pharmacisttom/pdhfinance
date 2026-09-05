import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';
import { clearSessionCookie } from '@/lib/auth';
import { store } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  await clearSessionCookie();

  store.logAudit({
    username: 'user',
    action: 'LOGOUT',
    module: 'AUTH',
    entity: 'User',
    beforeData: null,
    afterData: { status: 'SUCCESS' },
    ipAddress: req.ip || '127.0.0.1',
  });

  return apiSuccess({ message: 'ออกจากระบบสำเร็จ' });
}

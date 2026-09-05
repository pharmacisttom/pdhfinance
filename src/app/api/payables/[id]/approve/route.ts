import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payableId = params.id;
    const body = await req.json();
    const { action, comment } = body; // APPROVE or REJECT

    const payable = store.payables.find(p => p.id === payableId);
    if (!payable) {
      return apiError('ไม่พบข้อมูลเจ้าหนี้', 'NOT_FOUND', 404);
    }

    const before = { ...payable };
    if (action === 'APPROVE') {
      payable.status = 'READY_TO_PAY';
      payable.approvedById = 'usr-cfo';
      payable.approvedAt = new Date().toISOString();
    } else {
      payable.status = 'PENDING_DOCUMENT';
    }

    store.logAudit({
      username: 'cfo',
      action: action === 'APPROVE' ? 'APPROVE' : 'REJECT',
      module: 'PAYABLE',
      entity: 'Payable',
      entityId: payable.id,
      beforeData: before,
      afterData: { ...payable, comment },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ payable });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

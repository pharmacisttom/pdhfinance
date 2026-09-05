import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loanId = params.id;
    const body = await req.json();
    const { action } = body; // APPROVE, DISBURSE

    const loan = store.loans.find(l => l.id === loanId);
    if (!loan) {
      return apiError('ไม่พบสัญญายืมเงินราชการ', 'NOT_FOUND', 404);
    }

    const before = { ...loan };

    if (action === 'APPROVE') {
      loan.status = 'APPROVED';
      loan.approveDate = new Date().toISOString().split('T')[0];
    } else if (action === 'DISBURSE') {
      loan.status = 'OUTSTANDING';
      loan.paymentDate = new Date().toISOString().split('T')[0];
    }

    store.logAudit({
      username: 'cfo',
      action: action === 'APPROVE' ? 'APPROVE' : 'UPDATE',
      module: 'LOAN',
      entity: 'GovernmentLoan',
      entityId: loan.id,
      beforeData: before,
      afterData: loan,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ loan });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

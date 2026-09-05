import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function GET() {
  const now = new Date();
  
  // Calculate commitments due in 7, 15, 30, 60 days
  const activeCommitments = store.commitments.filter(c => c.status === 'ACTIVE');
  
  const getDueSum = (days: number) => {
    const target = new Date();
    target.setDate(now.getDate() + days);
    return activeCommitments
      .filter(c => {
        const d = new Date(c.expectedPaymentDate);
        return d >= now && d <= target;
      })
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const due7 = getDueSum(7);
  const due15 = getDueSum(15);
  const due30 = getDueSum(30);
  const due60 = getDueSum(60);

  return apiSuccess({
    commitments: store.commitments,
    breakdown: {
      due7,
      due15,
      due30,
      due60,
      total: activeCommitments.reduce((sum, c) => sum + c.amount, 0),
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sourceDocument, departmentName, vendorName, description, amount, expectedPaymentDate } = body;

    if (!sourceDocument || !amount || !expectedPaymentDate) {
      return apiError('กรุณากรอกข้อมูลภาระผูกพันให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const commitmentNo = await generateDocumentNumber('CM');
    const numAmount = parseFloat(amount);

    const newCm = {
      id: `cm-${Date.now()}`,
      commitmentNo,
      sourceDocument,
      departmentName: departmentName || 'กลุ่มงานบริหารทั่วไป',
      vendorName: vendorName || 'บริษัทคู่ค้าตามสัญญา',
      description: description || '',
      amount: numAmount,
      expectedPaymentDate,
      status: 'ACTIVE' as const,
      createdAt: new Date().toISOString(),
    };

    store.commitments.unshift(newCm);

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'COMMITMENT',
      entity: 'Commitment',
      entityId: newCm.id,
      beforeData: null,
      afterData: newCm,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ commitment: newCm }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

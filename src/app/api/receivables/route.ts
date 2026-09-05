import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';
import { calculateAging } from '@/lib/fiscal-year';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');
  const category = url.searchParams.get('category');

  let list = store.receivables.map(r => {
    const aging = calculateAging(r.dueDate);
    let dynamicStatus = r.status;
    if (dynamicStatus !== 'PAID' && dynamicStatus !== 'WRITEOFF' && aging.daysOverdue > 0) {
      dynamicStatus = 'OVERDUE';
    }
    return {
      ...r,
      status: dynamicStatus,
      aging,
    };
  });

  if (status && status !== 'ALL') {
    list = list.filter(r => r.status === status);
  }
  if (category && category !== 'ALL') {
    list = list.filter(r => r.category === category);
  }

  return apiSuccess({ receivables: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { debtorName, documentNo, category, billDate, dueDate, amount, description } = body;

    if (!debtorName || !billDate || !dueDate || !amount) {
      return apiError('กรุณากรอกข้อมูลลูกหนี้ให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const receivableNo = await generateDocumentNumber('AR');
    const numAmount = parseFloat(amount);

    const newRec = {
      id: `rec-${Date.now()}`,
      receivableNo,
      documentNo: documentNo || null,
      debtorId: `deb-${Date.now()}`,
      debtorName,
      departmentId: 'dept-5',
      category: category || 'UC',
      billDate,
      dueDate,
      amount: numAmount,
      paidAmount: 0,
      balance: numAmount,
      status: 'OPEN' as const,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    store.receivables.unshift(newRec);

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'RECEIVABLE',
      entity: 'Receivable',
      entityId: newRec.id,
      beforeData: null,
      afterData: newRec,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ receivable: newRec }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

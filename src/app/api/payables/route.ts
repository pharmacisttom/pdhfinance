import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';
import { calculateAging } from '@/lib/fiscal-year';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let list = store.payables.map(p => {
    const aging = calculateAging(p.dueDate);
    let dynamicStatus = p.status;
    if (dynamicStatus !== 'PAID' && dynamicStatus !== 'APPROVED' && aging.daysOverdue > 0) {
      dynamicStatus = 'OVERDUE';
    }
    return {
      ...p,
      status: dynamicStatus,
      aging,
    };
  });

  if (status && status !== 'ALL') {
    list = list.filter(p => p.status === status);
  }

  return apiSuccess({ payables: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vendorName, documentNo, invoiceNo, invoiceDate, dueDate, amount, description, budgetId } = body;

    if (!vendorName || !invoiceNo || !invoiceDate || !dueDate || !amount) {
      return apiError('กรุณากรอกข้อมูลเจ้าหนี้ให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const payableNo = await generateDocumentNumber('AP');
    const numAmount = parseFloat(amount);

    const newPayable = {
      id: `pay-${Date.now()}`,
      payableNo,
      documentNo: documentNo || null,
      vendorId: `ven-${Date.now()}`,
      vendorName,
      departmentId: 'dept-4',
      fundId: 'fund-1',
      budgetId: budgetId || 'bdg-3',
      invoiceNo,
      invoiceDate,
      dueDate,
      amount: numAmount,
      paidAmount: 0,
      balance: numAmount,
      status: 'WAITING_APPROVAL' as const,
      description: description || '',
      createdAt: new Date().toISOString(),
    };

    store.payables.unshift(newPayable);

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'PAYABLE',
      entity: 'Payable',
      entityId: newPayable.id,
      beforeData: null,
      afterData: newPayable,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ payable: newPayable }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

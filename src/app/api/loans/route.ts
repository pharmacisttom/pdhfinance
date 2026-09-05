import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';
import { calculateAging } from '@/lib/fiscal-year';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const status = url.searchParams.get('status');

  let list = store.loans.map(l => {
    const aging = calculateAging(l.dueDate);
    let dynamicStatus = l.status;
    return {
      ...l,
      aging,
    };
  });

  if (status && status !== 'ALL') {
    list = list.filter(l => l.status === status);
  }

  return apiSuccess({ loans: list, clearances: store.loanClearances });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { borrowerCode, borrowerName, departmentName, purpose, requestDate, dueDate, amount } = body;

    if (!borrowerName || !purpose || !dueDate || !amount) {
      return apiError('กรุณากรอกข้อมูลสัญญายืมเงินราชการให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const loanNo = await generateDocumentNumber('LN');
    const numAmount = parseFloat(amount);

    const newLoan = {
      id: `loan-${Date.now()}`,
      loanNo,
      borrowerCode: borrowerCode || `EMP-${Date.now().toString().slice(-4)}`,
      borrowerName,
      departmentId: 'dept-2',
      departmentName: departmentName || 'กลุ่มงานศัลยกรรม',
      purpose,
      requestDate: requestDate || new Date().toISOString().split('T')[0],
      dueDate,
      amount: numAmount,
      returnedAmount: 0,
      balance: numAmount,
      status: 'SUBMITTED' as const,
      createdAt: new Date().toISOString(),
    };

    store.loans.unshift(newLoan);

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'LOAN',
      entity: 'GovernmentLoan',
      entityId: newLoan.id,
      beforeData: null,
      afterData: newLoan,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ loan: newLoan }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function GET() {
  const today = new Date().toISOString().split('T')[0];
  
  // Calculate today's income & expense
  const totalIncome = store.bankTransactions
    .filter(t => t.transactionType === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = store.bankTransactions
    .filter(t => t.transactionType === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentTotal = store.bankAccounts.reduce((sum, a) => sum + a.currentBalance, 0);
  const openingTotal = store.bankAccounts.reduce((sum, a) => sum + a.openingBalance, 0);

  const dailyClosing = {
    closingDate: today,
    openingBalance: openingTotal,
    totalIncome,
    totalExpense,
    closingBalance: currentTotal,
    status: 'OPEN',
  };

  const monthlyPeriods = [
    { period: 'ส.ค. 2569 (งวดที่ 11)', isClosed: true, closedAt: '2026-08-31 18:00', closedBy: 'cfo' },
    { period: 'ก.ย. 2569 (งวดที่ 12)', isClosed: false, closedAt: null, closedBy: null },
  ];

  return apiSuccess({
    dailyClosing,
    monthlyPeriods,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, period, reason } = body;

    store.logAudit({
      username: 'cfo',
      action: type === 'DAILY_CLOSE' ? 'CLOSE_PERIOD' : 'OPEN_PERIOD',
      module: 'CASH_BANK',
      entity: 'FiscalPeriod',
      beforeData: null,
      afterData: { type, period, reason },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ message: 'บันทึกการปิดงวดสำเร็จเรียบร้อยแล้ว' });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

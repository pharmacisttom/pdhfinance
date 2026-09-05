import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const source = url.searchParams.get('source');

  let list = store.revenueTransactions;
  if (source && source !== 'ALL') {
    list = list.filter(r => r.source === source);
  }

  const totalRevenue = list.reduce((sum, r) => sum + r.amount, 0);

  return apiSuccess({
    transactions: list,
    totalRevenue,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { revenueDate, source, amount, description, bankAccountId } = body;

    if (!source || !amount || !description) {
      return apiError('กรุณากรอกข้อมูลรายได้ให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const docNo = await generateDocumentNumber('RV');
    const numAmount = parseFloat(amount);

    const bankAccount = store.bankAccounts.find(a => a.id === bankAccountId) || store.bankAccounts[0];

    const newRev = {
      id: `rev-${Date.now()}`,
      revenueDate: revenueDate || new Date().toISOString().split('T')[0],
      fundId: 'fund-1',
      fundName: source === 'UC' ? 'เงินบำรุงโรงพยาบาล (UC)' : source === 'SSS' ? 'กองทุนประกันสังคม' : source === 'CSMBS' ? 'กองทุนสวัสดิการข้าราชการ' : 'เงินบริจาคพัฒนาโรงพยาบาล',
      source,
      departmentId: 'dept-5',
      documentNo: docNo,
      amount: numAmount,
      description,
      bankAccountId: bankAccount.id,
      createdAt: new Date().toISOString(),
    };

    store.revenueTransactions.unshift(newRev);

    // Update bank balance & record bank income transaction
    bankAccount.currentBalance += numAmount;
    store.bankTransactions.unshift({
      id: `btx-${Date.now()}`,
      bankAccountId: bankAccount.id,
      transactionDate: newRev.revenueDate,
      transactionType: 'INCOME',
      documentNo: docNo,
      referenceNo: `REF-REV-${docNo}`,
      description: `รับเงินรายได้: ${description}`,
      amount: numAmount,
      balanceAfter: bankAccount.currentBalance,
      source: 'REVENUE',
      departmentId: 'dept-5',
      createdAt: new Date().toISOString(),
    });

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'REVENUE',
      entity: 'RevenueTransaction',
      entityId: newRev.id,
      beforeData: null,
      afterData: newRev,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ transaction: newRev }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

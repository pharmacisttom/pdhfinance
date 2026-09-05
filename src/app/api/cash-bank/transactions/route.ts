import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accountId = url.searchParams.get('accountId');

  let list = store.bankTransactions;
  if (accountId) {
    list = list.filter(t => t.bankAccountId === accountId);
  }

  return apiSuccess({ transactions: list });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankAccountId, transactionType, description, amount, referenceNo, departmentId } = body;

    if (!bankAccountId || !transactionType || !amount || !description) {
      return apiError('กรุณากรอกข้อมูลรายการธนาคารให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const account = store.bankAccounts.find(a => a.id === bankAccountId);
    if (!account) {
      return apiError('ไม่พบบัญชีธนาคารที่ระบุ', 'NOT_FOUND', 404);
    }

    const numAmount = parseFloat(amount);
    if (transactionType === 'EXPENSE' && account.currentBalance < numAmount) {
      return apiError('ยอดเงินคงเหลือในบัญชีไม่เพียงพอสำหรับการทำรายการจ่าย', 'INSUFFICIENT_FUNDS', 400);
    }

    // Calculate balance after
    const newBalance = transactionType === 'INCOME' 
      ? account.currentBalance + numAmount 
      : account.currentBalance - numAmount;

    account.currentBalance = newBalance;

    const docNo = await generateDocumentNumber(transactionType === 'INCOME' ? 'RV' : 'PV');

    const newTx = {
      id: `btx-${Date.now()}`,
      bankAccountId,
      transactionDate: new Date().toISOString(),
      transactionType,
      documentNo: docNo,
      referenceNo: referenceNo || `REF-${Date.now().toString().slice(-6)}`,
      description,
      amount: numAmount,
      balanceAfter: newBalance,
      source: 'DIRECT',
      departmentId,
      createdAt: new Date().toISOString(),
    };

    store.bankTransactions.unshift(newTx);

    store.logAudit({
      username: 'finance',
      action: 'CREATE',
      module: 'CASH_BANK',
      entity: 'BankTransaction',
      entityId: newTx.id,
      beforeData: null,
      afterData: newTx,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ transaction: newTx }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

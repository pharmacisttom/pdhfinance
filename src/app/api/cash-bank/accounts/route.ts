import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function GET() {
  return apiSuccess({ accounts: store.bankAccounts });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bankCode, bankName, branch, accountName, accountNumber, accountType, openingBalance } = body;

    if (!bankCode || !accountName || !accountNumber) {
      return apiError('กรุณากรอกข้อมูลบัญชีธนาคารให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const newAccount = {
      id: `bank-${Date.now()}`,
      bankCode,
      bankName: bankName || bankCode,
      branch: branch || 'สาขาหลัก',
      accountName,
      accountNumber,
      accountType: accountType || 'SAVINGS',
      openingBalance: parseFloat(openingBalance || 0),
      currentBalance: parseFloat(openingBalance || 0),
      isActive: true,
    };

    store.bankAccounts.push(newAccount);

    store.logAudit({
      username: 'cfo',
      action: 'CREATE',
      module: 'CASH_BANK',
      entity: 'BankAccount',
      entityId: newAccount.id,
      beforeData: null,
      afterData: newAccount,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ account: newAccount }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

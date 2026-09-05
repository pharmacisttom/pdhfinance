import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function GET() {
  // Summary for reconciliation
  const currentAccount = store.bankAccounts[0];
  const systemBalance = currentAccount ? currentAccount.currentBalance : 0;
  
  // Calculate statement balance
  const matchedStatements = store.bankStatements.filter(s => s.status === 'MATCHED');
  const unmatchedStatements = store.bankStatements.filter(s => s.status === 'UNMATCHED');
  
  const latestStatement = store.bankStatements[store.bankStatements.length - 1];
  const statementBalance = latestStatement ? latestStatement.balance : systemBalance;
  const difference = systemBalance - statementBalance;

  return apiSuccess({
    account: currentAccount,
    systemBalance,
    statementBalance,
    difference,
    statements: store.bankStatements,
    unmatchedCount: unmatchedStatements.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { statementId, action, matchedTxId } = body;

    const stmt = store.bankStatements.find(s => s.id === statementId);
    if (!stmt) {
      return apiError('ไม่พบรายการ Statement', 'NOT_FOUND', 404);
    }

    if (action === 'MATCH') {
      stmt.status = 'MATCHED';
      stmt.matchedTxId = matchedTxId || 'manual-match';
    } else if (action === 'UNMATCH') {
      stmt.status = 'UNMATCHED';
      stmt.matchedTxId = undefined;
    }

    store.logAudit({
      username: 'accounting',
      action: 'UPDATE',
      module: 'CASH_BANK',
      entity: 'BankStatement',
      entityId: stmt.id,
      beforeData: null,
      afterData: { status: stmt.status },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ statement: stmt });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

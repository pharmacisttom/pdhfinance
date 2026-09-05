import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const payableId = params.id;
    const body = await req.json();
    const { amount, paymentDate, bankAccountId, referenceNo, notes } = body;

    const payable = store.payables.find(p => p.id === payableId);
    if (!payable) {
      return apiError('ไม่พบข้อมูลเจ้าหนี้', 'NOT_FOUND', 404);
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return apiError('จำนวนเงินจ่ายชำระไม่ถูกต้อง', 'INVALID_AMOUNT', 400);
    }

    if (payAmount > payable.balance) {
      return apiError('ยอดจ่ายชำระเกินยอดคงค้างของเจ้าหนี้', 'AMOUNT_EXCEEDED', 400);
    }

    const bankAccount = store.bankAccounts.find(a => a.id === bankAccountId);
    if (!bankAccount) {
      return apiError('ไม่พบบัญชีธนาคารสำหรับตัดจ่ายเงิน', 'BANK_NOT_FOUND', 404);
    }

    if (bankAccount.currentBalance < payAmount) {
      return apiError('ยอดเงินคงเหลือในบัญชีธนาคารไม่เพียงพอ', 'INSUFFICIENT_FUNDS', 400);
    }

    // 1. Generate Payment Voucher No
    const paymentVoucherNo = await generateDocumentNumber('PV');

    // 2. Update Payable balance & status
    const beforePayable = { ...payable };
    payable.paidAmount += payAmount;
    payable.balance -= payAmount;
    payable.status = payable.balance === 0 ? 'PAID' : 'READY_TO_PAY';

    // 3. Deduct Bank Account Balance & Record Bank Expense Tx
    bankAccount.currentBalance -= payAmount;
    const bankTx = {
      id: `btx-${Date.now()}`,
      bankAccountId,
      transactionDate: paymentDate || new Date().toISOString().split('T')[0],
      transactionType: 'EXPENSE' as const,
      documentNo: paymentVoucherNo,
      referenceNo: referenceNo || `REF-PAY-${payable.payableNo}`,
      description: `จ่ายชำระหนี้ให้ ${payable.vendorName} (เอกสาร ${payable.payableNo})`,
      amount: payAmount,
      balanceAfter: bankAccount.currentBalance,
      source: 'PAYABLE',
      departmentId: payable.departmentId,
      createdAt: new Date().toISOString(),
    };
    store.bankTransactions.unshift(bankTx);

    // 4. Update Budget spent
    if (payable.budgetId) {
      const budget = store.budgets.find(b => b.id === payable.budgetId);
      if (budget) {
        budget.spent += payAmount;
        budget.available = budget.allocated + budget.adjustment - budget.committed - budget.spent;
      }
    }

    // 5. Atomic Audit Log
    store.logAudit({
      username: 'finance',
      action: 'PAYMENT',
      module: 'PAYABLE',
      entity: 'PayablePayment',
      entityId: paymentVoucherNo,
      beforeData: beforePayable,
      afterData: {
        paymentVoucherNo,
        payable,
        bankTx,
      },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({
      paymentVoucherNo,
      payable,
    });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

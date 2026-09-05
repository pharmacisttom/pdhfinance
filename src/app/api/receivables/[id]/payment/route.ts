import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receivableId = params.id;
    const body = await req.json();
    const { amount, paymentDate, bankAccountId, referenceNo, paymentMethod, notes } = body;

    const receivable = store.receivables.find(r => r.id === receivableId);
    if (!receivable) {
      return apiError('ไม่พบข้อมูลลูกหนี้ที่ระบุ', 'NOT_FOUND', 404);
    }

    const payAmount = parseFloat(amount);
    if (isNaN(payAmount) || payAmount <= 0) {
      return apiError('จำนวนเงินรับชำระไม่ถูกต้อง', 'INVALID_AMOUNT', 400);
    }

    if (payAmount > receivable.balance) {
      return apiError('ยอดรับชำระเกินยอดคงค้างของลูกหนี้', 'AMOUNT_EXCEEDED', 400);
    }

    const bankAccount = store.bankAccounts.find(a => a.id === bankAccountId);
    if (!bankAccount) {
      return apiError('ไม่พบบัญชีธนาคารสำหรับรับเงิน', 'BANK_NOT_FOUND', 404);
    }

    // 1. Generate Receipt Number
    const receiptNo = await generateDocumentNumber('RC');

    // 2. Update Receivable balance & status
    const beforeReceivable = { ...receivable };
    receivable.paidAmount += payAmount;
    receivable.balance -= payAmount;
    receivable.status = receivable.balance === 0 ? 'PAID' : 'PARTIAL';

    // 3. Record Receivable Payment
    const payment = {
      id: `rcp-${Date.now()}`,
      receiptNo,
      receivableId,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      amount: payAmount,
      bankAccountId,
      referenceNo: referenceNo || null,
      paymentMethod: paymentMethod || 'TRANSFER',
      notes: notes || '',
      createdAt: new Date().toISOString(),
    };
    store.receivablePayments.unshift(payment);

    // 4. Update Bank Account Balance & Record Bank Transaction
    bankAccount.currentBalance += payAmount;
    const bankTx = {
      id: `btx-${Date.now()}`,
      bankAccountId,
      transactionDate: payment.paymentDate,
      transactionType: 'INCOME' as const,
      documentNo: receiptNo,
      referenceNo: referenceNo || `REF-REC-${receivable.receivableNo}`,
      description: `รับชำระหนี้จาก ${receivable.debtorName} (เอกสาร ${receivable.receivableNo})`,
      amount: payAmount,
      balanceAfter: bankAccount.currentBalance,
      source: 'RECEIVABLE',
      departmentId: receivable.departmentId,
      createdAt: new Date().toISOString(),
    };
    store.bankTransactions.unshift(bankTx);

    // 5. Atomic Audit Trail Log
    store.logAudit({
      username: 'finance',
      action: 'PAYMENT',
      module: 'RECEIVABLE',
      entity: 'ReceivablePayment',
      entityId: payment.id,
      beforeData: beforeReceivable,
      afterData: {
        payment,
        updatedReceivable: receivable,
        bankTx,
      },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({
      receiptNo,
      payment,
      updatedReceivable: receivable,
    });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

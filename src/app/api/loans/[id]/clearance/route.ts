import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';
import { generateDocumentNumber } from '@/lib/number-generator';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const loanId = params.id;
    const body = await req.json();
    const { expenseAmount, cashReturn, additionalPayment, documentReference, notes } = body;

    const loan = store.loans.find(l => l.id === loanId);
    if (!loan) {
      return apiError('ไม่พบสัญญายืมเงินราชการ', 'NOT_FOUND', 404);
    }

    const expAmt = parseFloat(expenseAmount || 0);
    const cashAmt = parseFloat(cashReturn || 0);
    const addAmt = parseFloat(additionalPayment || 0);

    const totalCleared = expAmt + cashAmt;

    if (totalCleared <= 0) {
      return apiError('กรุณาระบุจำนวนเงินเอกสารใบเสร็จหรือเงินสดที่ส่งคืน', 'INVALID_AMOUNT', 400);
    }

    const clearanceNo = await generateDocumentNumber('CL');

    // Update loan balance & status
    const beforeLoan = { ...loan };
    loan.returnedAmount += totalCleared;
    loan.balance = Math.max(0, loan.amount - loan.returnedAmount);
    loan.status = loan.balance === 0 ? 'CLEARED' : 'RETURNED';

    const clearance = {
      id: `clr-${Date.now()}`,
      clearanceNo,
      loanId: loan.id,
      loanNo: loan.loanNo,
      clearanceDate: new Date().toISOString().split('T')[0],
      expenseAmount: expAmt,
      cashReturn: cashAmt,
      additionalPayment: addAmt,
      documentReference: documentReference || 'ใบเสร็จค่าใช้จ่ายและเอกสารหลักฐาน',
      notes: notes || '',
      status: 'APPROVED' as const,
      createdAt: new Date().toISOString(),
    };

    store.loanClearances.unshift(clearance);

    // If cash is returned, update Bank Account
    if (cashAmt > 0 && store.bankAccounts.length > 0) {
      const bank = store.bankAccounts[0];
      bank.currentBalance += cashAmt;
      store.bankTransactions.unshift({
        id: `btx-${Date.now()}`,
        bankAccountId: bank.id,
        transactionDate: clearance.clearanceDate,
        transactionType: 'INCOME',
        documentNo: clearanceNo,
        referenceNo: `REF-CLR-${loan.loanNo}`,
        description: `รับคืนเงินสดจากการล้างเงินยืมราชการ สัญญา ${loan.loanNo} (${loan.borrowerName})`,
        amount: cashAmt,
        balanceAfter: bank.currentBalance,
        source: 'LOAN',
        departmentId: loan.departmentId,
        createdAt: new Date().toISOString(),
      });
    }

    store.logAudit({
      username: 'finance',
      action: 'CLEAR',
      module: 'LOAN',
      entity: 'LoanClearance',
      entityId: clearance.id,
      beforeData: beforeLoan,
      afterData: {
        clearance,
        updatedLoan: loan,
      },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ clearance, loan });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

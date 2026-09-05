import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { budgetId, adjustmentType, amount, reason } = body;

    const budget = store.budgets.find(b => b.id === budgetId);
    if (!budget) {
      return apiError('ไม่พบรายการงบประมาณที่ระบุ', 'NOT_FOUND', 404);
    }

    const adjAmount = parseFloat(amount);
    if (isNaN(adjAmount) || adjAmount <= 0) {
      return apiError('จำนวนเงินโอนเปลี่ยนแปลงงบไม่ถูกต้อง', 'INVALID_AMOUNT', 400);
    }

    const beforeBudget = { ...budget };

    if (adjustmentType === 'INCREASE' || adjustmentType === 'TRANSFER_IN') {
      budget.adjustment += adjAmount;
    } else if (adjustmentType === 'DECREASE' || adjustmentType === 'TRANSFER_OUT') {
      if (budget.available < adjAmount) {
        return apiError('วงเงินคงเหลือไม่เพียงพอสำหรับการโอนลดงบประมาณ', 'INSUFFICIENT_BUDGET', 400);
      }
      budget.adjustment -= adjAmount;
    }

    // Recompute available
    budget.available = budget.allocated + budget.adjustment - budget.committed - budget.spent;

    store.logAudit({
      username: 'budget',
      action: 'UPDATE',
      module: 'BUDGET',
      entity: 'BudgetAdjustment',
      entityId: budget.id,
      beforeData: beforeBudget,
      afterData: {
        budget,
        adjustmentType,
        amount: adjAmount,
        reason,
      },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ budget });
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

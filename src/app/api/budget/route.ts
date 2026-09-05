import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const departmentId = url.searchParams.get('departmentId');

  let list = store.budgets;
  if (departmentId && departmentId !== 'ALL') {
    list = list.filter(b => b.departmentId === departmentId);
  }

  // Calculate totals
  const totalAllocated = list.reduce((sum, b) => sum + b.allocated, 0);
  const totalAdjustment = list.reduce((sum, b) => sum + b.adjustment, 0);
  const totalCommitted = list.reduce((sum, b) => sum + b.committed, 0);
  const totalSpent = list.reduce((sum, b) => sum + b.spent, 0);
  const totalAvailable = list.reduce((sum, b) => sum + b.available, 0);

  return apiSuccess({
    budgets: list,
    summary: {
      totalAllocated,
      totalAdjustment,
      totalCommitted,
      totalSpent,
      totalAvailable,
      utilizationRate: totalAllocated > 0 ? (((totalSpent + totalCommitted) / (totalAllocated + totalAdjustment)) * 100).toFixed(1) : 0,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fundName, departmentName, budgetCode, budgetName, allocated } = body;

    if (!budgetName || !allocated) {
      return apiError('กรุณากรอกข้อมูลกรอบงบประมาณให้ครบถ้วน', 'VALIDATION_ERROR', 400);
    }

    const numAllocated = parseFloat(allocated);

    const newBudget = {
      id: `bdg-${Date.now()}`,
      fiscalYear: 2569,
      fundId: 'fund-1',
      fundName: fundName || 'เงินบำรุงโรงพยาบาล (UC)',
      departmentId: 'dept-5',
      departmentName: departmentName || 'กลุ่มงานการเงินและบัญชี',
      budgetCodeId: 'bc-gen',
      budgetCode: budgetCode || '510201',
      budgetName,
      allocated: numAllocated,
      adjustment: 0,
      committed: 0,
      spent: 0,
      available: numAllocated,
    };

    store.budgets.push(newBudget);

    store.logAudit({
      username: 'budget',
      action: 'CREATE',
      module: 'BUDGET',
      entity: 'Budget',
      entityId: newBudget.id,
      beforeData: null,
      afterData: newBudget,
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({ budget: newBudget }, undefined, 201);
  } catch (err: any) {
    return apiError(err.message, 'SERVER_ERROR', 500);
  }
}

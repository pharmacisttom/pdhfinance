import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';
import { store } from '@/lib/data-store';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const fiscalYear = parseInt(url.searchParams.get('fiscalYear') || '2569', 10);

  const kpis = store.getDashboardKpis(fiscalYear);
  const alerts = store.getFinancialAlerts();

  // Chart data
  const cashFlowTrend = [
    { month: 'ต.ค.', inflow: 14200000, outflow: 11500000, net: 2700000 },
    { month: 'พ.ย.', inflow: 16800000, outflow: 13200000, net: 3600000 },
    { month: 'ธ.ค.', inflow: 15400000, outflow: 14900000, net: 500000 },
    { month: 'ม.ค.', inflow: 18200000, outflow: 15100000, net: 3100000 },
    { month: 'ก.พ.', inflow: 17500000, outflow: 14800000, net: 2700000 },
    { month: 'มี.ค.', inflow: 19100000, outflow: 16500000, net: 2600000 },
    { month: 'เม.ย.', inflow: 16900000, outflow: 15200000, net: 1700000 },
    { month: 'พ.ค.', inflow: 18400000, outflow: 16100000, net: 2300000 },
    { month: 'มิ.ย.', inflow: 19800000, outflow: 17300000, net: 2500000 },
    { month: 'ก.ค.', inflow: 20500000, outflow: 18100000, net: 2400000 },
    { month: 'ส.ค.', inflow: 22100000, outflow: 19400000, net: 2700000 },
    { month: 'ก.ย.', inflow: 21500000, outflow: 18800000, net: 2700000 },
  ];

  const receivableAging = [
    { name: 'ยังไม่ถึงกำหนด (Current)', amount: 4200000, count: 1, color: '#10B981' },
    { name: '1 - 30 วัน', amount: 6500000, count: 1, color: '#F59E0B' },
    { name: '31 - 60 วัน', amount: 3800000, count: 1, color: '#F97316' },
    { name: '61 - 90 วัน', amount: 0, count: 0, color: '#EF4444' },
    { name: 'เกิน 90 วัน (>90)', amount: 750000, count: 1, color: '#B91C1C' },
  ];

  const payableAging = [
    { name: 'ยังไม่ถึงกำหนด (Current)', amount: 540000, count: 1, color: '#10B981' },
    { name: 'ครบกำหนดใน 7 วัน', amount: 2450000, count: 1, color: '#1687E8' },
    { name: '1 - 30 วัน', amount: 1850000, count: 1, color: '#F59E0B' },
    { name: 'เกิน 30 วัน (>30)', amount: 980000, count: 1, color: '#FF4664' },
  ];

  const revenueByFund = [
    { name: 'เงินบำรุง รพ. (UC)', value: 4500000, percentage: 39.3, color: '#08294F' },
    { name: 'ประกันสังคม (SSS)', value: 3200000, percentage: 27.9, color: '#1687E8' },
    { name: 'สวัสดิการข้าราชการ (CSMBS)', value: 2900000, percentage: 25.3, color: '#08A7A4' },
    { name: 'เงินบริจาคพัฒนา รพ.', value: 850000, percentage: 7.5, color: '#10B981' },
  ];

  const budgetSummaryByDept = [
    { dept: 'กลุ่มงานเภสัชกรรม', allocated: 85000000, spent: 68400000, committed: 5650000, available: 10950000 },
    { dept: 'กลุ่มงานการเงินและบัญชี', allocated: 37000000, spent: 29500000, committed: 0, available: 7500000 },
    { dept: 'กลุ่มงานบริหารทั่วไป', allocated: 24000000, spent: 19800000, committed: 1200000, available: 3000000 },
    { dept: 'กลุ่มงานผู้ป่วยวิกฤต (ICU)', allocated: 18000000, spent: 11200000, committed: 4800000, available: 2000000 },
    { dept: 'กลุ่มงานศัลยกรรม', allocated: 10000000, spent: 5400000, committed: 980000, available: 3620000 },
  ];

  return apiSuccess({
    kpis,
    alerts,
    charts: {
      cashFlowTrend,
      receivableAging,
      payableAging,
      revenueByFund,
      budgetSummaryByDept,
    },
  });
}

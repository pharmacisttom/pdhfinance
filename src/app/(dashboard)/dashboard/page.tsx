'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wallet,
  Receipt,
  CreditCard,
  FileCheck2,
  PieChart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Layers,
  Building,
  CheckCircle2,
  ExternalLink,
  PlusCircle,
  RefreshCw,
  Landmark,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts';
import { formatThaiCurrency } from '@/lib/fiscal-year';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/dashboard?fiscalYear=2569');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Error loading dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-white rounded-2xl border border-gray-200"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-32 bg-white rounded-2xl border border-gray-200"></div>
          ))}
        </div>
      </div>
    );
  }

  const { kpis, alerts, charts } = data;

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner / Quick Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#08294F] via-[#0D3768] to-[#1687E8] p-6 rounded-2xl text-white shadow-lg shadow-[#08294F]/15">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs text-blue-200 font-medium mb-2 backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-[#08A7A4] animate-pulse"></span>
            <span>สถานะระบบการเงิน Real-time • ปีงบประมาณ 2569</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            ภาพรวมการบริหารการเงิน โรงพยาบาลศูนย์
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-0.5">
            สรุปยอดสภาพคล่อง หนี้สิน ภาระผูกพัน และการควบคุมวงเงินงบประมาณ
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/receivables"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition-all"
          >
            <Receipt className="w-3.5 h-3.5 text-cyan-300" />
            <span>ตั้งลูกหนี้ (AR)</span>
          </Link>
          <Link
            href="/payables"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition-all"
          >
            <CreditCard className="w-3.5 h-3.5 text-pink-300" />
            <span>จ่ายหนี้ (AP)</span>
          </Link>
          <Link
            href="/loans"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center space-x-1.5 transition-all"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-amber-300" />
            <span>ยืมเงินราชการ</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            title="รีเฟรชข้อมูล"
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Financial Alert Panel */}
      {alerts && alerts.length > 0 && (
        <div className="card-soft p-5 bg-gradient-to-br from-white to-red-50/20 border-l-4 border-l-[#FF4664]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-[#08294F] font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-[#FF4664]" />
              <span>การแจ้งเตือนทางการเงินเร่งด่วน (Financial Action Alerts)</span>
            </div>
            <Link
              href="/notifications"
              className="text-xs font-semibold text-[#1687E8] hover:underline flex items-center space-x-1"
            >
              <span>ดูทั้งหมด ({alerts.length})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {alerts.slice(0, 3).map((alert: any) => (
              <Link
                key={alert.id}
                href={alert.link}
                className="p-3.5 rounded-xl bg-white border border-gray-200/80 hover:border-[#1687E8] hover:shadow-md transition-all flex items-start space-x-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    alert.type === 'DANGER'
                      ? 'bg-[#FFF0F2] text-[#FF4664]'
                      : alert.type === 'WARNING'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-[#1687E8]'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#08294F] group-hover:text-[#1687E8] truncate">
                    {alert.title}
                  </div>
                  <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 12 Executive KPI Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#08294F] flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#1687E8]" />
            <span>ตัวชี้วัดทางการเงินหลัก 12 รายการ (Financial KPIs)</span>
          </h3>
          <span className="text-xs text-gray-500 font-medium">หน่วย: บาท (THB)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. เงินสดและเงินฝากธนาคาร */}
          <Link
            href="/cash-bank/accounts"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>1. เงินสดและเงินฝากธนาคาร</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1687E8] flex items-center justify-center group-hover:bg-[#1687E8] group-hover:text-white transition-colors">
                <Wallet className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.cashAndBank)}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1.5 flex items-center space-x-1">
              <span>สถานะ: คล่องตัวสูง (3 บัญชีหลัก)</span>
            </div>
          </Link>

          {/* 2. ลูกหนี้คงค้าง */}
          <Link
            href="/receivables"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>2. ลูกหนี้คงค้างทั้งหมด</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#08A7A4] flex items-center justify-center group-hover:bg-[#08A7A4] group-hover:text-white transition-colors">
                <Receipt className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.totalReceivables)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">
              รวม สปสช., ประกันสังคม, ข้าราชการ
            </div>
          </Link>

          {/* 3. ลูกหนี้เกินกำหนด */}
          <Link
            href="/receivables?status=OVERDUE"
            className="card-soft p-5 group hover:border-[#FF4664] transition-all relative overflow-hidden border-t-2 border-t-[#FF4664]"
          >
            <div className="flex items-center justify-between text-xs text-[#FF4664] font-bold mb-2">
              <span>3. ลูกหนี้เกินกำหนดชำระ</span>
              <div className="w-7 h-7 rounded-lg bg-[#FFF0F2] text-[#FF4664] flex items-center justify-center group-hover:bg-[#FF4664] group-hover:text-white transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#FF4664] tracking-tight">
              {formatThaiCurrency(kpis.overdueReceivables)}
            </div>
            <div className="text-[11px] text-[#FF4664] font-medium mt-1.5">
              เกินกำหนด {kpis.overdueReceivableCount} ราย (ต้องเร่งทวงถาม)
            </div>
          </Link>

          {/* 4. เจ้าหนี้คงค้าง */}
          <Link
            href="/payables"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>4. เจ้าหนี้คงค้างทั้งหมด</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.totalPayables)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">
              ค่ายา เวชภัณฑ์ และบริการทางการแพทย์
            </div>
          </Link>

          {/* 5. เจ้าหนี้ครบกำหนดใน 7 วัน */}
          <Link
            href="/payables"
            className="card-soft p-5 group hover:border-amber-400 transition-all relative overflow-hidden border-t-2 border-t-amber-500"
          >
            <div className="flex items-center justify-between text-xs text-amber-700 font-bold mb-2">
              <span>5. เจ้าหนี้ครบกำหนดใน 7 วัน</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Clock className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-amber-700 tracking-tight">
              {formatThaiCurrency(kpis.payablesDueIn7Days)}
            </div>
            <div className="text-[11px] text-amber-600 font-medium mt-1.5">
              จำนวน {kpis.payablesDueIn7DaysCount} รายการ (เตรียมตั้งเบิก)
            </div>
          </Link>

          {/* 6. เงินยืมราชการคงค้าง */}
          <Link
            href="/loans"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>6. เงินยืมราชการคงค้าง</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#1687E8] flex items-center justify-center group-hover:bg-[#1687E8] group-hover:text-white transition-colors">
                <FileCheck2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.outstandingLoans)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">
              เงินทดรองราชการหมุนเวียน
            </div>
          </Link>

          {/* 7. เงินยืมเกินกำหนด */}
          <Link
            href="/loans?status=OUTSTANDING"
            className="card-soft p-5 group hover:border-[#FF4664] transition-all relative overflow-hidden border-t-2 border-t-[#FF4664]"
          >
            <div className="flex items-center justify-between text-xs text-[#FF4664] font-bold mb-2">
              <span>7. เงินยืมเกินกำหนด 30 วัน</span>
              <div className="w-7 h-7 rounded-lg bg-[#FFF0F2] text-[#FF4664] flex items-center justify-center group-hover:bg-[#FF4664] group-hover:text-white transition-colors">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#FF4664] tracking-tight">
              {formatThaiCurrency(kpis.overdueLoans)}
            </div>
            <div className="text-[11px] text-[#FF4664] font-medium mt-1.5">
              เกินกำหนด {kpis.overdueLoanCount} สัญญา (ต้องส่งหนังสือทวง)
            </div>
          </Link>

          {/* 8. ภาระผูกพัน */}
          <Link
            href="/commitments"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>8. ภาระผูกพัน (Commitment)</span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Layers className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.totalCommitments)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">
              PO สัญญาจ้าง และค่าบริการค้างจ่าย
            </div>
          </Link>

          {/* 9. งบประมาณทั้งหมด */}
          <Link
            href="/budget"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>9. งบประมาณทั้งหมด (กรอบ)</span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-[#08294F] flex items-center justify-center group-hover:bg-[#08294F] group-hover:text-white transition-colors">
                <PieChart className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08294F] tracking-tight">
              {formatThaiCurrency(kpis.totalBudgetAllocated)}
            </div>
            <div className="text-[11px] text-gray-500 mt-1.5">
              จัดสรร + โอนเปลี่ยนแปลง
            </div>
          </Link>

          {/* 10. เบิกจ่ายแล้ว */}
          <Link
            href="/budget"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>10. เบิกจ่ายจริงสะสม (Spent)</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ArrowDownRight className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-emerald-600 tracking-tight">
              {formatThaiCurrency(kpis.totalBudgetSpent)}
            </div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1.5">
              คิดเป็น 79.5% ของงบจัดสรร
            </div>
          </Link>

          {/* 11. งบประมาณคงเหลือ */}
          <Link
            href="/budget"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>11. วงเงินงบประมาณคงเหลือ</span>
              <div className="w-7 h-7 rounded-lg bg-teal-50 text-[#08A7A4] flex items-center justify-center group-hover:bg-[#08A7A4] group-hover:text-white transition-colors">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#08A7A4] tracking-tight">
              {formatThaiCurrency(kpis.totalBudgetAvailable)}
            </div>
            <div className="text-[11px] text-[#08A7A4] font-medium mt-1.5">
              หักภาระผูกพันแล้ว พร้อมเบิกจ่าย
            </div>
          </Link>

          {/* 12. รายได้สะสม */}
          <Link
            href="/revenue"
            className="card-soft p-5 group hover:border-[#1687E8] transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-xs text-gray-500 font-semibold mb-2">
              <span>12. รายได้สะสม (Revenue)</span>
              <div className="w-7 h-7 rounded-lg bg-cyan-50 text-[#1687E8] flex items-center justify-center group-hover:bg-[#1687E8] group-hover:text-white transition-colors">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="text-xl font-bold text-[#1687E8] tracking-tight">
              {formatThaiCurrency(kpis.totalAccumulatedRevenue)}
            </div>
            <div className="text-[11px] text-blue-600 font-medium mt-1.5 flex items-center space-x-0.5">
              <ArrowUpRight className="w-3 h-3" />
              <span>รายรับตามแผนปีงบ 2569</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Visual Charts & Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Monthly Inflow vs Outflow (Area Chart) */}
        <div className="card-soft p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-[#08294F]">
                กระแสเงินสดรายเดือน (Monthly Cash Flow Trend)
              </h3>
              <p className="text-xs text-gray-500">
                เปรียบเทียบรายรับจริง (Inflow) และรายจ่ายจริง (Outflow) ประจำปีงบประมาณ 2569
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-[#1687E8]"></span>
                <span className="text-gray-600 font-medium">เงินเข้า (Inflow)</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-3 h-3 rounded bg-[#FF4664]"></span>
                <span className="text-gray-600 font-medium">เงินออก (Outflow)</span>
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.cashFlowTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1687E8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#1687E8" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4664" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#FF4664" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis
                  tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`}
                  tick={{ fontSize: 11, fill: '#64748B' }}
                />
                <Tooltip
                  formatter={(val: any) => [`${formatThaiCurrency(val)} บาท`, '']}
                  labelFormatter={(label) => `เดือน ${label}`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="inflow" stroke="#1687E8" strokeWidth={2.5} fillOpacity={1} fill="url(#inflowGrad)" name="รายรับ" />
                <Area type="monotone" dataKey="outflow" stroke="#FF4664" strokeWidth={2.5} fillOpacity={1} fill="url(#outflowGrad)" name="รายจ่าย" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Distribution by Fund (Donut Pie Chart) */}
        <div className="card-soft p-6">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#08294F]">
              โครงสร้างรายได้แยกตามแหล่งเงิน
            </h3>
            <p className="text-xs text-gray-500">
              สัดส่วนเงินบำรุง กองทุน และเงินบริจาค
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={charts.revenueByFund}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {charts.revenueByFund.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `${formatThaiCurrency(val)} บาท`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '12px' }}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 mt-2">
            {charts.revenueByFund.map((item: any) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-gray-700 font-medium truncate max-w-[150px]">{item.name}</span>
                </div>
                <div className="font-bold text-[#08294F]">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aging Distribution & Department Budget Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Receivable Aging Distribution */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#08294F]">
                การวิเคราะห์อายุหนี้ลูกหนี้ (Receivable Aging)
              </h3>
              <p className="text-xs text-gray-500">
                แยกตามช่วงเวลาเกินกำหนดชำระเพื่อติดตามหนี้
              </p>
            </div>
            <Link
              href="/receivables"
              className="text-xs font-semibold text-[#1687E8] hover:underline flex items-center space-x-1"
            >
              <span>ดูตารางลูกหนี้</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5 mt-4">
            {charts.receivableAging.map((bucket: any) => (
              <div key={bucket.name} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: bucket.color }}></span>
                  <div>
                    <div className="text-xs font-bold text-[#08294F]">{bucket.name}</div>
                    <div className="text-[10px] text-gray-500">จำนวน {bucket.count} รายการ</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-[#08294F]">
                    {formatThaiCurrency(bucket.amount)}
                  </div>
                  <div className="text-[10px] text-gray-400">บาท</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Actual by Department (Stacked Bar Chart) */}
        <div className="card-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#08294F]">
                การใช้จ่ายงบประมาณแยกตามกลุ่มงาน
              </h3>
              <p className="text-xs text-gray-500">
                เบิกจ่ายจริง vs ภาระผูกพัน vs วงเงินคงเหลือ
              </p>
            </div>
            <Link
              href="/budget"
              className="text-xs font-semibold text-[#1687E8] hover:underline flex items-center space-x-1"
            >
              <span>ดูงบประมาณ</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="h-64 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={charts.budgetSummaryByDept}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis type="number" tickFormatter={(val) => `${(val / 1000000).toFixed(0)}M`} tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="dept" tick={{ fontSize: 10, fill: '#08294F' }} width={110} />
                <Tooltip
                  formatter={(val: any) => `${formatThaiCurrency(val)} บาท`}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="spent" name="เบิกจ่ายแล้ว" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="committed" name="ผูกพัน (PO)" stackId="a" fill="#F59E0B" />
                <Bar dataKey="available" name="คงเหลือ" stackId="a" fill="#1687E8" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

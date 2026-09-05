'use client';

import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  Download,
  Printer,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Receipt,
  CreditCard,
  PieChart,
  FileCheck2,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { store } from '@/lib/data-store';

export default function MonthlySummaryPage() {
  const [selectedMonth, setSelectedMonth] = useState('2024-09');
  const [selectedYear, setSelectedYear] = useState('2567');
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'BANK' | 'BUDGET' | 'AR_AP' | 'LOAN' | 'NOTES'>('OVERVIEW');
  const [isPrinting, setIsPrinting] = useState(false);

  // Financial summary data for executive report
  const summaryMetrics = {
    cashBankEnding: 52480350.0,
    cashBankChange: +3980000.0,
    monthlyRevenue: 11450000.0,
    monthlyExpense: 7470000.0,
    netCashFlow: +3980000.0,
    totalBudget: 174000000.0,
    spentBudget: 134300000.0,
    committedBudget: 10100000.0,
    availableBudget: 29600000.0,
    budgetDisbursementRate: 77.18,
    targetRate: 75.0,
    totalAR: 15250000.0,
    arOverdue90: 3200000.0,
    totalAP: 5820000.0,
    apDueNextMonth: 2450000.0,
    totalLoans: 250000.0,
    loansOverdue30: 85000.0,
    currentRatio: 2.85,
    quickRatio: 2.42,
    netWorkingCapital: 46660350.0,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Key Metrics
    const metricsData = [
      ['สรุปสาระสำคัญทางบัญชีในการบริหารเงินและงบประมาณประจำเดือน'],
      ['ประจำเดือน:', selectedMonth, 'ปีงบประมาณ (พ.ศ.):', selectedYear],
      ['โรงพยาบาล:', 'โรงพยาบาลพหลพลพยุหเสนา', 'วันที่ออกรายงาน:', new Date().toLocaleDateString('th-TH')],
      [],
      ['รายการตัวชี้วัดสำคัญ (Key Financial Metrics)', 'จำนวนเงิน (บาท)', 'หน่วย/หมายเหตุ'],
      ['1. เงินสดและเงินฝากธนาคารคงเหลือสิ้นงวด', summaryMetrics.cashBankEnding, 'บาท'],
      ['2. รายรับจริงประจำเดือน', summaryMetrics.monthlyRevenue, 'บาท'],
      ['3. รายจ่ายจริงประจำเดือน', summaryMetrics.monthlyExpense, 'บาท'],
      ['4. กระแสเงินสดสุทธิประจำเดือน (Net Cash Flow)', summaryMetrics.netCashFlow, 'บาท'],
      ['5. งบประมาณที่ได้รับจัดสรรทั้งสิ้น', summaryMetrics.totalBudget, 'บาท'],
      ['6. ผลการเบิกจ่ายงบประมาณสะสม', summaryMetrics.spentBudget, 'บาท'],
      ['7. อัตราการเบิกจ่ายงบประมาณสะสม (%)', `${summaryMetrics.budgetDisbursementRate}%`, 'เป้าหมายกระทรวง 75%'],
      ['8. งบประมาณผูกพัน (PO/สัญญาจ้าง)', summaryMetrics.committedBudget, 'บาท'],
      ['9. วงเงินงบประมาณคงเหลือสุทธิ', summaryMetrics.availableBudget, 'บาท'],
      ['10. ลูกหนี้ค่ารักษาพยาบาลคงค้างทั้งหมด', summaryMetrics.totalAR, 'บาท'],
      ['11. ลูกหนี้ค้างเกิน 90 วัน (เสี่ยงสูง)', summaryMetrics.arOverdue90, 'บาท'],
      ['12. เจ้าหนี้การค้าคงค้างทั้งหมด', summaryMetrics.totalAP, 'บาท'],
      ['13. เจ้าหนี้ที่ครบกำหนดชำระเดือนถัดไป', summaryMetrics.apDueNextMonth, 'บาท'],
      ['14. เงินยืมราชการคงค้าง', summaryMetrics.totalLoans, 'บาท'],
      ['15. เงินยืมราชการค้างเกิน 30 วันตามระเบียบ', summaryMetrics.loansOverdue30, 'บาท'],
      ['16. เงินทุนสำรองสุทธิ (Net Working Capital)', summaryMetrics.netWorkingCapital, 'บาท'],
      ['17. อัตราส่วนสภาพคล่องหมุนเวียน (Current Ratio)', `${summaryMetrics.currentRatio} เท่า`, 'เกณฑ์ปกติ > 1.5 เท่า'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(metricsData);
    ws['!cols'] = [{ wch: 45 }, { wch: 22 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, 'สรุปภาพรวม');

    XLSX.writeFile(wb, `Monthly_Financial_Summary_${selectedMonth}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gray-200/80 shadow-xs flex items-center justify-center shrink-0">
            <img
              src="/img/pdh.png"
              alt="PDH Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 text-[11px] font-bold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#1687E8]" />
              <span>รายงานสรุปสำหรับผู้บริหารและคณะกรรมการโรงพยาบาล (กวป.)</span>
            </div>
            <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
              <FileText className="w-6 h-6 text-[#1687E8]" />
              <span>สรุปสาระสำคัญทางบัญชีในการบริหารเงินและงบประมาณประจำเดือน</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              โรงพยาบาลปลวกแดง • กลุ่มงานการเงินและบัญชี
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Month Selector */}
          <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-xs">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              aria-label="เลือกเดือนประจำงวด"
              className="text-xs font-semibold text-gray-700 bg-transparent focus:outline-hidden"
            >
              <option value="2024-09">กันยายน 2567 (สิ้นปีงบประมาณ)</option>
              <option value="2024-08">สิงหาคม 2567</option>
              <option value="2024-07">กรกฎาคม 2567</option>
              <option value="2024-06">มิถุนายน 2567 (สิ้นไตรมาส 3)</option>
            </select>
          </div>

          {/* Export Excel */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel</span>
          </button>

          {/* Print A4 */}
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#08294F] hover:bg-[#0D3768] shadow-md shadow-[#08294F]/20 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>พิมพ์รายงาน A4</span>
          </button>
        </div>
      </div>

      {/* Official Printable Document Header (Appears in Print Mode) */}
      <div className="hidden print:flex items-center justify-center space-x-4 border-b-2 border-gray-800 pb-4 mb-6">
        <img src="/img/pdh.png" alt="PDH Logo" className="w-16 h-16 object-contain" />
        <div className="text-center">
          <div className="font-bold text-lg text-black">
            รายงานสรุปสาระสำคัญทางบัญชีในการบริหารเงินและงบประมาณประจำเดือน
          </div>
          <div className="text-sm text-gray-800 font-semibold">
            โรงพยาบาลปลวกแดง • กลุ่มงานการเงินและบัญชี สำนักงานปลัดกระทรวงสาธารณสุข
          </div>
          <div className="text-xs text-gray-600 mt-1">
            ประจำงวดเดือน {selectedMonth === '2024-09' ? 'กันยายน 2567' : selectedMonth} ปีงบประมาณ พ.ศ. {selectedYear}
          </div>
        </div>
      </div>

      {/* Top 6 Executive Metrics Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {/* 1. Cash & Bank Ending */}
        <div className="card-soft p-4 border-l-4 border-l-[#1687E8]">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>เงินฝากธนาคารสิ้นงวด</span>
            <Wallet className="w-4 h-4 text-[#1687E8]" />
          </div>
          <div className="text-base font-extrabold text-[#08294F] mt-1">
            ฿{summaryMetrics.cashBankEnding.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold flex items-center mt-1">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>+3.98M จากเดือนก่อน</span>
          </div>
        </div>

        {/* 2. Monthly Net Cash Flow */}
        <div className="card-soft p-4 border-l-4 border-l-emerald-500">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>กระแสเงินสดสุทธิเดือนนี้</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-emerald-700 mt-1">
            +฿{summaryMetrics.netCashFlow.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            รับ ฿11.45M / จ่าย ฿7.47M
          </div>
        </div>

        {/* 3. Budget Rate */}
        <div className="card-soft p-4 border-l-4 border-l-indigo-500">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>อัตราเบิกจ่ายงบประมาณ</span>
            <PieChart className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-base font-extrabold text-indigo-900 mt-1">
            {summaryMetrics.budgetDisbursementRate}%
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold flex items-center mt-1">
            <CheckCircle2 className="w-3 h-3 mr-0.5 text-emerald-600" />
            <span>ผ่านเป้าหมายกระทรวง (75%)</span>
          </div>
        </div>

        {/* 4. AR Outstanding */}
        <div className="card-soft p-4 border-l-4 border-l-amber-500">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>ลูกหนี้คงค้างสุทธิ</span>
            <Receipt className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-base font-extrabold text-[#08294F] mt-1">
            ฿{summaryMetrics.totalAR.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-1">
            เกิน 90 วัน: ฿3.20M (21%)
          </div>
        </div>

        {/* 5. AP Due Next Month */}
        <div className="card-soft p-4 border-l-4 border-l-rose-500">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>เจ้าหนี้ครบกำหนดเดือนถัดไป</span>
            <CreditCard className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-base font-extrabold text-rose-700 mt-1">
            ฿{summaryMetrics.apDueNextMonth.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            จากเจ้าหนี้รวม ฿5.82M
          </div>
        </div>

        {/* 6. Overdue Loans */}
        <div className="card-soft p-4 border-l-4 border-l-purple-500">
          <div className="text-[11px] font-bold text-gray-500 flex items-center justify-between">
            <span>เงินยืมเกินกำหนด 30 วัน</span>
            <AlertTriangle className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-base font-extrabold text-purple-900 mt-1">
            ฿{summaryMetrics.loansOverdue30.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-rose-600 font-semibold mt-1">
            จำนวน 2 สัญญา (ต้องเร่งรัด)
          </div>
        </div>
      </div>

      {/* Navigation Tabs for In-depth Sections */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 text-xs font-semibold print:hidden overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'ภาพรวมบริหารเงินและดัชนีสภาพคล่อง' },
          { id: 'BANK', label: '1. เงินฝากธนาคารและการกระทบยอด' },
          { id: 'BUDGET', label: '2. ผลเบิกจ่ายงบประมาณและภาระผูกพัน' },
          { id: 'AR_AP', label: '3. คุณภาพลูกหนี้และกำหนดชำระเจ้าหนี้' },
          { id: 'LOAN', label: '4. ติดตามเงินยืมราชการ' },
          { id: 'NOTES', label: '5. ข้อสังเกตและข้อเสนอแนะสำหรับ ผอ./CFO' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#08294F] text-white font-bold shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT 1: OVERVIEW & LIQUIDITY */}
      {(activeTab === 'OVERVIEW' || isPrinting) && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Liquidity Ratios Card */}
            <div className="card-soft p-5 space-y-4">
              <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#08A7A4]" />
                <span>ดัชนีวัดสภาพคล่องทางการเงิน (Liquidity Indices)</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#08294F]">Current Ratio (อัตราส่วนทุนหมุนเวียน)</div>
                    <div className="text-[11px] text-gray-500">สินทรัพย์หมุนเวียน / หนี้สินหมุนเวียน</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-emerald-700">2.85 เท่า</span>
                    <div className="text-[10px] text-emerald-600 font-semibold">เกณฑ์ปลอดภัย (&gt;1.5)</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-teal-50/50 border border-teal-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#08294F]">Quick Ratio (อัตราส่วนสภาพคล่องเร็ว)</div>
                    <div className="text-[11px] text-gray-500">(เงินสด + เงินฝาก + ลูกหนี้) / หนี้สิน</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-800">2.42 เท่า</span>
                    <div className="text-[10px] text-teal-700 font-semibold">สภาพคล่องสูงมาก</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-[#08294F]">Net Working Capital (เงินทุนสำรองสุทธิ)</div>
                    <div className="text-[11px] text-gray-500">สินทรัพย์หมุนเวียน - หนี้สินหมุนเวียน</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-indigo-900">
                      ฿46,660,350.00
                    </span>
                    <div className="text-[10px] text-indigo-600 font-semibold">รองรับค่าใช้จ่ายได้ 6.2 เดือน</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Operating Cash Flow Comparison */}
            <div className="card-soft p-5 lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>สรุปผลการรับ-จ่ายเงินสดจริงประจำเดือน (Cash Basis Statement)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Revenue Breakdown */}
                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
                  <div className="font-bold text-xs text-emerald-900 mb-2 flex items-center justify-between">
                    <span>รายรับจริงประจำเดือน</span>
                    <span className="text-emerald-700 font-extrabold">฿11,450,000.00</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <span>• เงินชดเชยค่าบริการ สปสช. (UC):</span>
                      <span className="font-mono font-semibold">฿6,800,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• กองทุนประกันสังคม (SSS):</span>
                      <span className="font-mono font-semibold">฿2,400,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• กรมบัญชีกลาง ข้าราชการ (CSMBS):</span>
                      <span className="font-mono font-semibold">฿1,450,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• รายรับห้องการเงิน/เงินบริจาค/อื่นๆ:</span>
                      <span className="font-mono font-semibold">฿800,000.00</span>
                    </div>
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="p-4 rounded-xl border border-rose-100 bg-rose-50/30">
                  <div className="font-bold text-xs text-rose-900 mb-2 flex items-center justify-between">
                    <span>รายจ่ายจริงประจำเดือน</span>
                    <span className="text-rose-700 font-extrabold">฿7,470,000.00</span>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-gray-600">
                    <div className="flex justify-between">
                      <span>• ชำระหนี้ค่ายาและเวชภัณฑ์:</span>
                      <span className="font-mono font-semibold">฿3,850,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• ค่าจ้างเหมาบริการและสาธารณูปโภค:</span>
                      <span className="font-mono font-semibold">฿1,420,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• ค่าตอบแทนบุคลากรทางการแพทย์ (พ.ต.ส./เบี้ยเลี้ยง):</span>
                      <span className="font-mono font-semibold">฿1,850,000.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>• จ่ายเงินยืมราชการและอื่นๆ:</span>
                      <span className="font-mono font-semibold">฿350,000.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Result Bar */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#08294F] to-[#1687E8] text-white flex items-center justify-between text-xs">
                <span className="font-semibold">กระแสเงินสดรับสุทธิจากการดำเนินงาน (Net Operating Cash Flow):</span>
                <span className="text-sm font-extrabold text-emerald-300 font-mono">
                  +฿3,980,000.00
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: BANK ACCOUNTS */}
      {(activeTab === 'BANK' || isPrinting) && (
        <div className="card-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
              <Wallet className="w-4 h-4 text-[#1687E8]" />
              <span>1. สรุปสถานะเงินฝากธนาคารและการกระทบยอดสิ้นงวด (Bank Reconciliation Summary)</span>
            </h3>
            <span className="text-xs font-semibold text-gray-500">
              ยอดคงเหลือรวม: ฿52,480,350.00
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08294F] text-white">
                <tr>
                  <th className="py-2.5 px-3">ธนาคาร / สาขา</th>
                  <th className="py-2.5 px-3">เลขที่บัญชี</th>
                  <th className="py-2.5 px-3">ประเภทบัญชี</th>
                  <th className="py-2.5 px-3 text-right">ยอดตาม Statement</th>
                  <th className="py-2.5 px-3 text-right">เช็คค้างจ่าย</th>
                  <th className="py-2.5 px-3 text-right">ยอดตามบัญชีระบบ</th>
                  <th className="py-2.5 px-3 text-center">สถานะกระทบยอด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">ธนาคารกรุงไทย สาขากาญจนบุรี</td>
                  <td className="py-2.5 px-3 font-mono">701-0-12345-6</td>
                  <td className="py-2.5 px-3 text-gray-600">กระแสรายวัน (เงินบำรุง)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿32,450,150.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600">-฿485,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#08294F]">฿31,965,150.00</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตรงกัน 100%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">ธนาคารไทยพาณิชย์ สาขาเมืองกาญจนบุรี</td>
                  <td className="py-2.5 px-3 font-mono">111-2-34567-8</td>
                  <td className="py-2.5 px-3 text-gray-600">ออมทรัพย์ (เงินรับบริจาค)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿14,250,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-400">฿0.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#08294F]">฿14,250,000.00</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตรงกัน 100%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">ธนาคารกรุงเทพ สาขาศาลากลาง</td>
                  <td className="py-2.5 px-3 font-mono">222-3-45678-9</td>
                  <td className="py-2.5 px-3 text-gray-600">กระแสรายวัน (งบลงทุน)</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿6,150,200.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600">-฿115,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#08294F]">฿6,035,200.00</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตรงกัน 100%
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">เงินสดในมือห้องการเงิน (Cash on Hand)</td>
                  <td className="py-2.5 px-3 font-mono">-</td>
                  <td className="py-2.5 px-3 text-gray-600">เงินสดย่อยและเงินทดรอง</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿230,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-400">฿0.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-[#08294F]">฿230,000.00</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตรวจนับแล้ว
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100 font-bold text-[#08294F]">
                <tr>
                  <td colSpan={3} className="py-2.5 px-3">รวมเงินสดและเงินฝากธนาคารทั้งหมด</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿53,080,350.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-rose-600">-฿600,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-base text-[#1687E8]">฿52,480,350.00</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700">กระทบยอดสมบูรณ์</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: BUDGET */}
      {(activeTab === 'BUDGET' || isPrinting) && (
        <div className="card-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
              <PieChart className="w-4 h-4 text-indigo-600" />
              <span>2. สรุปผลการเบิกจ่ายงบประมาณและภาระผูกพัน (Budget Execution Rate)</span>
            </h3>
            <span className="text-xs font-semibold text-emerald-700">
              อัตราเบิกจ่ายสะสม: 77.18% (เป้าหมาย 75.00%)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08294F] text-white">
                <tr>
                  <th className="py-2.5 px-3">หมวดรายจ่าย</th>
                  <th className="py-2.5 px-3 text-right">งบจัดสรร (Allocated)</th>
                  <th className="py-2.5 px-3 text-right">ภาระผูกพัน PO</th>
                  <th className="py-2.5 px-3 text-right">เบิกจ่ายจริง (Spent)</th>
                  <th className="py-2.5 px-3 text-right">คงเหลือสุทธิ</th>
                  <th className="py-2.5 px-3 text-center">% เบิกจ่าย</th>
                  <th className="py-2.5 px-3 text-center">ประเมิน</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">งบยาและเวชภัณฑ์มิใช่ยา</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿85,000,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700">฿4,800,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿68,500,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">฿11,700,000.00</td>
                  <td className="py-2.5 px-3 text-center font-bold">80.59%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตามแผน
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">งบดำเนินงานและค่าจ้างเหมา</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿42,000,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700">฿2,100,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿32,400,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">฿7,500,000.00</td>
                  <td className="py-2.5 px-3 text-center font-bold">77.14%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตามแผน
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">งบค่าตอบแทนบุคลากร (พ.ต.ส./OT)</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿35,000,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-gray-400">฿0.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿26,900,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">฿8,100,000.00</td>
                  <td className="py-2.5 px-3 text-center font-bold">76.86%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ตามแผน
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-bold text-[#08294F]">งบลงทุน/ครุภัณฑ์ทางการแพทย์</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿12,000,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700">฿3,200,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿6,500,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">฿2,300,000.00</td>
                  <td className="py-2.5 px-3 text-center font-bold text-amber-700">54.17%</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      รอส่งมอบงาน
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100 font-bold text-[#08294F]">
                <tr>
                  <td className="py-2.5 px-3">รวมงบประมาณทุกหมวด</td>
                  <td className="py-2.5 px-3 text-right font-mono">฿174,000,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-amber-700">฿10,100,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#1687E8]">฿134,300,000.00</td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-700">฿29,600,000.00</td>
                  <td className="py-2.5 px-3 text-center text-sm">77.18%</td>
                  <td className="py-2.5 px-3 text-center text-emerald-700">ผ่านเกณฑ์</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: AR & AP */}
      {(activeTab === 'AR_AP' || isPrinting) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* AR Aging */}
          <div className="card-soft p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-amber-600" />
                <span>3.1 สรุปอายุหนี้ลูกหนี้ค่ารักษาพยาบาล (AR Aging)</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#08294F]">฿15,250,000.00</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-3">ช่วงอายุหนี้</th>
                    <th className="py-2 px-3 text-right">ยอดหนี้ (บาท)</th>
                    <th className="py-2 px-3 text-center">สัดส่วน (%)</th>
                    <th className="py-2 px-3 text-right">สำรองหนี้สงสัยจะสูญ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="py-2 px-3 font-semibold text-emerald-700">ยังไม่ถึงกำหนด / ไม่เกิน 30 วัน</td>
                    <td className="py-2 px-3 text-right font-mono">฿8,450,000.00</td>
                    <td className="py-2 px-3 text-center">55.4%</td>
                    <td className="py-2 px-3 text-right font-mono text-gray-400">฿0.00 (0%)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-blue-700">ค้างชำระ 31 - 60 วัน</td>
                    <td className="py-2 px-3 text-right font-mono">฿2,400,000.00</td>
                    <td className="py-2 px-3 text-center">15.7%</td>
                    <td className="py-2 px-3 text-right font-mono text-gray-500">฿48,000.00 (2%)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-semibold text-amber-700">ค้างชำระ 61 - 90 วัน</td>
                    <td className="py-2 px-3 text-right font-mono">฿1,200,000.00</td>
                    <td className="py-2 px-3 text-center">7.9%</td>
                    <td className="py-2 px-3 text-right font-mono text-amber-700">฿60,000.00 (5%)</td>
                  </tr>
                  <tr className="bg-rose-50/50">
                    <td className="py-2 px-3 font-bold text-rose-700">ค้างชำระเกิน 90 วัน (เสี่ยงสูง)</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿3,200,000.00</td>
                    <td className="py-2 px-3 text-center font-bold text-rose-700">21.0%</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿372,000.00</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td className="py-2 px-3">รวมลูกหนี้และประมาณการสำรอง</td>
                    <td className="py-2 px-3 text-right font-mono text-[#08294F]">฿15,250,000.00</td>
                    <td className="py-2 px-3 text-center">100.0%</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700">฿480,000.00</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* AP Due */}
          <div className="card-soft p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-rose-600" />
                <span>3.2 สรุปกำหนดชำระเจ้าหนี้การค้า (AP Due Schedule)</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#08294F]">฿5,820,000.00</span>
            </h3>

            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="py-2 px-3">กลุ่มเจ้าหนี้</th>
                    <th className="py-2 px-3 text-right">ยอดหนี้รวม</th>
                    <th className="py-2 px-3 text-right">ครบกำหนดใน 30 วัน</th>
                    <th className="py-2 px-3 text-center">เครดิตเทอม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#08294F]">ค่ายา (องค์การเภสัชกรรม / บริษัทยา)</td>
                    <td className="py-2 px-3 text-right font-mono">฿3,850,000.00</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿1,650,000.00</td>
                    <td className="py-2 px-3 text-center">30 - 60 วัน</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#08294F]">เวชภัณฑ์และวัสดุการแพทย์</td>
                    <td className="py-2 px-3 text-right font-mono">฿1,150,000.00</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿480,000.00</td>
                    <td className="py-2 px-3 text-center">30 วัน</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#08294F]">ค่าจ้างเหมาบริการและรักษาความสะอาด</td>
                    <td className="py-2 px-3 text-right font-mono">฿580,000.00</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿220,000.00</td>
                    <td className="py-2 px-3 text-center">30 วัน</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-bold text-[#08294F]">ค่าสาธารณูปโภค (ไฟฟ้า/น้ำประปา)</td>
                    <td className="py-2 px-3 text-right font-mono">฿240,000.00</td>
                    <td className="py-2 px-3 text-right font-mono font-bold text-rose-700">฿100,000.00</td>
                    <td className="py-2 px-3 text-center">15 วัน</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50 font-bold">
                  <tr>
                    <td className="py-2 px-3">รวมเจ้าหนี้และยอดที่ต้องเตรียมจ่าย</td>
                    <td className="py-2 px-3 text-right font-mono text-[#08294F]">฿5,820,000.00</td>
                    <td className="py-2 px-3 text-right font-mono text-rose-700 text-sm">฿2,450,000.00</td>
                    <td className="py-2 px-3 text-center text-emerald-700">สภาพคล่องพอจ่าย</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: LOANS */}
      {(activeTab === 'LOAN' || isPrinting) && (
        <div className="card-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-purple-600" />
              <span>4. สรุปเงินยืมราชการและการปฏิบัติตามระเบียบกระทรวงการคลัง (Government Loan Compliance)</span>
            </h3>
            <span className="text-xs font-semibold text-rose-600">
              ค้างเกิน 30 วัน: ฿85,000.00 (2 รายการ)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08294F] text-white">
                <tr>
                  <th className="py-2.5 px-3">เลขที่สัญญา</th>
                  <th className="py-2.5 px-3">ผู้ยืม / ตำแหน่ง</th>
                  <th className="py-2.5 px-3">กลุ่มงาน</th>
                  <th className="py-2.5 px-3">วัตถุประสงค์</th>
                  <th className="py-2.5 px-3 text-right">จำนวนเงินยืม</th>
                  <th className="py-2.5 px-3">กำหนดส่งใช้</th>
                  <th className="py-2.5 px-3 text-center">สถานะตามระเบียบ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                <tr className="hover:bg-gray-50 bg-rose-50/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-800">LN-67-0091</td>
                  <td className="py-2.5 px-3 font-bold text-gray-800">พญ.นภา วัฒนกุล (นายแพทย์ชำนาญการ)</td>
                  <td className="py-2.5 px-3 text-gray-600">กลุ่มงานอายุรกรรม</td>
                  <td className="py-2.5 px-3 text-gray-600">อบรมพัฒนาศักยภาพเครือข่ายโรคไตวายเรื้อรัง</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">฿55,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">2024-07-15</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      เกินกำหนด 52 วัน
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50 bg-rose-50/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-rose-800">LN-67-0093</td>
                  <td className="py-2.5 px-3 font-bold text-gray-800">นายวิชัย สดใส (เจ้าพนักงานธุรการ)</td>
                  <td className="py-2.5 px-3 text-gray-600">กลุ่มงานบริหารทั่วไป</td>
                  <td className="py-2.5 px-3 text-gray-600">จัดกิจกรรมวันป้องกันและบรรเทาสาธารณภัย</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-700">฿30,000.00</td>
                  <td className="py-2.5 px-3 font-mono text-rose-700">2024-08-01</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                      เกินกำหนด 35 วัน
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#08294F]">LN-67-0102</td>
                  <td className="py-2.5 px-3 font-bold text-gray-800">นพ.สมเกียรติ พัฒนกิจ (นายแพทย์ชำนาญการพิเศษ)</td>
                  <td className="py-2.5 px-3 text-gray-600">กลุ่มงานศัลยกรรม</td>
                  <td className="py-2.5 px-3 text-gray-600">จัดประชุมวิชาการศัลยแพทย์เขตสุขภาพ</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿85,000.00</td>
                  <td className="py-2.5 px-3 font-mono">2024-09-20</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      อยู่ในกำหนดเวลา
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#08294F]">LN-67-0105</td>
                  <td className="py-2.5 px-3 font-bold text-gray-800">นางสาววิไลลักษณ์ จันทร์เพ็ญ (พยาบาลวิชาชีพ)</td>
                  <td className="py-2.5 px-3 text-gray-600">กลุ่มงานการพยาบาล</td>
                  <td className="py-2.5 px-3 text-gray-600">ศึกษาดูงานระบบการดูแลผู้ป่วยระยะประคับประคอง</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold">฿80,000.00</td>
                  <td className="py-2.5 px-3 font-mono">2024-09-30</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      อยู่ในกำหนดเวลา
                    </span>
                  </td>
                </tr>
              </tbody>
              <tfoot className="bg-gray-100 font-bold text-[#08294F]">
                <tr>
                  <td colSpan={4} className="py-2.5 px-3">รวมเงินยืมราชการคงค้างทั้งสิ้น</td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#1687E8] text-sm">฿250,000.00</td>
                  <td colSpan={2} className="py-2.5 px-3 text-rose-700">
                    ต้องเร่งรัดติดตาม 2 สัญญา (ส่งหนังสือเตือนครั้งที่ 2)
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: EXECUTIVE NOTES & RECOMMENDATIONS */}
      {(activeTab === 'NOTES' || isPrinting) && (
        <div className="card-soft p-6 space-y-4">
          <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
            <Building className="w-5 h-5 text-[#1687E8]" />
            <span>5. ข้อสังเกตและข้อเสนอแนะทางบัญชีสำหรับผู้บริหาร (Executive Notes & Strategic Recommendations)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-700">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <div className="font-bold text-emerald-900 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>จุดแข็งด้านการเงินประจำงวด (Financial Strengths)</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed">
                <li>
                  <span className="font-semibold text-gray-800">สภาพคล่องแข็งแกร่งมาก:</span> ยอดเงินสดและเงินฝากธนาคารคงเหลือ 52.48 ล้านบาท คิดเป็น Current Ratio 2.85 เท่า เพียงพอต่อการดำเนินงานได้มากกว่า 6 เดือนโดยไม่สะดุด
                </li>
                <li>
                  <span className="font-semibold text-gray-800">ผลการเบิกจ่ายงบประมาณบรรลุเป้า:</span> เบิกจ่ายสะสม 77.18% สูงกว่าเกณฑ์ขั้นต่ำของกระทรวงสาธารณสุข (75.00%)
                </li>
                <li>
                  <span className="font-semibold text-gray-800">การกระทบยอดธนาคารตรงกัน 100%:</span> ไม่มีรายการยอดคลาดเคลื่อนหรือเงินตกหล่นในระบบบัญชี
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <div className="font-bold text-amber-900 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>ประเด็นความเสี่ยงและมาตรการแก้ไขที่ต้องเร่งรัด (Risks & Action Items)</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600 leading-relaxed">
                <li>
                  <span className="font-semibold text-gray-800">ลูกหนี้ค่ารักษาค้างเกิน 90 วัน:</span> มียอดรวม 3.20 ล้านบาท (ส่วนใหญ่เป็นสิทธิ สปสช. IPD รอ Audit) เสนอให้กลุ่มงานประกันสุขภาพเร่งส่งข้อมูลอุทธรณ์/แก้ไข Error Code ภายใน 15 วัน
                </li>
                <li>
                  <span className="font-semibold text-gray-800">เงินยืมราชการค้างเกิน 30 วัน:</span> พบ 2 รายการ ยอดรวม 85,000 บาท เสนอให้ออกหนังสือเร่งรัดติดตามจากกลุ่มงานการเงินและบัญชีตามระเบียบกระทรวงการคลัง
                </li>
                <li>
                  <span className="font-semibold text-gray-800">งบลงทุนรอส่งมอบงาน:</span> วงเงินผูกพัน 3.20 ล้านบาท (เครื่องตรวจคลื่นเสียงความถี่สูง) คณะกรรมการตรวจรับควรเร่งรัดผู้ขายให้ส่งมอบก่อนสิ้นปีงบประมาณ
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Official Signatures Box for Print Mode */}
      <div className="hidden print:block pt-8 mt-8 border-t-2 border-gray-400 text-xs">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="space-y-12">
            <div>ผู้จัดทำรายงาน</div>
            <div className="border-b border-gray-500 w-48 mx-auto"></div>
            <div>
              <div className="font-bold">(นางสาวกานดา วิทยาการ)</div>
              <div className="text-gray-600">นักวิชาการเงินและบัญชีชำนาญการ</div>
              <div className="text-[10px] text-gray-500">วันที่ ...../...../..........</div>
            </div>
          </div>

          <div className="space-y-12">
            <div>ผู้ตรวจสอบ / CFO</div>
            <div className="border-b border-gray-500 w-48 mx-auto"></div>
            <div>
              <div className="font-bold">(นายสมเกียรติ พัฒนกิจการ)</div>
              <div className="text-gray-600">หัวหน้ากลุ่มงานการเงินและบัญชี</div>
              <div className="text-[10px] text-gray-500">วันที่ ...../...../..........</div>
            </div>
          </div>

          <div className="space-y-12">
            <div>ผู้อนุมัติ / ผอ.โรงพยาบาล</div>
            <div className="border-b border-gray-500 w-48 mx-auto"></div>
            <div>
              <div className="font-bold">(นายแพทย์ธีรพงษ์ เกียรติอนันต์)</div>
              <div className="text-gray-600">ผู้อำนวยการโรงพยาบาลพหลพลพยุหเสนา</div>
              <div className="text-[10px] text-gray-500">วันที่ ...../...../..........</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

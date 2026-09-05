'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Filter,
  Search,
  CheckCircle2,
  Layers,
  Wallet,
  Receipt,
  CreditCard,
  FileCheck2,
  PieChart,
  TrendingUp,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';
import { exportTableToExcel } from '@/lib/export-excel';
import { store } from '@/lib/data-store';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('1');
  const [fiscalYear, setFiscalYear] = useState('2569');

  const reportList = [
    { id: '1', title: '1. รายงานยอดเงินฝากธนาคารคงเหลือ (Bank Balance)', category: 'ธนาคาร', icon: Wallet },
    { id: '2', title: '2. รายงานรายการเคลื่อนไหวทางธนาคาร (Bank Transactions)', category: 'ธนาคาร', icon: Wallet },
    { id: '3', title: '3. รายงานการกระทบยอดเงินฝากธนาคาร (Bank Reconciliation)', category: 'ธนาคาร', icon: Wallet },
    { id: '4', title: '4. รายงานทะเบียนลูกหนี้คงค้าง (Receivables Report)', category: 'ลูกหนี้', icon: Receipt },
    { id: '5', title: '5. รายงานวิเคราะห์อายุหนี้ลูกหนี้ (Receivable Aging)', category: 'ลูกหนี้', icon: Receipt },
    { id: '6', title: '6. รายงานทะเบียนเจ้าหนี้คงค้าง (Payables Report)', category: 'เจ้าหนี้', icon: CreditCard },
    { id: '7', title: '7. รายงานวิเคราะห์อายุหนี้เจ้าหนี้ (Payable Aging)', category: 'เจ้าหนี้', icon: CreditCard },
    { id: '8', title: '8. รายงานภาระผูกพันทางการเงิน (Commitments)', category: 'ภาระผูกพัน', icon: Layers },
    { id: '9', title: '9. รายงานสัญญายืมเงินราชการ (Government Loans)', category: 'เงินยืม', icon: FileCheck2 },
    { id: '10', title: '10. รายงานเงินยืมราชการเกินกำหนด (Overdue Loans)', category: 'เงินยืม', icon: FileCheck2 },
    { id: '11', title: '11. รายงานจัดสรรงบประมาณประจำปี (Budget Allocation)', category: 'งบประมาณ', icon: PieChart },
    { id: '12', title: '12. รายงานงบประมาณเทียบการเบิกจ่ายจริง (Budget vs Actual)', category: 'งบประมาณ', icon: PieChart },
    { id: '13', title: '13. รายงานรายรับแยกตามแหล่งเงิน (Revenue by Fund)', category: 'รายได้', icon: TrendingUp },
    { id: '14', title: '14. รายงานรายจ่ายตามหมวดและกลุ่มงาน (Expense by Dept)', category: 'รายจ่าย', icon: CreditCard },
    { id: '15', title: '15. รายงานกระแสเงินสดรับ-จ่าย (Cash Flow Statement)', category: 'กระแสเงินสด', icon: TrendingUp },
    { id: '16', title: '16. รายงานการตรวจสอบย้อนหลัง (Audit Trail Log)', category: 'ตรวจสอบ', icon: ShieldCheck },
  ];

  // Helper to generate current preview data
  const getReportData = () => {
    switch (selectedReport) {
      case '1':
        return store.bankAccounts.map((a) => ({
          'ธนาคาร': a.bankName,
          'เลขที่บัญชี': a.accountNumber,
          'ชื่อบัญชี': a.accountName,
          'ประเภท': a.accountType,
          'ยอดยกมา (บาท)': a.openingBalance,
          'ยอดคงเหลือปัจจุบัน (บาท)': a.currentBalance,
        }));
      case '4':
        return store.receivables.map((r) => ({
          'เลขที่ AR': r.receivableNo,
          'ชื่อลูกหนี้': r.debtorName,
          'หมวดสิทธิ': r.category,
          'วันที่ตั้งหนี้': r.billDate,
          'วันครบกำหนด': r.dueDate,
          'ยอดหนี้ (บาท)': r.amount,
          'ชำระแล้ว (บาท)': r.paidAmount,
          'ยอดคงค้าง (บาท)': r.balance,
          'สถานะ': r.status,
        }));
      case '6':
        return store.payables.map((p) => ({
          'เลขที่ AP': p.payableNo,
          'บริษัทคู่ค้า': p.vendorName,
          'ใบแจ้งหนี้': p.invoiceNo,
          'วันที่แจ้งหนี้': p.invoiceDate,
          'วันครบกำหนด': p.dueDate,
          'ยอดหนี้ (บาท)': p.amount,
          'ยอดคงเหลือ (บาท)': p.balance,
          'สถานะ': p.status,
        }));
      case '8':
        return store.commitments.map((c) => ({
          'เลขที่ CM': c.commitmentNo,
          'เอกสารต้นทาง': c.sourceDocument,
          'กลุ่มงาน': c.departmentName,
          'คู่สัญญา': c.vendorName,
          'กำหนดจ่าย': c.expectedPaymentDate,
          'วงเงินผูกพัน (บาท)': c.amount,
          'สถานะ': c.status,
        }));
      case '9':
        return store.loans.map((l) => ({
          'เลขที่สัญญา': l.loanNo,
          'ชื่อผู้ยืม': l.borrowerName,
          'กลุ่มงาน': l.departmentName,
          'วัตถุประสงค์': l.purpose,
          'วันที่ยืม': l.requestDate,
          'กำหนดส่งใช้': l.dueDate,
          'วงเงินยืม (บาท)': l.amount,
          'ยอดคงค้าง (บาท)': l.balance,
          'สถานะ': l.status,
        }));
      case '12':
        return store.budgets.map((b) => ({
          'รหัสงบ': b.budgetCode,
          'หมวดงบประมาณ': b.budgetName,
          'กลุ่มงาน': b.departmentName,
          'งบจัดสรร (บาท)': b.allocated,
          'โอนเปลี่ยน (บาท)': b.adjustment,
          'ผูกพัน PO (บาท)': b.committed,
          'เบิกจ่ายจริง (บาท)': b.spent,
          'คงเหลือ (บาท)': b.available,
        }));
      case '13':
        return store.revenueTransactions.map((r) => ({
          'เลขที่เอกสาร': r.documentNo,
          'วันที่รับเงิน': r.revenueDate,
          'แหล่งเงิน': r.fundName,
          'หมวด': r.source,
          'คำอธิบาย': r.description,
          'จำนวนเงิน (บาท)': r.amount,
        }));
      default:
        return store.auditLogs.map((a) => ({
          'วัน-เวลา': a.createdAt,
          'ผู้ใช้งาน': a.username,
          'บทบาท': a.role,
          'โมดูล': a.module,
          'การกระทำ': a.action,
          'IP Address': a.ipAddress,
        }));
    }
  };

  const handleExportExcel = () => {
    const data = getReportData();
    const currentRep = reportList.find((r) => r.id === selectedReport);
    exportTableToExcel(data, `Report_${selectedReport}_${currentRep?.title.slice(3, 20)}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentReportObj = reportList.find((r) => r.id === selectedReport);
  const previewData = getReportData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#1687E8]" />
            <span>ศูนย์รายงานทางการเงินและบัญชี 16 ชุด (Financial Reports)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ส่งออกรายงานตามมาตรฐานระเบียบการเงินการคลังภาครัฐ รองรับไฟล์ Excel (.xlsx) และรูปแบบสั่งพิมพ์ A4
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel (.xlsx)</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
          >
            <Printer className="w-4 h-4 text-[#08A7A4]" />
            <span>พิมพ์รายงาน (Print A4)</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: 16 Reports List */}
        <div className="card-soft p-4 space-y-1 max-h-[600px] overflow-y-auto no-print">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-2">
            เลือกชุดรายงาน (16 Reports)
          </div>
          {reportList.map((r) => {
            const Icon = r.icon;
            const isSelected = selectedReport === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedReport(r.id)}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-medium transition-all flex items-center space-x-2.5 ${
                  isSelected
                    ? 'bg-[#08294F] text-white shadow-md font-bold'
                    : 'text-gray-700 hover:bg-blue-50'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#08A7A4]' : 'text-gray-400'}`} />
                <span className="truncate">{r.title}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Printable Report Preview Area */}
        <div className="card-soft p-6 lg:col-span-3 printable-area">
          {/* Official Report Header */}
          <div className="text-center pb-6 border-b border-gray-200">
            <div className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              โรงพยาบาลศูนย์ • กระทรวงสาธารณสุข
            </div>
            <h3 className="text-lg font-bold text-[#08294F] mt-1">
              {currentReportObj?.title}
            </h3>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-center space-x-4">
              <span>ประจำปีงบประมาณ: พ.ศ. {fiscalYear}</span>
              <span>•</span>
              <span>ข้อมูล ณ วันที่: {formatThaiDate(new Date())}</span>
            </div>
          </div>

          {/* Table Preview */}
          <div className="mt-6 overflow-x-auto">
            {previewData.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs">
                ไม่มีข้อมูลในรายงานนี้
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-[#08294F] text-white">
                  <tr>
                    {Object.keys(previewData[0]).map((col) => (
                      <th key={col} className="py-2.5 px-3 font-semibold text-[11px]">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {previewData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      {Object.values(row).map((val: any, valIdx) => (
                        <td key={valIdx} className="py-2.5 px-3 text-[11px] text-gray-700">
                          {typeof val === 'number' ? formatThaiCurrency(val) : String(val ?? '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Signature Footer for Print */}
          <div className="mt-16 pt-8 border-t border-gray-200 grid grid-cols-2 text-center text-xs">
            <div>
              <div className="h-12"></div>
              <div className="font-bold text-gray-800">ลงชื่อ..........................................................</div>
              <div className="text-gray-500 mt-1">(นางสาวดาริกา พัฒนศิลป์)</div>
              <div className="text-gray-400 text-[11px]">เจ้าหน้าที่การเงินและบัญชีผู้จัดทำ</div>
            </div>
            <div>
              <div className="h-12"></div>
              <div className="font-bold text-gray-800">ลงชื่อ..........................................................</div>
              <div className="text-gray-500 mt-1">(นพ. ชวลิต การเงินมั่นคง)</div>
              <div className="text-gray-400 text-[11px]">รองผู้อำนวยการฝ่ายการเงินและแผนงาน (CFO)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

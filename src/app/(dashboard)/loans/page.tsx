'use client';

import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  FileText,
  User,
  Calendar,
  Layers,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function LoansPage() {
  const [loans, setLoans] = useState<any[]>([]);
  const [clearances, setClearances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null);
  const [showClearanceModal, setShowClearanceModal] = useState(false);

  // Add Form
  const [borrowerName, setBorrowerName] = useState('');
  const [borrowerCode, setBorrowerCode] = useState('');
  const [departmentName, setDepartmentName] = useState('กลุ่มงานศัลยกรรม');
  const [purpose, setPurpose] = useState('');
  const [requestDate, setRequestDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');

  // Clearance Form
  const [expenseAmount, setExpenseAmount] = useState('');
  const [cashReturn, setCashReturn] = useState('');
  const [additionalPayment, setAdditionalPayment] = useState('');
  const [docRef, setDocRef] = useState('');
  const [clearanceNotes, setClearanceNotes] = useState('');

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/loans');
      const json = await res.json();
      if (json.success) {
        setLoans(json.data.loans);
        setClearances(json.data.clearances || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleCreateLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          borrowerName,
          borrowerCode,
          departmentName,
          purpose,
          requestDate,
          dueDate,
          amount,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchLoans();
        setBorrowerName('');
        setBorrowerCode('');
        setPurpose('');
        setAmount('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApprove = async (loanId: string, action: 'APPROVE' | 'DISBURSE') => {
    try {
      const res = await fetch(`/api/loans/${loanId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (json.success) {
        fetchLoans();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleClearance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLoan) return;

    try {
      const res = await fetch(`/api/loans/${selectedLoan.id}/clearance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expenseAmount,
          cashReturn,
          additionalPayment,
          documentReference: docRef,
          notes: clearanceNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowClearanceModal(false);
        fetchLoans();
        setExpenseAmount('');
        setCashReturn('');
        setAdditionalPayment('');
        setDocRef('');
        setClearanceNotes('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = loans.filter((l) => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (
      search &&
      !l.borrowerName.toLowerCase().includes(search.toLowerCase()) &&
      !l.loanNo.toLowerCase().includes(search.toLowerCase()) &&
      !l.purpose.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalOutstanding = loans
    .filter((l) => l.status === 'OUTSTANDING' || l.status === 'PAID')
    .reduce((sum, l) => sum + l.balance, 0);

  const totalOverdue = loans
    .filter((l) => (l.status === 'OUTSTANDING' || l.status === 'PAID') && l.aging?.daysOverdue > 0)
    .reduce((sum, l) => sum + l.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบบริหารเงินยืมราชการ (Government Loan & Clearance)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            สัญญายืมเงินทดรองราชการ ตรวจสอบวันครบกำหนดส่งใช้ และการล้างเงินยืมตามระเบียบพัสดุและการเงิน
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>ขอยืมเงินราชการ (Create Loan)</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-soft p-5 border-l-4 border-l-[#1687E8]">
          <span className="text-xs text-gray-500 font-semibold block">เงินยืมราชการคงค้างทั้งหมด</span>
          <div className="text-2xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(totalOutstanding)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            อยู่ระหว่างนำไปปฏิบัติงาน / เตรียมส่งใช้
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-[#FF4664]">
          <span className="text-xs text-[#FF4664] font-bold block">เงินยืมเกินกำหนด 30 วัน</span>
          <div className="text-2xl font-bold text-[#FF4664] mt-1">
            {formatThaiCurrency(totalOverdue)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-[#FF4664] font-medium mt-1">
            ต้องส่งหนังสือทวงถามตามระเบียบ
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-emerald-500">
          <span className="text-xs text-gray-500 font-semibold block">ล้างเงินยืมสำเร็จ (Cleared)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {formatThaiCurrency(
              loans.filter((l) => l.status === 'CLEARED').reduce((sum, l) => sum + l.amount, 0)
            )}{' '}
            <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            คืนเงินและส่งหลักฐานครบถ้วน
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card-soft p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-80 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อผู้ยืม, เลขที่ LN, วัตถุประสงค์..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุกสถานะ (All Status)</option>
            <option value="SUBMITTED">รออนุมัติ (SUBMITTED)</option>
            <option value="APPROVED">อนุมัติแล้ว (APPROVED)</option>
            <option value="OUTSTANDING">ค้างส่งใช้ (OUTSTANDING)</option>
            <option value="CLEARED">ล้างเสร็จสิ้น (CLEARED)</option>
          </select>
        </div>
      </div>

      {/* Loans Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่สัญญา</th>
                <th className="py-3.5 px-4 font-semibold">ผู้ขอยืมเงิน / สังกัด</th>
                <th className="py-3.5 px-4 font-semibold">วัตถุประสงค์การยืม</th>
                <th className="py-3.5 px-4 font-semibold">วันที่ยืม</th>
                <th className="py-3.5 px-4 font-semibold">กำหนดส่งใช้</th>
                <th className="py-3.5 px-4 font-semibold text-center">อายุสัญญา</th>
                <th className="py-3.5 px-4 font-semibold text-right">วงเงินยืม (บาท)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดคงค้าง</th>
                <th className="py-3.5 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-gray-400">
                    ไม่พบข้อมูลสัญญายืมเงินราชการ
                  </td>
                </tr>
              ) : (
                filtered.map((l) => {
                  const isCleared = l.status === 'CLEARED';
                  const isOutstanding = l.status === 'OUTSTANDING';
                  const isSubmitted = l.status === 'SUBMITTED';
                  const isApproved = l.status === 'APPROVED';
                  const isOverdue = isOutstanding && l.aging?.daysOverdue > 0;

                  return (
                    <tr key={l.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                        {l.loanNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#08294F]">{l.borrowerName}</div>
                        <div className="text-[10px] text-gray-500 font-medium">{l.departmentName}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 max-w-xs truncate">
                        {l.purpose}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(l.requestDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(l.dueDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isOverdue
                              ? 'bg-red-50 text-[#FF4664] border border-red-200'
                              : 'bg-blue-50 text-[#1687E8] border border-blue-200'
                          }`}
                        >
                          {l.aging?.label || '-'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-gray-700">
                        {formatThaiCurrency(l.amount)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                          isCleared ? 'text-emerald-600' : isOverdue ? 'text-[#FF4664]' : 'text-[#08294F]'
                        }`}
                      >
                        {formatThaiCurrency(l.balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isCleared
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isOverdue
                              ? 'bg-red-50 text-[#FF4664] border border-red-200'
                              : isSubmitted
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-[#1687E8] border border-blue-200'
                          }`}
                        >
                          {l.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {isSubmitted && (
                            <button
                              onClick={() => handleApprove(l.id, 'APPROVE')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>อนุมัติ</span>
                            </button>
                          )}
                          {isApproved && (
                            <button
                              onClick={() => handleApprove(l.id, 'DISBURSE')}
                              className="px-2.5 py-1 rounded-lg bg-[#08294F] hover:bg-[#0D3768] text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1"
                            >
                              <CreditCard className="w-3 h-3 text-[#08A7A4]" />
                              <span>จ่ายเงินยืม</span>
                            </button>
                          )}
                          {isOutstanding && (
                            <button
                              onClick={() => {
                                setSelectedLoan(l);
                                setExpenseAmount(l.balance.toString());
                                setShowClearanceModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#08A7A4] hover:bg-[#068684] text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1"
                            >
                              <FileCheck2 className="w-3 h-3" />
                              <span>ล้างเงินยืม</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>สร้างสัญญายืมเงินทดรองราชการ (Create Loan)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกคำขอยืมเงินราชการสำหรับการปฏิบัติงาน โครงการ หรือไปราชการ
            </p>

            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ชื่อ-สกุล ผู้ขอยืม
                  </label>
                  <input
                    type="text"
                    required
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="เช่น นพ. วีรชัย กิตติวิทยา"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    รหัสบุคลากร / เจ้าหน้าที่
                  </label>
                  <input
                    type="text"
                    value={borrowerCode}
                    onChange={(e) => setBorrowerCode(e.target.value)}
                    placeholder="เช่น EMP-0142"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  กลุ่มงาน / สังกัด
                </label>
                <select
                  value={departmentName}
                  onChange={(e) => setDepartmentName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                >
                  <option value="กลุ่มงานศัลยกรรม">กลุ่มงานศัลยกรรม</option>
                  <option value="กลุ่มงานผู้ป่วยวิกฤต (ICU)">กลุ่มงานผู้ป่วยวิกฤต (ICU)</option>
                  <option value="กลุ่มงานเภสัชกรรม">กลุ่มงานเภสัชกรรม</option>
                  <option value="กลุ่มงานอายุรกรรม">กลุ่มงานอายุรกรรม</option>
                  <option value="กลุ่มงานการเงินและบัญชี">กลุ่มงานการเงินและบัญชี</option>
                  <option value="กลุ่มงานบริหารทั่วไป">กลุ่มงานบริหารทั่วไป</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  วัตถุประสงค์การยืมเงิน
                </label>
                <textarea
                  required
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="เช่น ยืมเงินทดรองราชการเพื่อจัดอบรมเชิงปฏิบัติการ..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    จำนวนเงินขอยืม (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันครบกำหนดส่งใช้ (ภายใน 30 วัน)
                  </label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
                >
                  ส่งคำขอยืมเงิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Clearance Modal */}
      {showClearanceModal && selectedLoan && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <FileCheck2 className="w-5 h-5 text-[#08A7A4]" />
              <span>ล้างเงินยืมราชการ (Clearance Form)</span>
            </h3>
            <div className="p-3 bg-blue-50 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-[#08294F]">
                ผู้ยืม: {selectedLoan.borrowerName} (สัญญา {selectedLoan.loanNo})
              </div>
              <div className="text-gray-600">
                ยอดเงินยืมคงค้าง: <span className="font-bold text-[#08294F]">{formatThaiCurrency(selectedLoan.balance)} บาท</span>
              </div>
            </div>

            <form onSubmit={handleClearance} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ยอดเอกสารใบเสร็จเบิกจ่าย (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ยอดเงินสดส่งคืนคลัง (บาท)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={cashReturn}
                    onChange={(e) => setCashReturn(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เอกสารหลักฐานอ้างอิง
                </label>
                <input
                  type="text"
                  required
                  value={docRef}
                  onChange={(e) => setDocRef(e.target.value)}
                  placeholder="เช่น ใบเสร็จรับเงินค่าที่พัก ค่าวิทยากร รวม 5 ฉบับ"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  หมายเหตุการล้างเงินยืม
                </label>
                <textarea
                  rows={2}
                  value={clearanceNotes}
                  onChange={(e) => setClearanceNotes(e.target.value)}
                  placeholder="ระบุข้อความประกอบการล้างเงินยืม..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowClearanceModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
                >
                  บันทึกการล้างเงินยืม (Issue CL)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

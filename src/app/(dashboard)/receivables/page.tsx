'use client';

import React, { useState, useEffect } from 'react';
import {
  Receipt,
  PlusCircle,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Download,
  CreditCard,
  FileText,
  Printer,
  X,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function ReceivablesPage() {
  const [receivables, setReceivables] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReceivable, setSelectedReceivable] = useState<any | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);

  // Add form state
  const [debtorName, setDebtorName] = useState('');
  const [documentNo, setDocumentNo] = useState('');
  const [category, setCategory] = useState('UC');
  const [billDate, setBillDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Pay form state
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState('');
  const [refNo, setRefNo] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      const [resRec, resAcc] = await Promise.all([
        fetch('/api/receivables'),
        fetch('/api/cash-bank/accounts'),
      ]);
      const jsonRec = await resRec.json();
      const jsonAcc = await resAcc.json();

      if (jsonRec.success) setReceivables(jsonRec.data.receivables);
      if (jsonAcc.success) {
        setAccounts(jsonAcc.data.accounts);
        if (jsonAcc.data.accounts.length > 0) {
          setBankAccountId(jsonAcc.data.accounts[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  const handleCreateReceivable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/receivables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          debtorName,
          documentNo,
          category,
          billDate,
          dueDate,
          amount,
          description,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchReceivables();
        setDebtorName('');
        setDocumentNo('');
        setAmount('');
        setDescription('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePayReceivable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReceivable) return;

    try {
      const res = await fetch(`/api/receivables/${selectedReceivable.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payAmount,
          paymentDate: payDate,
          bankAccountId,
          referenceNo: refNo,
          notes: payNotes,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setLastReceipt({
          receiptNo: json.data.receiptNo,
          receivable: selectedReceivable,
          amount: parseFloat(payAmount),
          date: payDate,
        });
        setShowPayModal(false);
        setShowReceiptModal(true);
        fetchReceivables();
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = receivables.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;
    if (
      search &&
      !r.debtorName.toLowerCase().includes(search.toLowerCase()) &&
      !r.receivableNo.toLowerCase().includes(search.toLowerCase()) &&
      !r.documentNo?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalOutstanding = receivables
    .filter((r) => r.status !== 'PAID' && r.status !== 'WRITEOFF')
    .reduce((sum, r) => sum + r.balance, 0);

  const totalOverdue = receivables
    .filter((r) => r.status === 'OVERDUE')
    .reduce((sum, r) => sum + r.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบบริหารลูกหนี้ (Accounts Receivable - AR)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ทะเบียนลูกหนี้ค่ารักษาพยาบาล สปสช. ประกันสังคม ข้าราชการ พร้อมระบบคำนวณอายุหนี้ Aging อัตโนมัติ
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>ตั้งลูกหนี้ใหม่ (Create AR)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-soft p-5 border-l-4 border-l-[#1687E8]">
          <span className="text-xs text-gray-500 font-semibold block">ลูกหนี้คงค้างทั้งหมด (Total AR)</span>
          <div className="text-2xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(totalOutstanding)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            คิดเป็น {receivables.filter((r) => r.status !== 'PAID').length} รายการ
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-[#FF4664]">
          <span className="text-xs text-[#FF4664] font-bold block">ลูกหนี้เกินกำหนดชำระ (Overdue)</span>
          <div className="text-2xl font-bold text-[#FF4664] mt-1">
            {formatThaiCurrency(totalOverdue)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-[#FF4664] font-medium mt-1">
            เกินกำหนด {receivables.filter((r) => r.status === 'OVERDUE').length} รายการ (Aging 1-90+ วัน)
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-emerald-500">
          <span className="text-xs text-gray-500 font-semibold block">รับชำระแล้วเสร็จ (Paid)</span>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {formatThaiCurrency(
              receivables.filter((r) => r.status === 'PAID').reduce((sum, r) => sum + r.paidAmount, 0)
            )}{' '}
            <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            ออกใบเสร็จรับเงิน (RC) เรียบร้อย
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-soft p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-80 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อลูกหนี้, เลขที่ AR, เอกสารอ้างอิง..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุกกลุ่มสิทธิ (All Categories)</option>
            <option value="UC">สปสช. (UC)</option>
            <option value="SSS">ประกันสังคม (SSS)</option>
            <option value="CSMBS">สวัสดิการข้าราชการ (CSMBS)</option>
            <option value="PRIVATE">ประกันเอกชน (Private)</option>
            <option value="OTHER">อื่นๆ (Other)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุกสถานะ (All Status)</option>
            <option value="OPEN">ยังไม่ชำระ (OPEN)</option>
            <option value="OVERDUE">เกินกำหนด (OVERDUE)</option>
            <option value="PARTIAL">ชำระบางส่วน (PARTIAL)</option>
            <option value="PAID">ชำระครบแล้ว (PAID)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่ AR</th>
                <th className="py-3.5 px-4 font-semibold">ชื่อลูกหนี้ / สิทธิ</th>
                <th className="py-3.5 px-4 font-semibold">เอกสารอ้างอิง</th>
                <th className="py-3.5 px-4 font-semibold">วันที่ตั้งหนี้</th>
                <th className="py-3.5 px-4 font-semibold">ครบกำหนด</th>
                <th className="py-3.5 px-4 font-semibold text-center">อายุหนี้ (Aging)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดหนี้ (บาท)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดคงค้าง</th>
                <th className="py-3.5 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-gray-400">
                    ไม่พบข้อมูลลูกหนี้ตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const isOverdue = r.status === 'OVERDUE';
                  const isPaid = r.status === 'PAID';

                  return (
                    <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                        {r.receivableNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#08294F]">{r.debtorName}</div>
                        <span className="text-[10px] text-gray-500 font-medium">
                          หมวด: {r.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                        {r.documentNo || '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(r.billDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(r.dueDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.aging?.daysOverdue > 0
                              ? 'bg-red-50 text-[#FF4664] border border-red-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {r.aging?.label || (isPaid ? 'ชำระแล้ว' : 'ปกติ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-gray-700">
                        {formatThaiCurrency(r.amount)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                          isPaid ? 'text-emerald-600' : isOverdue ? 'text-[#FF4664]' : 'text-[#08294F]'
                        }`}
                      >
                        {formatThaiCurrency(r.balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isOverdue
                              ? 'bg-red-50 text-[#FF4664] border border-red-200'
                              : 'bg-blue-50 text-[#1687E8] border border-blue-200'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {!isPaid && (
                          <button
                            onClick={() => {
                              setSelectedReceivable(r);
                              setPayAmount(r.balance.toString());
                              setShowPayModal(true);
                            }}
                            className="px-3 py-1 rounded-lg bg-[#08294F] hover:bg-[#0D3768] text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1 mx-auto"
                          >
                            <CreditCard className="w-3 h-3 text-[#08A7A4]" />
                            <span>รับเงิน</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Receivable Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>ตั้งลูกหนี้ใหม่ (Accounts Receivable)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกรายการลูกหนี้ค่ารักษาพยาบาลเพื่อติดตามทวงถามและคำนวณอายุหนี้
            </p>

            <form onSubmit={handleCreateReceivable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ชื่อลูกหนี้ / สิทธิการรักษา
                </label>
                <input
                  type="text"
                  required
                  value={debtorName}
                  onChange={(e) => setDebtorName(e.target.value)}
                  placeholder="เช่น สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    กลุ่มสิทธิ
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="UC">UC - หลักประกันสุขภาพถ้วนหน้า</option>
                    <option value="SSS">SSS - ประกันสังคม</option>
                    <option value="CSMBS">CSMBS - สวัสดิการข้าราชการ</option>
                    <option value="PRIVATE">PRIVATE - ประกันเอกชน</option>
                    <option value="OTHER">OTHER - ผู้ป่วยทั่วไป/อื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เลขที่เอกสารอ้างอิง
                  </label>
                  <input
                    type="text"
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target.value)}
                    placeholder="เช่น NHSO-IPD-2569-09"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันที่ตั้งหนี้ (Bill Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={billDate}
                    onChange={(e) => setBillDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันครบกำหนดชำระ (Due Date)
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  จำนวนเงินลูกหนี้ (บาท)
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
                  รายละเอียดเพิ่มเติม
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น ค่ารักษาพยาบาลผู้ป่วยในประจำเดือน..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
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
                  บันทึกตั้งลูกหนี้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Receivable Modal */}
      {showPayModal && selectedReceivable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-[#08A7A4]" />
              <span>บันทึกรับชำระเงินลูกหนี้</span>
            </h3>
            <div className="p-3 bg-blue-50 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-[#08294F]">
                {selectedReceivable.debtorName} ({selectedReceivable.receivableNo})
              </div>
              <div className="text-gray-600">
                ยอดคงค้าง: <span className="font-bold text-[#08294F]">{formatThaiCurrency(selectedReceivable.balance)} บาท</span>
              </div>
            </div>

            <form onSubmit={handlePayReceivable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  จำนวนเงินที่รับชำระ (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เข้าบัญชีธนาคาร
                </label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันที่รับเงิน
                  </label>
                  <input
                    type="date"
                    required
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เลขอ้างอิงการโอน
                  </label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="เช่น TRF-88912"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowPayModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
                >
                  ออกใบเสร็จรับเงิน (Issue RC)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Output Modal */}
      {showReceiptModal && lastReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>บันทึกรับเงินและออกใบเสร็จเรียบร้อย</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Receipt Card */}
            <div className="my-5 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3 font-sans">
              <div className="text-center pb-3 border-b border-gray-200">
                <div className="font-bold text-sm text-[#08294F]">ใบเสร็จรับเงิน / ใบสำคัญรับเงิน</div>
                <div className="text-xs text-gray-500">โรงพยาบาลศูนย์ • กระทรวงสาธารณสุข</div>
                <div className="text-xs font-mono font-bold text-[#1687E8] mt-1">
                  เลขที่: {lastReceipt.receiptNo}
                </div>
              </div>

              <div className="text-xs space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">ได้รับเงินจาก:</span>
                  <span className="font-bold">{lastReceipt.receivable.debtorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">ชำระค่า:</span>
                  <span>{lastReceipt.receivable.description || 'ค่ารักษาพยาบาล'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">อ้างอิงเอกสาร AR:</span>
                  <span className="font-mono">{lastReceipt.receivable.receivableNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่รับเงิน:</span>
                  <span>{formatThaiDate(lastReceipt.date)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
                  <span className="font-bold text-[#08294F]">จำนวนเงินรับชำระ:</span>
                  <span className="font-bold font-mono text-emerald-600">
                    {formatThaiCurrency(lastReceipt.amount)} บาท
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 flex items-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>พิมพ์ใบเสร็จ (A4)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768]"
              >
                เสร็จสิ้น
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

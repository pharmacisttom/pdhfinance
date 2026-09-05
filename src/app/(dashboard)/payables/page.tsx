'use client';

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck2,
  Printer,
  X,
  Building,
  ShieldCheck,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function PayablesPage() {
  const [payables, setPayables] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPayable, setSelectedPayable] = useState<any | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [lastVoucher, setLastVoucher] = useState<any | null>(null);

  // Add form
  const [vendorName, setVendorName] = useState('');
  const [documentNo, setDocumentNo] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  // Pay form
  const [payAmount, setPayAmount] = useState('');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [bankAccountId, setBankAccountId] = useState('');
  const [refNo, setRefNo] = useState('');

  const fetchPayables = async () => {
    try {
      setLoading(true);
      const [resPay, resAcc] = await Promise.all([
        fetch('/api/payables'),
        fetch('/api/cash-bank/accounts'),
      ]);
      const jsonPay = await resPay.json();
      const jsonAcc = await resAcc.json();

      if (jsonPay.success) setPayables(jsonPay.data.payables);
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
    fetchPayables();
  }, []);

  const handleCreatePayable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/payables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vendorName,
          documentNo,
          invoiceNo,
          invoiceDate,
          dueDate,
          amount,
          description,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchPayables();
        setVendorName('');
        setInvoiceNo('');
        setAmount('');
        setDescription('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApprove = async (payableId: string) => {
    if (!confirm('คุณต้องการอนุมัติตั้งเบิกจ่ายรายการเจ้าหนี้นี้ใช่หรือไม่?')) return;
    try {
      const res = await fetch(`/api/payables/${payableId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'APPROVE', comment: 'อนุมัติตั้งจ่ายตามระเบียบ' }),
      });
      const json = await res.json();
      if (json.success) {
        fetchPayables();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayable) return;

    try {
      const res = await fetch(`/api/payables/${selectedPayable.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payAmount,
          paymentDate: payDate,
          bankAccountId,
          referenceNo: refNo,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setLastVoucher({
          paymentVoucherNo: json.data.paymentVoucherNo,
          payable: selectedPayable,
          amount: parseFloat(payAmount),
          date: payDate,
        });
        setShowPayModal(false);
        setShowVoucherModal(true);
        fetchPayables();
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = payables.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (
      search &&
      !p.vendorName.toLowerCase().includes(search.toLowerCase()) &&
      !p.payableNo.toLowerCase().includes(search.toLowerCase()) &&
      !p.invoiceNo.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const totalOutstanding = payables
    .filter((p) => p.status !== 'PAID')
    .reduce((sum, p) => sum + p.balance, 0);

  const totalOverdue = payables
    .filter((p) => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.balance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบบริหารเจ้าหนี้ (Accounts Payable - AP)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            บริหารเจ้าหนี้การค้า ค่ายา เวชภัณฑ์ ครุภัณฑ์ ตรวจสอบความถูกต้องและอนุมัติจ่ายเงินตามกำหนด
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>บันทึกตั้งเจ้าหนี้ (Create AP)</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-soft p-5 border-l-4 border-l-[#1687E8]">
          <span className="text-xs text-gray-500 font-semibold block">ยอดเจ้าหนี้คงค้างทั้งหมด</span>
          <div className="text-2xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(totalOutstanding)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-1">
            จำนวน {payables.filter((p) => p.status !== 'PAID').length} รายการ
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-amber-500">
          <span className="text-xs text-amber-700 font-bold block">รออนุมัติตั้งจ่าย (Waiting Approval)</span>
          <div className="text-2xl font-bold text-amber-700 mt-1">
            {formatThaiCurrency(
              payables
                .filter((p) => p.status === 'WAITING_APPROVAL')
                .reduce((sum, p) => sum + p.balance, 0)
            )}{' '}
            <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            รอ CFO ตรวจสอบและลงนาม
          </div>
        </div>

        <div className="card-soft p-5 border-l-4 border-l-[#FF4664]">
          <span className="text-xs text-[#FF4664] font-bold block">เจ้าหนี้เกินกำหนดชำระ (Overdue)</span>
          <div className="text-2xl font-bold text-[#FF4664] mt-1">
            {formatThaiCurrency(totalOverdue)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-[#FF4664] font-medium mt-1">
            ต้องเร่งรัดกระบวนการเบิกจ่าย
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
            placeholder="ค้นหาชื่อบริษัทคู่ค้า, เลขที่ AP, เลขที่ใบกำกับ..."
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
            <option value="WAITING_APPROVAL">รออนุมัติ (WAITING_APPROVAL)</option>
            <option value="READY_TO_PAY">พร้อมจ่าย (READY_TO_PAY)</option>
            <option value="OVERDUE">เกินกำหนด (OVERDUE)</option>
            <option value="PAID">จ่ายแล้ว (PAID)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่ AP</th>
                <th className="py-3.5 px-4 font-semibold">ชื่อบริษัทคู่ค้า / เจ้าหนี้</th>
                <th className="py-3.5 px-4 font-semibold">ใบแจ้งหนี้ / PO</th>
                <th className="py-3.5 px-4 font-semibold">วันที่แจ้งหนี้</th>
                <th className="py-3.5 px-4 font-semibold">ครบกำหนด</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดเงิน (บาท)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดคงเหลือ</th>
                <th className="py-3.5 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400">
                    ไม่พบข้อมูลเจ้าหนี้ตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isPaid = p.status === 'PAID';
                  const isWaitingApproval = p.status === 'WAITING_APPROVAL';
                  const isReadyToPay = p.status === 'READY_TO_PAY';
                  const isOverdue = p.status === 'OVERDUE';

                  return (
                    <tr key={p.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                        {p.payableNo}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#08294F]">{p.vendorName}</div>
                        <span className="text-[10px] text-gray-500 line-clamp-1">
                          {p.description}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-gray-700 text-[11px]">
                        <div>{p.invoiceNo}</div>
                        {p.documentNo && (
                          <div className="text-[10px] text-gray-400">{p.documentNo}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(p.invoiceDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(p.dueDate, { shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-gray-700">
                        {formatThaiCurrency(p.amount)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                          isPaid ? 'text-emerald-600' : isOverdue ? 'text-[#FF4664]' : 'text-[#08294F]'
                        }`}
                      >
                        {formatThaiCurrency(p.balance)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isPaid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : isOverdue
                              ? 'bg-red-50 text-[#FF4664] border border-red-200'
                              : isWaitingApproval
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-blue-50 text-[#1687E8] border border-blue-200'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center space-x-1.5">
                          {isWaitingApproval && (
                            <button
                              onClick={() => handleApprove(p.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>อนุมัติ</span>
                            </button>
                          )}
                          {(isReadyToPay || isOverdue) && (
                            <button
                              onClick={() => {
                                setSelectedPayable(p);
                                setPayAmount(p.balance.toString());
                                setShowPayModal(true);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-[#08294F] hover:bg-[#0D3768] text-white text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1"
                            >
                              <CreditCard className="w-3 h-3 text-pink-300" />
                              <span>จ่ายเงิน</span>
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>บันทึกตั้งเจ้าหนี้ใหม่ (Accounts Payable)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกรายการหนี้สินทางการค้า ค่ายา เวชภัณฑ์ และบริการ
            </p>

            <form onSubmit={handleCreatePayable} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ชื่อบริษัทคู่ค้า / เจ้าหนี้
                </label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="เช่น บริษัท สยามเภสัชเวชภัณฑ์ จำกัด"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เลขที่ใบแจ้งหนี้ / ใบกำกับภาษี
                  </label>
                  <input
                    type="text"
                    required
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    placeholder="เช่น INV-2026-981"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เลขที่ใบสั่งซื้อ (PO)
                  </label>
                  <input
                    type="text"
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target.value)}
                    placeholder="เช่น PO-69-0412"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันที่ใบแจ้งหนี้
                  </label>
                  <input
                    type="date"
                    required
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
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
                  จำนวนเงิน (บาท)
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
                  รายการ / วัตถุประสงค์
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น จัดซื้อยาปฏิชีวนะประจำคลังยา..."
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
                  บันทึกตั้งเจ้าหนี้
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {showPayModal && selectedPayable && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-pink-500" />
              <span>ออกใบสำคัญจ่าย (Payment Voucher)</span>
            </h3>
            <div className="p-3 bg-blue-50 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-[#08294F]">
                {selectedPayable.vendorName} ({selectedPayable.payableNo})
              </div>
              <div className="text-gray-600">
                ยอดที่ต้องจ่าย: <span className="font-bold text-[#08294F]">{formatThaiCurrency(selectedPayable.balance)} บาท</span>
              </div>
            </div>

            <form onSubmit={handlePay} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  จำนวนเงินจ่ายชำระ (บาท)
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
                  ตัดจ่ายจากบัญชีธนาคาร
                </label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountName} (คงเหลือ: {formatThaiCurrency(acc.currentBalance)} บ.)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันที่ทำรายการจ่าย
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
                    เลขอ้างอิงเช็ค/โอน
                  </label>
                  <input
                    type="text"
                    value={refNo}
                    onChange={(e) => setRefNo(e.target.value)}
                    placeholder="เช่น KTB-PAY-11029"
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
                  ยืนยันจ่ายเงินและออกใบสำคัญจ่าย (PV)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Voucher Output Modal */}
      {showVoucherModal && lastVoucher && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center space-x-2 text-emerald-600 font-bold text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>ออกใบสำคัญจ่ายเงินเรียบร้อย</span>
              </div>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3 font-sans">
              <div className="text-center pb-3 border-b border-gray-200">
                <div className="flex items-center justify-center space-x-2.5 mb-1.5">
                  <img
                    src="/img/pdh.png"
                    alt="PDH Logo"
                    className="w-8 h-8 object-contain"
                  />
                  <div className="text-left">
                    <div className="font-bold text-sm text-[#08294F]">ใบสำคัญจ่ายเงิน (Payment Voucher)</div>
                    <div className="text-[11px] text-gray-500">โรงพยาบาลปลวกแดง • กลุ่มงานการเงินและบัญชี</div>
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-[#1687E8] mt-1">
                  เลขที่ PV: {lastVoucher.paymentVoucherNo}
                </div>
              </div>

              <div className="text-xs space-y-1 text-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">จ่ายให้แก่:</span>
                  <span className="font-bold">{lastVoucher.payable.vendorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">อ้างอิงใบแจ้งหนี้:</span>
                  <span>{lastVoucher.payable.invoiceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">อ้างอิงเอกสาร AP:</span>
                  <span className="font-mono">{lastVoucher.payable.payableNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">วันที่ตัดจ่าย:</span>
                  <span>{formatThaiDate(lastVoucher.date)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 text-sm">
                  <span className="font-bold text-[#08294F]">จำนวนเงินสุทธิ:</span>
                  <span className="font-bold font-mono text-[#FF4664]">
                    {formatThaiCurrency(lastVoucher.amount)} บาท
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
                <span>พิมพ์ใบสำคัญจ่าย (A4)</span>
              </button>
              <button
                type="button"
                onClick={() => setShowVoucherModal(false)}
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

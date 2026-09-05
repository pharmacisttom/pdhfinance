'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  FileSpreadsheet,
  Download,
  Calendar,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function BankTransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [bankAccountId, setBankAccountId] = useState('');
  const [transactionType, setTransactionType] = useState('INCOME');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [referenceNo, setReferenceNo] = useState('');

  const fetchTx = async () => {
    try {
      setLoading(true);
      const [resTx, resAcc] = await Promise.all([
        fetch('/api/cash-bank/transactions'),
        fetch('/api/cash-bank/accounts'),
      ]);
      const jsonTx = await resTx.json();
      const jsonAcc = await resAcc.json();

      if (jsonTx.success) setTransactions(jsonTx.data.transactions);
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
    fetchTx();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cash-bank/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankAccountId,
          transactionType,
          description,
          amount,
          referenceNo,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchTx();
        setDescription('');
        setAmount('');
        setReferenceNo('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = transactions.filter((t) => {
    if (filterType !== 'ALL' && t.transactionType !== filterType) return false;
    if (
      searchTerm &&
      !t.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.documentNo?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !t.referenceNo?.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#1687E8]" />
            <span>รายการเคลื่อนไหวทางธนาคาร (Bank Transactions)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            บันทึกรายการรับ-จ่าย-โอนเงินผ่านบัญชีธนาคารพร้อมเลขอ้างอิงและ Audit Log
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>บันทึกรายการเคลื่อนไหว</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-soft p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 w-full md:w-80 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหารายละเอียด, เลขที่เอกสาร, REF..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'ALL' ? 'bg-white shadow text-[#08294F] font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setFilterType('INCOME')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'INCOME' ? 'bg-emerald-500 text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              เงินเข้า (Income)
            </button>
            <button
              onClick={() => setFilterType('EXPENSE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filterType === 'EXPENSE' ? 'bg-[#FF4664] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              เงินออก (Expense)
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">วัน-เวลา</th>
                <th className="py-3.5 px-4 font-semibold">เลขเอกสาร</th>
                <th className="py-3.5 px-4 font-semibold">ประเภท</th>
                <th className="py-3.5 px-4 font-semibold">รายละเอียดรายการ</th>
                <th className="py-3.5 px-4 font-semibold">เลขอ้างอิง</th>
                <th className="py-3.5 px-4 font-semibold text-right">จำนวนเงิน (บาท)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดคงเหลือหลังทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    ไม่พบรายการเคลื่อนไหวทางธนาคาร
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const isIncome = t.transactionType === 'INCOME';
                  return (
                    <tr key={t.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 text-gray-600 font-medium">
                        {formatThaiDate(t.transactionDate, { showTime: true, shortMonth: true })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                        {t.documentNo || '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isIncome
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-red-50 text-[#FF4664] border border-red-200'
                          }`}
                        >
                          {isIncome ? (
                            <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3 text-[#FF4664]" />
                          )}
                          <span>{isIncome ? 'เงินเข้า' : 'เงินออก'}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium max-w-xs truncate">
                        {t.description}
                      </td>
                      <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                        {t.referenceNo || '-'}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-bold font-mono text-sm ${
                          isIncome ? 'text-emerald-600' : 'text-[#FF4664]'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatThaiCurrency(t.amount)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-gray-700 font-mono">
                        {formatThaiCurrency(t.balanceAfter)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>บันทึกรายการเคลื่อนไหวธนาคาร</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกรายการฝาก-ถอน พร้อมปรับปรุงยอดคงเหลือในบัญชีอัตโนมัติ
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เลือกบัญชีธนาคาร
                </label>
                <select
                  value={bankAccountId}
                  onChange={(e) => setBankAccountId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountName} ({acc.bankCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ประเภทรายการ
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransactionType('INCOME')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      transactionType === 'INCOME'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    + เงินเข้า (Income)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('EXPENSE')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      transactionType === 'EXPENSE'
                        ? 'bg-red-50 border-red-500 text-[#FF4664]'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    - เงินออก (Expense)
                  </button>
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
                  คำอธิบายรายการ
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น รับเงินชดเชยค่ารักษาพยาบาล สปสช."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เลขอ้างอิงธนาคาร (Reference No.)
                </label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  placeholder="เช่น KTB-TRF-12345"
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
                  บันทึกรายการ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

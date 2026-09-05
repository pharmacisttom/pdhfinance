'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  PlusCircle,
  Search,
  Filter,
  ArrowUpRight,
  Wallet,
  Calendar,
  Building,
  PieChart,
  Download,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function RevenuePage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [source, setSource] = useState('UC');
  const [amount, setAmount] = useState('');
  const [revenueDate, setRevenueDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [bankAccountId, setBankAccountId] = useState('');

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      const [resRev, resAcc] = await Promise.all([
        fetch('/api/revenue'),
        fetch('/api/cash-bank/accounts'),
      ]);
      const jsonRev = await resRev.json();
      const jsonAcc = await resAcc.json();

      if (jsonRev.success) {
        setTransactions(jsonRev.data.transactions);
        setTotalRevenue(jsonRev.data.totalRevenue);
      }
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
    fetchRevenue();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source,
          amount,
          revenueDate,
          description,
          bankAccountId,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchRevenue();
        setAmount('');
        setDescription('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = transactions.filter((r) => {
    if (sourceFilter !== 'ALL' && r.source !== sourceFilter) return false;
    if (
      search &&
      !r.description.toLowerCase().includes(search.toLowerCase()) &&
      !r.documentNo?.toLowerCase().includes(search.toLowerCase()) &&
      !r.fundName?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบบันทึกรายได้และเงินบำรุง (Revenue Management)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            บันทึกรายได้จากกองทุนสุขภาพถ้วนหน้า (UC), ประกันสังคม (SSS), สวัสดิการข้าราชการ (CSMBS), เงินบริจาค และเงินบำรุง
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>บันทึกรายได้ใหม่ (Add Revenue)</span>
        </button>
      </div>

      {/* Summary KPI Card */}
      <div className="card-soft p-6 bg-gradient-to-r from-[#08294F] via-[#0D3768] to-[#1687E8] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">
            รายได้สะสมปีงบประมาณ 2569 (Accumulated Revenue)
          </span>
          <div className="text-2xl sm:text-3xl font-bold mt-1">
            {formatThaiCurrency(totalRevenue)} <span className="text-sm font-normal text-blue-200">บาท</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs text-blue-100">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
            {transactions.length} รายการรับเงิน
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 font-medium">
            + บันทึกเข้าบัญชีเงินฝากทันที
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
            placeholder="ค้นหาคำอธิบาย, เลขที่เอกสาร, แหล่งเงิน..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุกแหล่งรายได้ (All Sources)</option>
            <option value="UC">สปสช. (เงินบำรุง UC)</option>
            <option value="SSS">ประกันสังคม (SSS)</option>
            <option value="CSMBS">สวัสดิการข้าราชการ (CSMBS)</option>
            <option value="DONATION">เงินบริจาคพัฒนา รพ.</option>
            <option value="OTHER">รายได้อื่นๆ</option>
          </select>
        </div>
      </div>

      {/* Revenue Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่เอกสาร</th>
                <th className="py-3.5 px-4 font-semibold">วันที่รับเงิน</th>
                <th className="py-3.5 px-4 font-semibold">แหล่งเงิน / กองทุน</th>
                <th className="py-3.5 px-4 font-semibold">รายละเอียดรายการ</th>
                <th className="py-3.5 px-4 font-semibold text-right">จำนวนเงิน (บาท)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-400">
                    ไม่พบรายการรายได้
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                      {r.documentNo || '-'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {formatThaiDate(r.revenueDate, { shortMonth: true })}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#08294F]">{r.fundName}</span>
                      <div className="text-[10px] text-gray-500 font-mono">หมวด: {r.source}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium max-w-md truncate">
                      {r.description}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-emerald-600">
                      +{formatThaiCurrency(r.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Revenue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>บันทึกรายได้ใหม่ (Add Revenue)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกรายรับเข้ากองทุนและปรับปรุงยอดเงินฝากธนาคารอัตโนมัติ
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    แหล่งรายได้
                  </label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="UC">เงินบำรุง รพ. (สปสช. UC)</option>
                    <option value="SSS">กองทุนประกันสังคม (SSS)</option>
                    <option value="CSMBS">กองทุนสวัสดิการข้าราชการ (CSMBS)</option>
                    <option value="DONATION">เงินบริจาคพัฒนา รพ.</option>
                    <option value="OTHER">รายได้ค่ารักษาอื่นๆ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วันที่รับเงิน
                  </label>
                  <input
                    type="date"
                    required
                    value={revenueDate}
                    onChange={(e) => setRevenueDate(e.target.value)}
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
                  นำฝากเข้าบัญชีธนาคาร
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

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  คำอธิบายรายการรับเงิน
                </label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="เช่น รับชดเชยค่าบริการผู้ป่วยใน IPD สปสช. ประจำงวดที่ 12..."
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
                  บันทึกรับเงิน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  UploadCloud,
  ArrowRightLeft,
  RefreshCw,
  Search,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function BankReconciliationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cash-bank/reconciliation');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecData();
  }, []);

  const handleToggleMatch = async (stmtId: string, currentStatus: string) => {
    try {
      const action = currentStatus === 'MATCHED' ? 'UNMATCH' : 'MATCH';
      const res = await fetch('/api/cash-bank/reconciliation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statementId: stmtId, action }),
      });
      const json = await res.json();
      if (json.success) {
        fetchRecData();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูลการกระทบยอด...</div>;
  }

  const { account, systemBalance, statementBalance, difference, statements, unmatchedCount } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-[#1687E8]" />
            <span>การกระทบยอดเงินฝากธนาคาร (Bank Reconciliation)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            นำเข้า Bank Statement จับคู่รายการกับระบบ เปรียบเทียบผลต่างและปรับปรุงยอดบัญชี
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-semibold shadow-xs flex items-center space-x-1.5 cursor-pointer hover:bg-gray-50 transition-all">
            <UploadCloud className="w-4 h-4 text-[#1687E8]" />
            <span>นำเข้า Statement (CSV/Excel)</span>
            <input type="file" className="hidden" onChange={() => alert('นำเข้า Statement จำลองเรียบร้อยแล้ว')} />
          </label>
        </div>
      </div>

      {/* Balance Comparison KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* System Balance */}
        <div className="card-soft p-6 border-l-4 border-l-[#1687E8]">
          <span className="text-xs text-gray-500 font-semibold block">1. ยอดคงเหลือตามระบบบัญชี (System Balance)</span>
          <div className="text-2xl font-bold text-[#08294F] mt-2">
            {formatThaiCurrency(systemBalance)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            คำนวณจากทุกรายการเคลื่อนไหวในระบบ
          </div>
        </div>

        {/* Statement Balance */}
        <div className="card-soft p-6 border-l-4 border-l-[#08A7A4]">
          <span className="text-xs text-gray-500 font-semibold block">2. ยอดตามใบแจ้งยอดธนาคาร (Statement Balance)</span>
          <div className="text-2xl font-bold text-[#08A7A4] mt-2">
            {formatThaiCurrency(statementBalance)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-gray-500 mt-2">
            ยอดเงินล่าสุดจากธนาคารกรุงไทย
          </div>
        </div>

        {/* Difference */}
        <div className={`card-soft p-6 border-l-4 ${difference === 0 ? 'border-l-emerald-500' : 'border-l-[#FF4664]'}`}>
          <span className="text-xs text-gray-500 font-semibold block">3. ผลต่างที่ต้องกระทบยอด (Difference)</span>
          <div className={`text-2xl font-bold mt-2 ${difference === 0 ? 'text-emerald-600' : 'text-[#FF4664]'}`}>
            {formatThaiCurrency(difference)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] mt-2 flex items-center space-x-1">
            {difference === 0 ? (
              <span className="text-emerald-600 font-bold">✓ ยอดตรงกันสมบูรณ์ (Reconciled)</span>
            ) : (
              <span className="text-[#FF4664] font-bold">⚠ มียอดค้างกระทบยอด {unmatchedCount} รายการ</span>
            )}
          </div>
        </div>
      </div>

      {/* Statements Table */}
      <div className="card-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-xs font-bold text-[#08294F]">
            รายการ Bank Statement ที่นำเข้า (บัญชี: {account?.bankName} {account?.accountNumber})
          </div>
          <span className="text-xs text-gray-500 font-medium">
            ทั้งหมด {statements.length} รายการ (ยังไม่จับคู่ {unmatchedCount} รายการ)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">วันที่ Statement</th>
                <th className="py-3.5 px-4 font-semibold">คำอธิบายจากธนาคาร</th>
                <th className="py-3.5 px-4 font-semibold">เลขอ้างอิง</th>
                <th className="py-3.5 px-4 font-semibold text-right">เงินออก (Debit)</th>
                <th className="py-3.5 px-4 font-semibold text-right">เงินเข้า (Credit)</th>
                <th className="py-3.5 px-4 font-semibold text-right">ยอดคงเหลือ Statement</th>
                <th className="py-3.5 px-4 font-semibold text-center">สถานะ</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {statements.map((s: any) => {
                const isMatched = s.status === 'MATCHED';
                return (
                  <tr key={s.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 text-gray-600 font-medium">
                      {formatThaiDate(s.statementDate, { shortMonth: true })}
                    </td>
                    <td className="py-3 px-4 text-gray-800 font-medium max-w-xs truncate">
                      {s.description}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                      {s.referenceNo || '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#FF4664]">
                      {s.debitAmount > 0 ? formatThaiCurrency(s.debitAmount) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-600 font-bold">
                      {s.creditAmount > 0 ? formatThaiCurrency(s.creditAmount) : '-'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-gray-700">
                      {formatThaiCurrency(s.balance)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          isMatched
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isMatched ? '✓ จับคู่แล้ว (MATCHED)' : 'รอจับคู่ (UNMATCHED)'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleMatch(s.id, s.status)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isMatched
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-[#1687E8] text-white hover:bg-[#116DBE]'
                        }`}
                      >
                        {isMatched ? 'ยกเลิกจับคู่' : 'จับคู่ทันที'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  PlusCircle,
  Clock,
  Search,
  Calendar,
  Building,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function CommitmentsPage() {
  const [commitments, setCommitments] = useState<any[]>([]);
  const [breakdown, setBreakdown] = useState<any>({ due7: 0, due15: 0, due30: 0, due60: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [sourceDocument, setSourceDocument] = useState('');
  const [departmentName, setDepartmentName] = useState('กลุ่มงานเภสัชกรรม');
  const [vendorName, setVendorName] = useState('');
  const [amount, setAmount] = useState('');
  const [expectedPaymentDate, setExpectedPaymentDate] = useState('');
  const [description, setDescription] = useState('');

  const fetchCommitments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/commitments');
      const json = await res.json();
      if (json.success) {
        setCommitments(json.data.commitments);
        setBreakdown(json.data.breakdown);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommitments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/commitments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceDocument,
          departmentName,
          vendorName,
          amount,
          expectedPaymentDate,
          description,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchCommitments();
        setSourceDocument('');
        setVendorName('');
        setAmount('');
        setDescription('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = commitments.filter((c) => {
    if (
      search &&
      !c.sourceDocument.toLowerCase().includes(search.toLowerCase()) &&
      !c.commitmentNo.toLowerCase().includes(search.toLowerCase()) &&
      !c.vendorName?.toLowerCase().includes(search.toLowerCase())
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
            <Layers className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบบริหารภาระผูกพันทางการเงิน (Commitment Management)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ติดตามภาระผูกพันล่วงหน้าจากใบสั่งซื้อ สัญญาจ้าง และการตรวจรับ เพื่อวางแผนกระแสเงินสดล่วงหน้า 7, 15, 30, 60 วัน
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>บันทึกภาระผูกพันใหม่</span>
        </button>
      </div>

      {/* 4-Period Cash Flow Impact Grid (7d, 15d, 30d, 60d) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 7 Days */}
        <div className="card-soft p-5 border-t-4 border-t-[#FF4664] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#FF4664] font-bold mb-1">
            <span>ภาระผูกพันใน 7 วัน</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(breakdown.due7)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-[#FF4664] font-medium mt-1">
            ต้องเตรียมเงินสดจ่ายทันที
          </div>
        </div>

        {/* 15 Days */}
        <div className="card-soft p-5 border-t-4 border-t-amber-500 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-700 font-bold mb-1">
            <span>ภาระผูกพันใน 15 วัน</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(breakdown.due15)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">
            รอบเบิกจ่ายกลางเดือน
          </div>
        </div>

        {/* 30 Days */}
        <div className="card-soft p-5 border-t-4 border-t-[#1687E8] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#1687E8] font-bold mb-1">
            <span>ภาระผูกพันใน 30 วัน</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(breakdown.due30)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">
            รอบเบิกจ่ายสิ้นเดือน
          </div>
        </div>

        {/* 60 Days */}
        <div className="card-soft p-5 border-t-4 border-t-[#08A7A4] relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-[#08A7A4] font-bold mb-1">
            <span>ภาระผูกพันใน 60 วัน</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(breakdown.due60)} <span className="text-xs font-normal text-gray-400">บาท</span>
          </div>
          <div className="text-[11px] text-[#08A7A4] font-medium mt-1">
            สัญญาระยะยาว / งวดงาน
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card-soft p-4 flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ค้นหาเลขที่ภาระผูกพัน, ใบสั่งซื้อ (PO), สัญญาจ้าง, บริษัทคู่ค้า..."
          className="w-full bg-transparent text-xs text-gray-700 outline-none"
        />
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">เลขที่ CM</th>
                <th className="py-3.5 px-4 font-semibold">เอกสารต้นทาง (PO/สัญญา/ตรวจรับ)</th>
                <th className="py-3.5 px-4 font-semibold">หน่วยงานผู้เบิก</th>
                <th className="py-3.5 px-4 font-semibold">คู่สัญญา / ผู้รับเงิน</th>
                <th className="py-3.5 px-4 font-semibold">กำหนดจ่ายโดยประมาณ</th>
                <th className="py-3.5 px-4 font-semibold text-right">วงเงินผูกพัน (บาท)</th>
                <th className="py-3.5 px-4 font-semibold text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-400">
                    ไม่พบข้อมูลภาระผูกพัน
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                      {c.commitmentNo}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#08294F]">{c.sourceDocument}</div>
                      <div className="text-[10px] text-gray-500 line-clamp-1">{c.description}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {c.departmentName}
                    </td>
                    <td className="py-3 px-4 text-gray-700 font-medium">
                      {c.vendorName}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#1687E8]">
                      {formatThaiDate(c.expectedPaymentDate, { shortMonth: true })}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#08294F]">
                      {formatThaiCurrency(c.amount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1687E8] border border-blue-200">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))
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
              <span>บันทึกภาระผูกพันใหม่ (Commitment)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              บันทึกภาระผูกพันจากแผนกต้นทางเพื่อเตรียมสภาพคล่องล่วงหน้า
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เอกสารต้นทาง (เช่น PO-69-0550, สัญญาเลขที่ 44/2569)
                </label>
                <input
                  type="text"
                  required
                  value={sourceDocument}
                  onChange={(e) => setSourceDocument(e.target.value)}
                  placeholder="เช่น PO-69-0550 (จัดซื้อเวชภัณฑ์ ICU)"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    กลุ่มงานผู้เบิก
                  </label>
                  <select
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="กลุ่มงานเภสัชกรรม">กลุ่มงานเภสัชกรรม</option>
                    <option value="กลุ่มงานศัลยกรรม">กลุ่มงานศัลยกรรม</option>
                    <option value="กลุ่มงานผู้ป่วยวิกฤต (ICU)">กลุ่มงานผู้ป่วยวิกฤต (ICU)</option>
                    <option value="กลุ่มงานบริหารทั่วไป">กลุ่มงานบริหารทั่วไป</option>
                    <option value="กลุ่มงานการเงินและบัญชี">กลุ่มงานการเงินและบัญชี</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    บริษัทคู่ค้า / ผู้รับเงิน
                  </label>
                  <input
                    type="text"
                    required
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    placeholder="เช่น บจก. สยามเภสัชเวชภัณฑ์"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    วงเงินผูกพัน (บาท)
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
                    กำหนดจ่ายโดยประมาณ
                  </label>
                  <input
                    type="date"
                    required
                    value={expectedPaymentDate}
                    onChange={(e) => setExpectedPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  คำอธิบายรายการ
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ระบุรายละเอียดภาระผูกพัน..."
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
                  บันทึกภาระผูกพัน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

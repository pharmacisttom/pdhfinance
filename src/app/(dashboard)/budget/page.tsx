'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  PlusCircle,
  Search,
  Filter,
  ArrowRightLeft,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Building,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { formatThaiCurrency } from '@/lib/fiscal-year';

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    totalAllocated: 0,
    totalAdjustment: 0,
    totalCommitted: 0,
    totalSpent: 0,
    totalAvailable: 0,
    utilizationRate: '0',
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any | null>(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);

  // Add Form
  const [budgetName, setBudgetName] = useState('');
  const [budgetCode, setBudgetCode] = useState('510301');
  const [departmentName, setDepartmentName] = useState('กลุ่มงานเภสัชกรรม');
  const [fundName, setFundName] = useState('เงินบำรุงโรงพยาบาล (UC)');
  const [allocated, setAllocated] = useState('');

  // Adjust Form
  const [adjType, setAdjType] = useState('INCREASE');
  const [adjAmount, setAdjAmount] = useState('');
  const [adjReason, setAdjReason] = useState('');

  // Override Form
  const [overrideReason, setOverrideReason] = useState('');

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/budget');
      const json = await res.json();
      if (json.success) {
        setBudgets(json.data.budgets);
        setSummary(json.data.summary);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetName,
          budgetCode,
          departmentName,
          fundName,
          allocated,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchBudgets();
        setBudgetName('');
        setAllocated('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBudget) return;

    try {
      const res = await fetch('/api/budget/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetId: selectedBudget.id,
          adjustmentType: adjType,
          amount: adjAmount,
          reason: adjReason,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAdjustModal(false);
        fetchBudgets();
        setAdjAmount('');
        setAdjReason('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = budgets.filter((b) => {
    if (
      search &&
      !b.budgetName.toLowerCase().includes(search.toLowerCase()) &&
      !b.budgetCode.toLowerCase().includes(search.toLowerCase()) &&
      !b.departmentName.toLowerCase().includes(search.toLowerCase())
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
            <PieChart className="w-5 h-5 text-[#1687E8]" />
            <span>ระบบควบคุมและบริหารงบประมาณ (Budget Control Management)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            โครงสร้างงบประมาณตามปีงบประมาณไทย กองทุน โครงการ แผนก พร้อมระบบตรวจสอบ Available Budget ป้องกันการเบิกจ่ายเกินวงเงิน
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
          <span>เพิ่มหมวดงบประมาณ</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="card-soft p-4 border-l-4 border-l-[#08294F]">
          <span className="text-[11px] text-gray-500 font-semibold block">งบจัดสรรทั้งหมด</span>
          <div className="text-lg font-bold text-[#08294F] mt-1">
            {formatThaiCurrency(summary.totalAllocated)} บ.
          </div>
          <div className="text-[10px] text-gray-400 mt-1">กรอบงบตั้งต้น</div>
        </div>

        <div className="card-soft p-4 border-l-4 border-l-blue-500">
          <span className="text-[11px] text-blue-700 font-semibold block">โอนเปลี่ยนแปลง</span>
          <div className="text-lg font-bold text-blue-700 mt-1">
            +{formatThaiCurrency(summary.totalAdjustment)} บ.
          </div>
          <div className="text-[10px] text-blue-500 mt-1">โอนเพิ่ม / โอนลด</div>
        </div>

        <div className="card-soft p-4 border-l-4 border-l-amber-500">
          <span className="text-[11px] text-amber-700 font-semibold block">ผูกพันแล้ว (PO)</span>
          <div className="text-lg font-bold text-amber-700 mt-1">
            {formatThaiCurrency(summary.totalCommitted)} บ.
          </div>
          <div className="text-[10px] text-amber-500 mt-1">ภาระผูกพันรอจ่าย</div>
        </div>

        <div className="card-soft p-4 border-l-4 border-l-emerald-500">
          <span className="text-[11px] text-emerald-700 font-semibold block">เบิกจ่ายจริง (Spent)</span>
          <div className="text-lg font-bold text-emerald-700 mt-1">
            {formatThaiCurrency(summary.totalSpent)} บ.
          </div>
          <div className="text-[10px] text-emerald-600 font-medium mt-1">
            ใช้ไป {summary.utilizationRate}%
          </div>
        </div>

        <div className="card-soft p-4 border-l-4 border-l-[#08A7A4] col-span-2 lg:col-span-1">
          <span className="text-[11px] text-[#08A7A4] font-bold block">คงเหลือพร้อมเบิก (Available)</span>
          <div className="text-lg font-bold text-[#08A7A4] mt-1">
            {formatThaiCurrency(summary.totalAvailable)} บ.
          </div>
          <div className="text-[10px] text-[#08A7A4] font-medium mt-1">
            วงเงินพร้อมใช้งาน
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
          placeholder="ค้นหาชื่อหมวดงบ, รหัสงบประมาณ (51xxxx), กลุ่มงาน..."
          className="w-full bg-transparent text-xs text-gray-700 outline-none"
        />
      </div>

      {/* Budget Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">รหัสงบ</th>
                <th className="py-3.5 px-4 font-semibold">รายการหมวดงบประมาณ</th>
                <th className="py-3.5 px-4 font-semibold">กลุ่มงาน / สังกัด</th>
                <th className="py-3.5 px-4 font-semibold text-right">งบจัดสรร</th>
                <th className="py-3.5 px-4 font-semibold text-right">โอนเปลี่ยน</th>
                <th className="py-3.5 px-4 font-semibold text-right">ผูกพัน (PO)</th>
                <th className="py-3.5 px-4 font-semibold text-right">เบิกจ่ายจริง</th>
                <th className="py-3.5 px-4 font-semibold text-right">คงเหลือ (Available)</th>
                <th className="py-3.5 px-4 font-semibold text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-gray-400">
                    ไม่พบข้อมูลหมวดงบประมาณ
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const usagePercent = ((b.spent + b.committed) / (b.allocated + b.adjustment || 1)) * 100;
                  const isCritical = usagePercent >= 85;

                  return (
                    <tr key={b.id} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-[#08294F]">
                        {b.budgetCode}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-[#08294F]">{b.budgetName}</div>
                        <span className="text-[10px] text-gray-500">{b.fundName}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-700 font-medium">
                        {b.departmentName}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-gray-700">
                        {formatThaiCurrency(b.allocated)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-blue-600">
                        {b.adjustment > 0 ? `+${formatThaiCurrency(b.adjustment)}` : formatThaiCurrency(b.adjustment)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-medium text-amber-600">
                        {formatThaiCurrency(b.committed)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                        {formatThaiCurrency(b.spent)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold text-sm ${
                          isCritical ? 'text-[#FF4664]' : 'text-[#08A7A4]'
                        }`}
                      >
                        {formatThaiCurrency(b.available)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedBudget(b);
                            setShowAdjustModal(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#1687E8] text-gray-700 text-[11px] font-semibold transition-all shadow-xs flex items-center space-x-1 mx-auto"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                          <span>โอนงบ</span>
                        </button>
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
              <span>เพิ่มหมวดงบประมาณใหม่</span>
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              กำหนดกรอบวงเงินงบประมาณประจำปีสำหรับกลุ่มงาน
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ชื่อหมวดงบประมาณ
                </label>
                <input
                  type="text"
                  required
                  value={budgetName}
                  onChange={(e) => setBudgetName(e.target.value)}
                  placeholder="เช่น ค่าจัดซื้อยาและเวชภัณฑ์ผู้ป่วยวิกฤต"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    รหัสหมวดงบประมาณ
                  </label>
                  <input
                    type="text"
                    required
                    value={budgetCode}
                    onChange={(e) => setBudgetCode(e.target.value)}
                    placeholder="เช่น 510301"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    กลุ่มงานผู้รับผิดชอบ
                  </label>
                  <select
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="กลุ่มงานเภสัชกรรม">กลุ่มงานเภสัชกรรม</option>
                    <option value="กลุ่มงานการเงินและบัญชี">กลุ่มงานการเงินและบัญชี</option>
                    <option value="กลุ่มงานบริหารทั่วไป">กลุ่มงานบริหารทั่วไป</option>
                    <option value="กลุ่มงานผู้ป่วยวิกฤต (ICU)">กลุ่มงานผู้ป่วยวิกฤต (ICU)</option>
                    <option value="กลุ่มงานศัลยกรรม">กลุ่มงานศัลยกรรม</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  วงเงินจัดสรรเริ่มต้น (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={allocated}
                  onChange={(e) => setAllocated(e.target.value)}
                  placeholder="0.00"
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
                  บันทึกหมวดงบประมาณ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Modal */}
      {showAdjustModal && selectedBudget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <ArrowRightLeft className="w-5 h-5 text-[#1687E8]" />
              <span>โอนเปลี่ยนแปลงงบประมาณ (Budget Transfer)</span>
            </h3>
            <div className="p-3 bg-blue-50 rounded-xl mb-4 text-xs space-y-1">
              <div className="font-bold text-[#08294F]">
                {selectedBudget.budgetName} ({selectedBudget.budgetCode})
              </div>
              <div className="text-gray-600">
                วงเงินคงเหลือปัจจุบัน: <span className="font-bold text-[#08294F]">{formatThaiCurrency(selectedBudget.available)} บาท</span>
              </div>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ประเภทการโอน
                </label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                >
                  <option value="INCREASE">+ โอนเพิ่มงบประมาณ (Increase / Transfer In)</option>
                  <option value="DECREASE">- โอนลดงบประมาณ (Decrease / Transfer Out)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  จำนวนเงินที่โอนเปลี่ยนแปลง (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={adjAmount}
                  onChange={(e) => setAdjAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  เหตุผลและความจำเป็นในการโอน
                </label>
                <textarea
                  required
                  rows={2}
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  placeholder="ระบุเหตุผลความจำเป็น เช่น ปรับแผนตามปริมาณผู้ป่วยวิกฤตที่เพิ่มขึ้น..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
                >
                  บันทึกการโอนงบ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

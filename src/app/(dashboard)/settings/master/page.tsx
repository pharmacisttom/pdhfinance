'use client';

import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  CheckCircle2,
  Layers,
  Wallet,
  PieChart,
  Users,
} from 'lucide-react';
import { store } from '@/lib/data-store';

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<'DEPT' | 'FUND' | 'BUDGET_CODE' | 'BANK'>('DEPT');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#1687E8]" />
            <span>จัดการข้อมูลหลัก (Master Data Settings)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            ข้อมูลพื้นฐานกลุ่มงาน กองทุน หมวดงบประมาณ และธนาคารสำหรับระบบการเงิน
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-gray-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('DEPT')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'DEPT'
              ? 'bg-[#08294F] text-white font-bold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          กลุ่มงาน / แผนก ({store.departments.length})
        </button>
        <button
          onClick={() => setActiveTab('FUND')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'FUND'
              ? 'bg-[#08294F] text-white font-bold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          กองทุนและแหล่งเงิน ({store.funds.length})
        </button>
        <button
          onClick={() => setActiveTab('BANK')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'BANK'
              ? 'bg-[#08294F] text-white font-bold shadow-sm'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ธนาคาร ({store.bankAccounts.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="card-soft overflow-hidden">
        {activeTab === 'DEPT' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัส</th>
                <th className="py-3 px-4">ชื่อกลุ่มงาน / แผนก</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {store.departments.map((d) => (
                <tr key={d.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{d.code}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{d.name}</td>
                  <td className="py-3 px-4 text-gray-500">{d.type}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ใช้งาน
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'FUND' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสกองทุน</th>
                <th className="py-3 px-4">ชื่อกองทุน / แหล่งเงิน</th>
                <th className="py-3 px-4">คำอธิบาย</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {store.funds.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{f.code}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{f.name}</td>
                  <td className="py-3 px-4 text-gray-500">{f.description || '-'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ใช้งาน
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'BANK' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสธนาคาร</th>
                <th className="py-3 px-4">ชื่อธนาคาร</th>
                <th className="py-3 px-4">สาขา</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {store.bankAccounts.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{b.bankCode}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{b.bankName}</td>
                  <td className="py-3 px-4 text-gray-500">{b.branch}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                      ใช้งาน
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

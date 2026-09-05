'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Clock,
  User,
  Activity,
  Layers,
  X,
  Code,
} from 'lucide-react';
import { store } from '@/lib/data-store';
import { formatThaiDate } from '@/lib/fiscal-year';

export default function AuditTrailPage() {
  const [logs, setLogs] = useState(store.auditLogs);
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<any | null>(null);

  const filtered = logs.filter((l) => {
    if (moduleFilter !== 'ALL' && l.module !== moduleFilter) return false;
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (
      search &&
      !l.username.toLowerCase().includes(search.toLowerCase()) &&
      !l.entity.toLowerCase().includes(search.toLowerCase()) &&
      !l.entityId?.toLowerCase().includes(search.toLowerCase())
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
            <ShieldCheck className="w-5 h-5 text-[#1687E8]" />
            <span>บันทึกการตรวจสอบย้อนหลัง (Audit Trail Logs)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            บันทึกประวัติการกระทำ การแก้ไข การอนุมัติ และการเข้าสู่ระบบแบบไม่สามารถลบได้ (Immutable Log)
          </p>
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
            placeholder="ค้นหาชื่อผู้ใช้, Entity, ID..."
            className="w-full bg-transparent text-xs text-gray-700 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุกโมดูล (All Modules)</option>
            <option value="AUTH">AUTH (เข้า/ออกระบบ)</option>
            <option value="CASH_BANK">CASH_BANK (เงินสด/ธนาคาร)</option>
            <option value="RECEIVABLE">RECEIVABLE (ลูกหนี้)</option>
            <option value="PAYABLE">PAYABLE (เจ้าหนี้)</option>
            <option value="LOAN">LOAN (เงินยืมราชการ)</option>
            <option value="BUDGET">BUDGET (งบประมาณ)</option>
            <option value="REVENUE">REVENUE (รายได้)</option>
          </select>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 outline-none"
          >
            <option value="ALL">ทุก Action (All Actions)</option>
            <option value="CREATE">CREATE (สร้าง)</option>
            <option value="UPDATE">UPDATE (แก้ไข)</option>
            <option value="APPROVE">APPROVE (อนุมัติ)</option>
            <option value="PAYMENT">PAYMENT (รับ/จ่ายเงิน)</option>
            <option value="LOGIN">LOGIN (เข้าสู่ระบบ)</option>
            <option value="LOGOUT">LOGOUT (ออกจากระบบ)</option>
            <option value="CLOSE_PERIOD">CLOSE_PERIOD (ปิดงวด)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3.5 px-4 font-semibold">วัน-เวลา</th>
                <th className="py-3.5 px-4 font-semibold">ผู้ใช้งาน (User)</th>
                <th className="py-3.5 px-4 font-semibold">บทบาท (Role)</th>
                <th className="py-3.5 px-4 font-semibold">โมดูล</th>
                <th className="py-3.5 px-4 font-semibold">การกระทำ (Action)</th>
                <th className="py-3.5 px-4 font-semibold">Entity / ID</th>
                <th className="py-3.5 px-4 font-semibold">IP Address</th>
                <th className="py-3.5 px-4 font-semibold text-center">ดูข้อมูล JSON</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {formatThaiDate(l.createdAt, { showTime: true, shortMonth: true })}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#08294F]">
                    {l.username}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1687E8] font-semibold text-[10px]">
                      {l.role || 'USER'}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-700 font-medium">
                    {l.module}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        l.action === 'APPROVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : l.action === 'CREATE'
                          ? 'bg-blue-50 text-[#1687E8] border border-blue-200'
                          : l.action === 'PAYMENT'
                          ? 'bg-purple-50 text-purple-700 border border-purple-200'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-[11px]">
                    {l.entity} {l.entityId ? `(${l.entityId})` : ''}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500 text-[11px]">
                    {l.ipAddress || '127.0.0.1'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedLog(l)}
                      className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#1687E8] hover:text-white text-gray-600 transition-colors"
                      title="ดูรายละเอียดข้อมูลก่อน/หลัง"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Diff Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div>
                <h3 className="text-base font-bold text-[#08294F] flex items-center space-x-2">
                  <Code className="w-5 h-5 text-[#1687E8]" />
                  <span>รายละเอียด Audit Trail JSON Data</span>
                </h3>
                <div className="text-xs text-gray-500">
                  {selectedLog.action} {selectedLog.entity} โดย {selectedLog.username} ({formatThaiDate(selectedLog.createdAt, { showTime: true })})
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 flex-1 overflow-y-auto space-y-4">
              {selectedLog.beforeData && (
                <div>
                  <div className="text-xs font-bold text-gray-600 mb-1">ข้อมูลก่อนแก้ไข (Before Data):</div>
                  <pre className="p-3 bg-red-50/60 border border-red-200 rounded-xl text-[11px] font-mono text-red-900 overflow-x-auto">
                    {JSON.stringify(selectedLog.beforeData, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <div className="text-xs font-bold text-gray-600 mb-1">ข้อมูลหลังบันทึก (After Data):</div>
                <pre className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl text-[11px] font-mono text-emerald-900 overflow-x-auto">
                  {JSON.stringify(selectedLog.afterData, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768]"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

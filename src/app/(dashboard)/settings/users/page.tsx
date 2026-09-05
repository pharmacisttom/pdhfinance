'use client';

import React, { useState } from 'react';
import {
  Users,
  Shield,
  PlusCircle,
  Search,
  KeyRound,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { PERMISSIONS, ROLE_DEFAULT_PERMISSIONS } from '@/lib/rbac';
import { formatThaiDate } from '@/lib/fiscal-year';

export default function UsersManagementPage() {
  const [users, setUsers] = useState([
    {
      id: 'usr-1',
      username: 'admin',
      fullName: 'ผู้ดูแลระบบสูงสุด (Super Admin)',
      role: 'SUPER_ADMIN',
      department: 'กลุ่มงานบริหารทั่วไป',
      status: 'ACTIVE',
      lastLogin: '2026-09-05 06:00',
      lastIp: '127.0.0.1',
    },
    {
      id: 'usr-2',
      username: 'cfo',
      fullName: 'นพ. ชวลิต การเงินมั่นคง (CFO)',
      role: 'CFO',
      department: 'กลุ่มงานการเงินและบัญชี',
      status: 'ACTIVE',
      lastLogin: '2026-09-05 07:30',
      lastIp: '192.168.1.45',
    },
    {
      id: 'usr-3',
      username: 'finance',
      fullName: 'นางสาวดาริกา พัฒนศิลป์ (การเงิน)',
      role: 'FINANCE',
      department: 'กลุ่มงานการเงินและบัญชี',
      status: 'ACTIVE',
      lastLogin: '2026-09-04 15:30',
      lastIp: '192.168.1.102',
    },
    {
      id: 'usr-4',
      username: 'budget',
      fullName: 'นายสมเกียรติ แผนงานดี (งบประมาณ)',
      role: 'BUDGET',
      department: 'กลุ่มงานยุทธศาสตร์และงบประมาณ',
      status: 'ACTIVE',
      lastLogin: '2026-09-04 11:20',
      lastIp: '192.168.1.88',
    },
    {
      id: 'usr-5',
      username: 'auditor',
      fullName: 'นางสุภาพร ตรวจสอบเข้ม (ผู้ตรวจสอบ)',
      role: 'AUDITOR',
      department: 'หน่วยตรวจสอบภายใน',
      status: 'ACTIVE',
      lastLogin: '2026-09-03 09:15',
      lastIp: '192.168.1.12',
    },
  ]);

  const [selectedRole, setSelectedRole] = useState('CFO');

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : u
      )
    );
  };

  const handleResetPassword = (username: string) => {
    alert(`รีเซ็ตรหัสผ่านสำหรับผู้ใช้งาน "${username}" เป็น "password123" เรียบร้อยแล้ว (ผู้ใช้ต้องเปลี่ยนรหัสผ่านในการเข้าใช้งานครั้งแรก)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#1687E8]" />
            <span>จัดการผู้ใช้งานและสิทธิ์ (Users & RBAC Permission Matrix)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            กำหนดสิทธิ์การเข้าถึงข้อมูลตามบทบาท (Granular Permissions) ปลดล็อกบัญชี และรีเซ็ตรหัสผ่าน
          </p>
        </div>
      </div>

      {/* Users List Card */}
      <div className="card-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="text-xs font-bold text-[#08294F]">รายชื่อผู้ใช้งานในระบบ ({users.length} บัญชี)</div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">ชื่อผู้ใช้ (Username)</th>
                <th className="py-3 px-4">ชื่อ-นามสกุล</th>
                <th className="py-3 px-4">บทบาท (Role)</th>
                <th className="py-3 px-4">กลุ่มงาน / สังกัด</th>
                <th className="py-3 px-4">เข้าสู่ระบบล่าสุด</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
                <th className="py-3 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{u.username}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{u.fullName}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1687E8] font-bold text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{u.department}</td>
                  <td className="py-3 px-4 text-gray-500 text-[11px] font-mono">
                    {u.lastLogin} ({u.lastIp})
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-[#FF4664]'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => handleResetPassword(u.username)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title="รีเซ็ตรหัสผ่าน"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(u.id)}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700"
                        title={u.status === 'ACTIVE' ? 'ระงับการใช้งาน' : 'เปิดใช้งาน'}
                      >
                        {u.status === 'ACTIVE' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Permission Matrix Preview */}
      <div className="card-soft p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#08294F] flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#1687E8]" />
              <span>ผังสิทธิ์การใช้งานตามบทบาท (Granular Role-Permission Matrix)</span>
            </h3>
            <p className="text-xs text-gray-500">
              ตรวจสอบสิทธิ์การดูข้อมูล สร้าง แก้ไข อนุมัติ และส่งออกรายงานของแต่ละ Role
            </p>
          </div>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#08294F] outline-none"
          >
            <option value="SUPER_ADMIN">SUPER_ADMIN (ทุกสิทธิ์)</option>
            <option value="CFO">CFO (อนุมัติการเงิน/งบ)</option>
            <option value="FINANCE">FINANCE (รับ-จ่าย-ล้างเงินยืม)</option>
            <option value="BUDGET">BUDGET (บริหารงบประมาณ)</option>
            <option value="AUDITOR">AUDITOR (ตรวจสอบย้อนหลัง)</option>
            <option value="VIEWER">VIEWER (ดูอย่างเดียว)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {Object.entries(PERMISSIONS).map(([key, permCode]) => {
            const rolePerms = ROLE_DEFAULT_PERMISSIONS[selectedRole] || [];
            const hasPerm = selectedRole === 'SUPER_ADMIN' || rolePerms.includes(permCode as any);

            return (
              <div
                key={key}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  hasPerm ? 'bg-emerald-50/40 border-emerald-200' : 'bg-gray-50/50 border-gray-200 opacity-60'
                }`}
              >
                <span className="font-mono font-medium text-gray-800">{permCode}</span>
                {hasPerm ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center space-x-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>อนุญาต</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400">ไม่มีสิทธิ์</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

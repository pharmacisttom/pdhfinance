'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Bell,
  Search,
  Calendar,
  ChevronDown,
  User,
  Shield,
  LogOut,
  Building,
  CheckCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatThaiDate } from '@/lib/fiscal-year';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export default function Header({ onToggleSidebar, onOpenSearch }: HeaderProps) {
  const pathname = usePathname();
  const [fiscalYear, setFiscalYear] = useState(2569);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentTime(new Date());
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path: string) => {
    if (path.includes('/dashboard')) return 'Dashboard ภาพรวมผู้บริหาร';
    if (path.includes('/cash-bank/accounts')) return 'ทะเบียนบัญชีเงินฝากธนาคาร';
    if (path.includes('/cash-bank/transactions')) return 'รายการเคลื่อนไหวทางธนาคาร (Bank Transactions)';
    if (path.includes('/cash-bank/reconciliation')) return 'การกระทบยอดเงินฝากธนาคาร (Bank Reconciliation)';
    if (path.includes('/cash-bank/closing')) return 'การปิดยอดประจำวันและปิดงวดบัญชี';
    if (path.includes('/receivables')) return 'ระบบบริหารลูกหนี้ (Accounts Receivable)';
    if (path.includes('/payables')) return 'ระบบบริหารเจ้าหนี้ (Accounts Payable)';
    if (path.includes('/commitments')) return 'ระบบบริหารภาระผูกพันทางการเงิน (Commitment)';
    if (path.includes('/loans')) return 'ระบบบริหารเงินยืมราชการ (Government Loan)';
    if (path.includes('/budget')) return 'ระบบควบคุมและบริหารงบประมาณ (Budget Management)';
    if (path.includes('/revenue')) return 'ระบบบันทึกรายได้และเงินบำรุง (Revenue)';
    if (path.includes('/reports')) return 'ศูนย์รวมรายงานการเงินและบัญชี 16 ชุด';
    if (path.includes('/notifications')) return 'ศูนย์แจ้งเตือนสถานะทางการเงิน (Notification Center)';
    if (path.includes('/audit')) return 'ระบบตรวจสอบย้อนหลัง (Audit Trail Logs)';
    if (path.includes('/settings/master')) return 'จัดการข้อมูลหลัก (Master Data Settings)';
    if (path.includes('/settings/users')) return 'จัดการผู้ใช้งานและสิทธิ์ (Users & RBAC)';
    return 'FINANCE CONTROL PLATFORM';
  };

  return (
    <header className="sticky top-0 z-30 h-20 bg-white border-b border-gray-200/80 shadow-xs px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      {/* Left Area: Mobile Menu + Page Title */}
      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-[#08294F] hover:bg-gray-100 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <span>{getPageTitle(pathname)}</span>
          </h1>
          <div className="flex items-center space-x-3 text-xs text-gray-500 mt-0.5">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-[#1687E8]" />
              <span>{currentTime ? formatThaiDate(currentTime, { shortMonth: true }) : '-'}</span>
            </span>
            <span>•</span>
            <span className="text-[#08A7A4] font-medium">โรงพยาบาลศูนย์ / MOPH</span>
          </div>
        </div>
      </div>

      {/* Right Area: Search, Fiscal Year, Notifications, Profile */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Global Search Button */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="hidden sm:flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-gray-100/80 hover:bg-gray-200/70 text-gray-500 text-xs font-medium border border-gray-200 transition-all group"
        >
          <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#1687E8]" />
          <span>ค้นหาเอกสาร, ลูกหนี้, เจ้าหนี้...</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white border border-gray-300 text-[10px] text-gray-400 font-mono shadow-xs">
            Ctrl+K
          </kbd>
        </button>

        {/* Fiscal Year Selector */}
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#EEF4FC] border border-blue-200/70 text-xs font-semibold text-[#08294F]">
          <span className="text-[#1687E8]">ปีงบ:</span>
          <select
            value={fiscalYear}
            onChange={(e) => setFiscalYear(Number(e.target.value))}
            className="bg-transparent font-bold text-[#08294F] outline-none cursor-pointer"
          >
            <option value={2569}>2569 (ปัจจุบัน)</option>
            <option value={2568}>2568</option>
            <option value={2567}>2567</option>
          </select>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <Link
            href="/notifications"
            className="relative p-2.5 rounded-xl text-gray-600 hover:text-[#08294F] hover:bg-gray-100 transition-colors block"
            title="ศูนย์แจ้งเตือน"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FF4664] text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
              4
            </span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-[#08294F] text-white flex items-center justify-center font-bold text-xs shadow-md">
              CFO
            </div>
            <div className="hidden md:block">
              <div className="text-xs font-bold text-[#08294F] leading-tight">
                นพ. ชวลิต
              </div>
              <div className="text-[10px] text-gray-500">
                รอง ผอ. ฝ่ายการเงิน (CFO)
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {/* User Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-200 shadow-soft-lg py-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="text-xs font-bold text-[#08294F]">นพ. ชวลิต การเงินมั่นคง</div>
                <div className="text-[11px] text-gray-500">cfo@hospital.moph.go.th</div>
                <div className="mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-[#1687E8] text-[10px] font-bold">
                  สิทธิ์: CFO (Full Approval)
                </div>
              </div>

              <div className="py-1 text-xs">
                <Link
                  href="/settings/users"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>จัดการสิทธิ์ผู้ใช้งาน</span>
                </Link>
                <Link
                  href="/audit"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>ประวัติการทำงาน (Audit Trail)</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1 text-xs">
                <Link
                  href="/login"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-[#FF4664] hover:bg-red-50 font-semibold transition-colors"
                >
                  <LogOut className="w-4 h-4 text-[#FF4664]" />
                  <span>ออกจากระบบ (Sign Out)</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

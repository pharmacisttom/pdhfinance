'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  CreditCard,
  Layers,
  FileCheck2,
  PieChart,
  TrendingUp,
  FileSpreadsheet,
  Bell,
  ShieldCheck,
  Settings,
  Landmark,
  ChevronDown,
  Building2,
  Users,
  LogOut,
  FileText,
  UploadCloud,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      title: 'ภาพรวมระบบ',
      items: [
        {
          name: 'Dashboard ผู้บริหาร',
          href: '/dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'การบริหารการเงิน',
      items: [
        {
          name: 'เงินสดและธนาคาร',
          href: '/cash-bank/accounts',
          icon: Wallet,
          subItems: [
            { name: 'ทะเบียนบัญชีธนาคาร', href: '/cash-bank/accounts' },
            { name: 'รายการเคลื่อนไหว (Tx)', href: '/cash-bank/transactions' },
            { name: 'กระทบยอด (Bank Rec)', href: '/cash-bank/reconciliation' },
            { name: 'ปิดยอดรายวัน/งวด', href: '/cash-bank/closing' },
          ],
        },
        {
          name: 'ระบบลูกหนี้ (AR)',
          href: '/receivables',
          icon: Receipt,
        },
        {
          name: 'ระบบเจ้าหนี้ (AP)',
          href: '/payables',
          icon: CreditCard,
        },
        {
          name: 'ภาระผูกพัน (Commitment)',
          href: '/commitments',
          icon: Layers,
        },
        {
          name: 'เงินยืมราชการ (Loan)',
          href: '/loans',
          icon: FileCheck2,
        },
        {
          name: 'นำเข้าข้อมูล (Excel)',
          href: '/import',
          icon: UploadCloud,
        },
      ],
    },
    {
      title: 'งบประมาณและรายได้',
      items: [
        {
          name: 'บริหารงบประมาณ',
          href: '/budget',
          icon: PieChart,
        },
        {
          name: 'บันทึกรายได้',
          href: '/revenue',
          icon: TrendingUp,
        },
      ],
    },
    {
      title: 'รายงานและการตรวจสอบ',
      items: [
        {
          name: 'สรุปสาระสำคัญประจำเดือน',
          href: '/monthly-summary',
          icon: FileText,
        },
        {
          name: 'ศูนย์รายงานการเงิน (16)',
          href: '/reports',
          icon: FileSpreadsheet,
        },
        {
          name: 'การแจ้งเตือน (Alerts)',
          href: '/notifications',
          icon: Bell,
        },
        {
          name: 'Audit Trail ย้อนหลัง',
          href: '/audit',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'การตั้งค่าระบบ',
      items: [
        {
          name: 'ข้อมูลหลัก (Master Data)',
          href: '/settings/master',
          icon: Building2,
        },
        {
          name: 'ผู้ใช้งานและสิทธิ์ (Users & RBAC)',
          href: '/settings/users',
          icon: Users,
        },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-[#08294F] text-white flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#0D3768] shadow-sidebar`}
      >
        {/* Brand Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-white/10 bg-[#061E3B]">
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-white p-1 flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src="/img/pdh.png"
                alt="PDH Hospital Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-sm tracking-wide text-white leading-tight truncate">
                กลุ่มงานการเงินและบัญชี
              </div>
              <div className="text-[11px] text-blue-300 font-medium truncate">
                รพ.ปลวกแดง
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {menuItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-blue-300/60 mb-2">
                {group.title}
              </div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href.split('?')[0]));

                return (
                  <div key={item.name} className="space-y-1">
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#1687E8] to-[#0D3768] text-white shadow-md shadow-[#1687E8]/20'
                          : 'text-blue-100/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                        <span>{item.name}</span>
                      </div>
                    </Link>

                    {/* Subitems if active */}
                    {item.subItems && isActive && (
                      <div className="pl-10 pr-2 py-1 space-y-1">
                        {item.subItems.map((sub) => {
                          const isSubActive = pathname === sub.href;
                          return (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => {
                                if (window.innerWidth < 1024) onClose();
                              }}
                              className={`block px-3 py-1.5 rounded-lg text-xs transition-colors ${
                                isSubActive
                                  ? 'bg-white/20 text-white font-semibold'
                                  : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              • {sub.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-white/10 bg-[#061E3B]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#1687E8] to-[#08A7A4] flex items-center justify-center text-xs font-bold text-white shadow">
              CFO
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-white truncate max-w-[130px]">
                นพ. ชวลิต (CFO)
              </div>
              <div className="text-[10px] text-blue-300">กลุ่มงานการเงินและบัญชี</div>
            </div>
          </div>

          <Link
            href="/login"
            title="ออกจากระบบ"
            className="p-2 rounded-lg text-blue-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Link>
        </div>
      </aside>
    </>
  );
}

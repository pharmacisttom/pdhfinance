'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  CreditCard,
  FileCheck2,
  PieChart,
  ArrowRight,
  Clock,
  Landmark,
} from 'lucide-react';
import { store } from '@/lib/data-store';
import { formatThaiDate } from '@/lib/fiscal-year';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(store.notifications);
  const [filter, setFilter] = useState('ALL');

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'RECEIVABLE':
        return <Receipt className="w-4 h-4 text-[#08A7A4]" />;
      case 'PAYABLE':
        return <CreditCard className="w-4 h-4 text-[#FF4664]" />;
      case 'LOAN':
        return <FileCheck2 className="w-4 h-4 text-amber-500" />;
      case 'BUDGET':
        return <PieChart className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-[#1687E8]" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#1687E8]" />
            <span>ศูนย์แจ้งเตือนสถานะทางการเงิน (Notification Center)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            แจ้งเตือนกำหนดชำระหนี้ สัญญาเงินยืมเกินกำหนด วงเงินงบประมาณ และรายการรออนุมัติ
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl text-xs font-semibold hover:bg-gray-50 shadow-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>ทำเครื่องหมายว่าอ่านทั้งหมดแล้ว</span>
        </button>
      </div>

      <div className="card-soft overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center space-x-2 bg-gray-50/50 text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'ALL' ? 'bg-[#08294F] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ทั้งหมด ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'UNREAD' ? 'bg-[#1687E8] text-white font-bold' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ยังไม่ได้อ่าน ({notifications.filter((n) => !n.isRead).length})
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between transition-colors ${
                !n.isRead ? 'bg-blue-50/30 font-medium' : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-start space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {getCategoryIcon(n.category)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-[#08294F]">{n.title}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#FF4664] inline-block"></span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">{n.message}</p>
                  <div className="text-[10px] text-gray-400 mt-1.5 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatThaiDate(n.createdAt, { showTime: true, shortMonth: true })}</span>
                  </div>
                </div>
              </div>

              {n.link && (
                <Link
                  href={n.link}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#1687E8] hover:text-white text-gray-700 text-xs font-semibold transition-colors flex items-center space-x-1 flex-shrink-0 ml-4"
                >
                  <span>เปิดดู</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

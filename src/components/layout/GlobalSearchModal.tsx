'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Receipt,
  CreditCard,
  FileCheck2,
  PieChart,
  Wallet,
  ArrowRight,
} from 'lucide-react';
import { formatThaiCurrency } from '@/lib/fiscal-year';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');

  // Sample quick search index
  const searchItems = [
    {
      type: 'ลูกหนี้ (AR)',
      title: 'AR-2569-000001 : สปสช. (ค่ารักษา IPD เดือน ส.ค.)',
      subtitle: 'ยอดคงค้าง: 6,500,000.00 บาท (เกินกำหนด)',
      href: '/receivables',
      icon: Receipt,
      category: 'RECEIVABLE',
    },
    {
      type: 'ลูกหนี้ (AR)',
      title: 'AR-2569-000002 : สำนักงานประกันสังคม (High Cost)',
      subtitle: 'ยอดคงค้าง: 4,200,000.00 บาท',
      href: '/receivables',
      icon: Receipt,
      category: 'RECEIVABLE',
    },
    {
      type: 'เจ้าหนี้ (AP)',
      title: 'AP-2569-000001 : บจก. สยามเภสัชเวชภัณฑ์ (PO-69-0412)',
      subtitle: 'ยอดรอจ่าย: 2,450,000.00 บาท (ครบกำหนดใน 3 วัน)',
      href: '/payables',
      icon: CreditCard,
      category: 'PAYABLE',
    },
    {
      type: 'เจ้าหนี้ (AP)',
      title: 'AP-2569-000002 : บจก. บางกอกเมดิคอลเทค (CT-Scan Service)',
      subtitle: 'ยอดรอจ่าย: 1,850,000.00 บาท (รออนุมัติ)',
      href: '/payables',
      icon: CreditCard,
      category: 'PAYABLE',
    },
    {
      type: 'เงินยืมราชการ (LN)',
      title: 'LN-2569-000001 : นพ. วีรชัย กิตติวิทยา (ประชุมวิชาการสิงคโปร์)',
      subtitle: 'ยอดคงค้าง: 85,000.00 บาท (เกินกำหนดชำระ)',
      href: '/loans',
      icon: FileCheck2,
      category: 'LOAN',
    },
    {
      type: 'งบประมาณ (Budget)',
      title: 'bdg-3 (510301) : ค่ายาและเวชภัณฑ์มิใช่ยา',
      subtitle: 'วงเงินคงเหลือ: 10,950,000.00 บาท',
      href: '/budget',
      icon: PieChart,
      category: 'BUDGET',
    },
    {
      type: 'ธนาคาร (Bank)',
      title: 'KTB 012-1-23456-7 : บัญชีเงินบำรุงโรงพยาบาล',
      subtitle: 'ยอดคงเหลือ: 52,480,350.00 บาท',
      href: '/cash-bank/accounts',
      icon: Wallet,
      category: 'BANK',
    },
  ];

  const filtered = query.trim() === ''
    ? searchItems
    : searchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.type.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger toggle in parent if needed
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-gray-200 flex items-center space-x-3 bg-gray-50/70">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาเลขเอกสาร (AR-, AP-, LN-), ชื่อลูกหนี้, บริษัทคู่ค้า, หมวดงบ..."
            className="w-full bg-transparent text-sm text-[#08294F] font-medium outline-none placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              ไม่พบข้อมูลที่ตรงกับคำค้นหา "{query}"
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    router.push(item.href);
                    onClose();
                  }}
                  className="w-full text-left flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/70 group transition-all"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-100/60 text-[#1687E8] flex items-center justify-center flex-shrink-0 group-hover:bg-[#1687E8] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#08294F] group-hover:text-[#1687E8]">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#1687E8] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between px-4">
          <span>กดลูกศรขึ้น/ลง เพื่อเลือก • Enter เพื่อเปิดหน้าจอ</span>
          <span className="font-semibold text-[#1687E8]">FINANCE GLOBAL SEARCH</span>
        </div>
      </div>
    </div>
  );
}

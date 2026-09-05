'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import GlobalSearchModal from '@/components/layout/GlobalSearchModal';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* Sidebar Component */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setSearchOpen(true)}
        />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        {/* System Footer */}
        <footer className="py-4 px-6 text-center text-xs text-gray-500 border-t border-gray-200/60 bg-white/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
            <div>
              ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม (FINANCE CONTROL PLATFORM) • กลุ่มงานการเงินและบัญชี โรงพยาบาลปลวกแดง
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="font-semibold text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200/70">
                Version 2026.09.05
              </span>
              <span>•</span>
              <span className="font-medium">ระบบนี้พัฒนาโดย Tomvis และสงวนสิทธิ์ทางกฎหมาย</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}

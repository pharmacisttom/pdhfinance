'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Lock,
  TrendingUp,
  Wallet,
  Receipt,
  CreditCard,
  PieChart,
  Activity,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function SystemShowcase() {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AR' | 'AP' | 'BUDGET'>('DASHBOARD');

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 px-2 sm:px-0">
      {/* Container Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-400/10 text-cyan-300 text-xs font-bold border border-cyan-400/20 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>ภาพจำลองหน้าตาระบบหลังบ้าน (BACK-OFFICE UI PREVIEW)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            หน้าต่างโปรแกรมจำลอง ระบบบริหารการเงิน โรงพยาบาลปลวกแดง
          </h3>
        </div>

        <div className="flex items-center space-x-2.5">
          <Link
            href="/login"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center space-x-2 backdrop-blur-sm shadow-md"
          >
            <Lock className="w-3.5 h-3.5 text-cyan-300" />
            <span>เข้าสู่ระบบเจ้าหน้าที่</span>
          </Link>
        </div>
      </div>

      {/* Confidentiality Warning Notice */}
      <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs flex items-center justify-between gap-3 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>ข้อมูลจำลองเพื่อรักษาความลับทางการเงิน:</strong> ข้อมูลทางการเงินจริงของโรงพยาบาลปลวกแดงเป็นความลับทางราชการ หน้าต่างด้านล่างแสดงเป็นโมเดลจำลองหน้าตาโปรแกรม (Simulation Model) เพื่อความปลอดภัย
          </span>
        </div>
        <Link
          href="/login"
          className="text-amber-300 hover:text-white underline font-bold shrink-0 hidden md:inline"
        >
          เข้าสู่ระบบเจ้าหน้าที่ &rarr;
        </Link>
      </div>

      {/* App Window Frame Mockup */}
      <div className="rounded-2xl sm:rounded-3xl bg-[#061E3B] border border-white/20 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Window Titlebar */}
        <div className="px-4 py-3 bg-[#041427] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-xs font-mono text-gray-400 hidden sm:inline">
              PDH-FINANCE // ระบบจำลองการบริหารการเงิน (Simulation Mode)
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-gray-400 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            <Lock className="w-3 h-3 text-cyan-400" />
            <span className="font-mono">https://pdhfinance.moph.go.th/dashboard [MOCKUP]</span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="px-4 py-2 bg-[#08294F] border-b border-white/10 flex items-center space-x-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'DASHBOARD'
                ? 'bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white shadow'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Dashboard ผู้บริหาร</span>
          </button>
          <button
            onClick={() => setActiveTab('AR')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'AR'
                ? 'bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white shadow'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>ทะเบียนลูกหนี้ (AR)</span>
          </button>
          <button
            onClick={() => setActiveTab('AP')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'AP'
                ? 'bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white shadow'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>ทะเบียนเจ้าหนี้ (AP)</span>
          </button>
          <button
            onClick={() => setActiveTab('BUDGET')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center space-x-1.5 transition-all shrink-0 ${
              activeTab === 'BUDGET'
                ? 'bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white shadow'
                : 'text-blue-200/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>งบประมาณและเงินยืม</span>
          </button>
        </div>

        {/* Mockup Canvas Area */}
        <div className="p-4 sm:p-6 bg-[#F5F8FC] text-[#08294F] space-y-4">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border-l-4 border-l-[#1687E8] border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                    <span>เงินฝากธนาคาร (จำลอง)</span>
                    <Wallet className="w-3.5 h-3.5 text-[#1687E8]" />
                  </div>
                  <div className="text-base sm:text-xl font-extrabold text-[#08294F] mt-1">
                    ฿48,650,200.00
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">↑ +4.2% จากเดือนก่อน</div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border-l-4 border-l-[#08A7A4] border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                    <span>ลูกหนี้ค้างชำระ (จำลอง)</span>
                    <Receipt className="w-3.5 h-3.5 text-[#08A7A4]" />
                  </div>
                  <div className="text-base sm:text-xl font-extrabold text-[#08294F] mt-1">
                    ฿19,420,800.00
                  </div>
                  <div className="text-[10px] text-amber-600 mt-0.5">เกิน 90 วัน: ฿2.1M</div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border-l-4 border-l-[#FF4664] border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                    <span>เจ้าหนี้รอจ่าย (จำลอง)</span>
                    <CreditCard className="w-3.5 h-3.5 text-[#FF4664]" />
                  </div>
                  <div className="text-base sm:text-xl font-extrabold text-[#08294F] mt-1">
                    ฿7,840,150.00
                  </div>
                  <div className="text-[10px] text-rose-600 mt-0.5">ครบกำหนด 7 วัน: ฿1.45M</div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-xl shadow-xs border-l-4 border-l-emerald-500 border border-gray-100">
                  <div className="text-[11px] font-semibold text-gray-500 flex justify-between">
                    <span>งบประมาณคงเหลือ (จำลอง)</span>
                    <PieChart className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-base sm:text-xl font-extrabold text-[#08294F] mt-1">
                    ฿14,250,000.00
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">เบิกจ่ายแล้ว 68.4%</div>
                </div>
              </div>

              {/* Chart & Trend Preview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Aging Graph */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xs text-[#08294F]">กราฟกระจายอายุลูกหนี้ Aging (จำลอง)</span>
                    <span className="text-[10px] bg-blue-50 text-[#1687E8] font-bold px-1.5 py-0.5 rounded">
                      อัตโนมัติ
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-gray-600">0 - 30 วัน</span>
                        <span className="font-bold text-emerald-600">฿10.25M (52%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '52%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-gray-600">31 - 60 วัน</span>
                        <span className="font-bold text-[#1687E8]">฿4.82M (25%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1687E8] rounded-full" style={{ width: '25%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="text-gray-600">&gt; 90 วัน</span>
                        <span className="font-bold text-[#FF4664]">฿2.10M (11%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF4664] rounded-full" style={{ width: '11%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Accounts Status */}
                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-bold text-xs text-[#08294F]">บัญชีเงินฝากหลัก (จำลอง)</span>
                    <span className="text-[10px] text-emerald-600 font-bold">กระทบยอด 100%</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50">
                      <div>
                        <div className="font-semibold text-gray-800">KTB บัญชีเงินบำรุง</div>
                        <div className="text-[10px] text-gray-500 font-mono">012-x-xxxx-7</div>
                      </div>
                      <div className="text-right font-mono font-bold text-[#08294F]">฿32,450,000.00</div>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg bg-blue-50/50">
                      <div>
                        <div className="font-semibold text-gray-800">SCB บัญชีเงินบริจาค</div>
                        <div className="text-[10px] text-gray-500 font-mono">111-x-xxxx-8</div>
                      </div>
                      <div className="text-right font-mono font-bold text-[#08294F]">฿16,200,200.00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AR */}
          {activeTab === 'AR' && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs animate-in fade-in duration-150">
              <div className="text-xs font-bold text-[#08294F] mb-2 flex justify-between items-center">
                <span>ตารางลูกหนี้สิทธิการรักษาและประกันสุขภาพ (จำลอง)</span>
                <span className="text-[10px] bg-blue-50 text-[#1687E8] font-semibold px-2 py-0.5 rounded">
                  4 รายการตัวอย่าง
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="p-2">เลขที่ AR</th>
                      <th className="p-2">สิทธิการรักษา</th>
                      <th className="p-2 text-right">จำนวนเงิน</th>
                      <th className="p-2 text-center">อายุหนี้</th>
                      <th className="p-2 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2 font-mono text-[#1687E8] font-bold">AR-2569-000412</td>
                      <td className="p-2 font-semibold">สปสช. (บัตรทอง OPD)</td>
                      <td className="p-2 text-right font-mono">4,250,000.00</td>
                      <td className="p-2 text-center text-emerald-600 font-bold">14 วัน</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">ปกติ</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-[#1687E8] font-bold">AR-2569-000413</td>
                      <td className="p-2 font-semibold">สำนักงานประกันสังคม</td>
                      <td className="p-2 text-right font-mono">2,180,500.00</td>
                      <td className="p-2 text-center text-[#1687E8] font-bold">38 วัน</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">ติดตามงวด 1</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-[#1687E8] font-bold">AR-2569-000398</td>
                      <td className="p-2 font-semibold">บริษัทประกันภัย พ.ร.บ.</td>
                      <td className="p-2 text-right font-mono">450,200.00</td>
                      <td className="p-2 text-center text-rose-600 font-bold">96 วัน</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">เกิน 90 วัน</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: AP */}
          {activeTab === 'AP' && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs animate-in fade-in duration-150">
              <div className="text-xs font-bold text-[#08294F] mb-2 flex justify-between items-center">
                <span>ตารางเจ้าหนี้การค้าค่ายาและเวชภัณฑ์ (จำลอง)</span>
                <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-2 py-0.5 rounded">
                  คิวจ่ายเงินจำลอง
                </span>
              </div>
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-700">
                    <tr>
                      <th className="p-2">เลขที่ AP</th>
                      <th className="p-2">บริษัทคู่ค้า</th>
                      <th className="p-2 text-right">ยอดรอจ่าย</th>
                      <th className="p-2 text-center">กำหนดชำระ</th>
                      <th className="p-2 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="p-2 font-mono text-[#1687E8] font-bold">AP-2569-000188</td>
                      <td className="p-2 font-semibold">องค์การเภสัชกรรม (GPO)</td>
                      <td className="p-2 text-right font-mono">1,850,000.00</td>
                      <td className="p-2 text-center text-rose-600 font-bold">อีก 3 วัน</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">อนุมัติจ่ายแล้ว</span>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2 font-mono text-[#1687E8] font-bold">AP-2569-000189</td>
                      <td className="p-2 font-semibold">บริษัท สยามเมดิคอลเทค จำกัด</td>
                      <td className="p-2 text-right font-mono">920,000.00</td>
                      <td className="p-2 text-center text-gray-600 font-bold">อีก 14 วัน</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">รอตรวจรับของ</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: BUDGET */}
          {activeTab === 'BUDGET' && (
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-xs animate-in fade-in duration-150">
              <div className="text-xs font-bold text-[#08294F] mb-3">
                การควบคุมวงเงินงบประมาณและการยืมเงินราชการ (จำลอง)
              </div>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-700">งบกลุ่มงานบริการทางการแพทย์</span>
                    <span className="font-bold text-gray-800">ใช้ไป 78% (คงเหลือ ฿4.2M)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-gray-700">งบกลุ่มงานเภสัชกรรม</span>
                    <span className="font-bold text-gray-800">ใช้ไป 65% (คงเหลือ ฿6.1M)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mockup Action Footer */}
        <div className="px-5 py-3.5 bg-[#041427] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-blue-200/80 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>ระบบจำลองหน้าตาโปรแกรม • เข้าถึงระบบจริงได้เฉพาะเจ้าหน้าที่การเงิน</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <Link
              href="/login"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1687E8] to-[#08A7A4] hover:from-[#116DBE] hover:to-[#068684] text-white font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบเจ้าหน้าที่ (Staff Login)</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  X,
  Shield,
  Lock,
  ArrowRight,
  TrendingUp,
  Wallet,
  Receipt,
  CreditCard,
  PieChart,
  FileCheck2,
  Calendar,
  Sparkles,
  Layers,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Building2,
} from 'lucide-react';

interface SystemPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemPreviewModal({ isOpen, onClose }: SystemPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'AR' | 'AP' | 'BUDGET'>('DASHBOARD');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-[#F5F8FC] rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#08294F] text-white border-b border-[#0D3768] shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
              <img
                src="/img/pdh.png"
                alt="PDH Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  ภาพจำลองหน้าตาระบบหลังบ้าน (System Simulation Demo)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold border border-cyan-400/30">
                  MOCKUP MODE
                </span>
              </div>
              <div className="text-xs text-blue-200">
                กลุ่มงานการเงินและบัญชี โรงพยาบาลปลวกแดง
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#1687E8] hover:bg-[#116DBE] text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบจริง</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Confidentiality Warning Alert */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 text-amber-900 text-xs flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>มาตรการรักษาความลับทางการเงิน:</strong> ตัวเลขและรายการที่แสดงเป็นข้อมูลตัวอย่างจำลอง (Simulated Mockup Data) เพื่อแสดงหน้าตาและการทำงานของระบบเท่านั้น ข้อมูลจริงของโรงพยาบาลถูกเข้ารหัสและจำกัดสิทธิ์เฉพาะเจ้าหน้าที่
            </span>
          </div>
          <Link
            href="/login"
            className="text-amber-800 underline font-semibold hover:text-amber-950 shrink-0 hidden md:inline"
          >
            เข้าสู่ระบบเจ้าหน้าที่ &rarr;
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-1 px-5 py-2.5 bg-white border-b border-gray-200 overflow-x-auto shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'DASHBOARD'
                ? 'bg-[#08294F] text-white font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>1. Dashboard ผู้บริหาร (ภาพรวม)</span>
          </button>
          <button
            onClick={() => setActiveTab('AR')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'AR'
                ? 'bg-[#08294F] text-white font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>2. ระบบลูกหนี้ & Aging (AR)</span>
          </button>
          <button
            onClick={() => setActiveTab('AP')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'AP'
                ? 'bg-[#08294F] text-white font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. ระบบเจ้าหนี้ & คิวจ่ายเงิน (AP)</span>
          </button>
          <button
            onClick={() => setActiveTab('BUDGET')}
            className={`px-3.5 py-2 rounded-xl flex items-center space-x-2 transition-all shrink-0 ${
              activeTab === 'BUDGET'
                ? 'bg-[#08294F] text-white font-bold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>4. งบประมาณ & เงินยืมราชการ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-5 animate-in fade-in duration-150">
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-soft p-4.5 border-l-4 border-l-[#1687E8]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>ยอดเงินฝากธนาคารรวม (จำลอง)</span>
                    <Wallet className="w-4 h-4 text-[#1687E8]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#08294F] mt-1.5">
                    ฿48,650,200.00
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center space-x-1">
                    <span>↑ +4.2% จากงวดก่อน</span>
                    <span className="text-gray-400">• รวม 6 บัญชี</span>
                  </div>
                </div>

                <div className="card-soft p-4.5 border-l-4 border-l-[#08A7A4]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>ลูกหนี้ค่ารักษาค้างชำระ (จำลอง)</span>
                    <Receipt className="w-4 h-4 text-[#08A7A4]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#08294F] mt-1.5">
                    ฿19,420,800.00
                  </div>
                  <div className="text-[11px] text-amber-600 font-medium mt-1">
                    <span>หนี้เกิน 90 วัน: ฿2.1M (10.8%)</span>
                  </div>
                </div>

                <div className="card-soft p-4.5 border-l-4 border-l-[#FF4664]">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>เจ้าหนี้การค้ารอจ่าย (จำลอง)</span>
                    <CreditCard className="w-4 h-4 text-[#FF4664]" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#08294F] mt-1.5">
                    ฿7,840,150.00
                  </div>
                  <div className="text-[11px] text-rose-600 font-medium mt-1">
                    <span>ครบกำหนดจ่ายใน 7 วัน: ฿1.45M</span>
                  </div>
                </div>

                <div className="card-soft p-4.5 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-semibold">
                    <span>งบประมาณคงเหลือ (จำลอง)</span>
                    <PieChart className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-xl sm:text-2xl font-extrabold text-[#08294F] mt-1.5">
                    ฿14,250,000.00
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-1">
                    <span>เบิกจ่ายแล้ว 68.4% (ตามเป้า)</span>
                  </div>
                </div>
              </div>

              {/* Visual Simulated Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Simulated Aging Chart */}
                <div className="card-soft p-5 lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-sm text-[#08294F]">
                        การวิเคราะห์อายุลูกหนี้ (Aging Distribution)
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        จำแนกตามระยะเวลาค้างชำระ (0-30, 31-60, 61-90, &gt;90 วัน)
                      </p>
                    </div>
                    <span className="text-[10px] bg-blue-50 text-[#1687E8] font-bold px-2 py-0.5 rounded">
                      Real-time
                    </span>
                  </div>

                  {/* Horizontal Bar Visual Representation */}
                  <div className="space-y-3 pt-1">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">0 - 30 วัน (ปกติ)</span>
                        <span className="font-bold text-emerald-600">฿10,250,000 (52.8%)</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '52.8%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">31 - 60 วัน (เริ่มติดตาม)</span>
                        <span className="font-bold text-[#1687E8]">฿4,820,000 (24.8%)</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1687E8] rounded-full" style={{ width: '24.8%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">61 - 90 วัน (เตือนงวด 2)</span>
                        <span className="font-bold text-amber-500">฿2,250,000 (11.6%)</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '11.6%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-gray-700">&gt; 90 วัน (หนี้ค้างนาน)</span>
                        <span className="font-bold text-[#FF4664]">฿2,100,800 (10.8%)</span>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FF4664] rounded-full" style={{ width: '10.8%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Simulated Fund Proportion */}
                <div className="card-soft p-5">
                  <h4 className="font-bold text-sm text-[#08294F] mb-1">
                    สัดส่วนกองทุนการเงิน (Fund Split)
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-4">
                    แบ่งตามแหล่งเงินบำรุงและเงินงบประมาณ
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#1687E8]"></div>
                        <span className="font-semibold text-gray-700">เงินบำรุง (UC)</span>
                      </div>
                      <span className="font-mono font-bold text-[#08294F]">62.4%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-teal-50/70">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-[#08A7A4]"></div>
                        <span className="font-semibold text-gray-700">ประกันสังคม (SSS)</span>
                      </div>
                      <span className="font-mono font-bold text-[#08294F]">18.6%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-purple-50/70">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="font-semibold text-gray-700">สวัสดิการข้าราชการ</span>
                      </div>
                      <span className="font-mono font-bold text-[#08294F]">12.5%</span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/70">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="font-semibold text-gray-700">เงินบริจาคพัฒนา</span>
                      </div>
                      <span className="font-mono font-bold text-[#08294F]">6.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RECEIVABLES (AR) */}
          {activeTab === 'AR' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="card-soft p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#08294F]">
                      ทะเบียนลูกหนี้และการเรียกเก็บเงิน (Accounts Receivable)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      ตัวอย่างข้อมูลจำลองการบันทึกลูกหนี้ สิทธิการรักษา และสถานะ Aging
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#1687E8] text-xs font-bold self-start">
                    แสดงข้อมูลจำลอง (Demo Rows)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#08294F] text-white">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">เลขที่เอกสาร</th>
                        <th className="p-2.5">ลูกหนี้ / สิทธิ</th>
                        <th className="p-2.5">คำอธิบาย</th>
                        <th className="p-2.5 text-right">จำนวนเงิน (บาท)</th>
                        <th className="p-2.5 text-center">อายุหนี้</th>
                        <th className="p-2.5 text-center rounded-r-lg">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AR-2569-000412</td>
                        <td className="p-2.5 font-semibold">สปสช. กทม. (UC-OPD)</td>
                        <td className="p-2.5 text-gray-600">ค่ารักษาผู้ป่วยนอก สิทธิบัตรทอง ประจำเดือน</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">4,250,000.00</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">14 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            ปกติ
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AR-2569-000413</td>
                        <td className="p-2.5 font-semibold">สำนักงานประกันสังคม ระยอง</td>
                        <td className="p-2.5 text-gray-600">ค่าบริการทางการแพทย์ผู้ป่วยใน ค่ารักษา High Cost</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">2,180,500.00</td>
                        <td className="p-2.5 text-center text-[#1687E8] font-bold">38 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            ติดตามงวด 1
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AR-2569-000414</td>
                        <td className="p-2.5 font-semibold">กรมบัญชีกลาง (CSMBS)</td>
                        <td className="p-2.5 text-gray-600">เบิกจ่ายตรงเงินสวัสดิการรักษาพยาบาลข้าราชการ</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">1,940,000.00</td>
                        <td className="p-2.5 text-center text-emerald-600 font-bold">22 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            ปกติ
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AR-2569-000398</td>
                        <td className="p-2.5 font-semibold">บริษัทประกันภัย พ.ร.บ. คุ้มครอง</td>
                        <td className="p-2.5 text-gray-600">ค่ารักษาพยาบาลอุบัติเหตุจราจรเคลมเอกสาร</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">450,200.00</td>
                        <td className="p-2.5 text-center text-rose-600 font-bold">96 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold">
                            เกิน 90 วัน
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAYABLES (AP) */}
          {activeTab === 'AP' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="card-soft p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h4 className="font-bold text-sm text-[#08294F]">
                      ทะเบียนเจ้าหนี้การค้าและกำหนดชำระเงิน (Accounts Payable)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      ตัวอย่างข้อมูลจำลองรายการเจ้าหนี้ค่ายา เวชภัณฑ์ และใบสั่งซื้อ PO
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-800 text-xs font-bold self-start">
                    คิวจ่ายเงินจำลอง (Simulated Queue)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#08294F] text-white">
                      <tr>
                        <th className="p-2.5 rounded-l-lg">เลขที่ AP / PO</th>
                        <th className="p-2.5">เจ้าหนี้ / บริษัทคู่ค้า</th>
                        <th className="p-2.5">รายการจัดซื้อ</th>
                        <th className="p-2.5 text-right">ยอดเงินรอจ่าย</th>
                        <th className="p-2.5 text-center">กำหนดชำระ</th>
                        <th className="p-2.5 text-center rounded-r-lg">สถานะอนุมัติ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AP-2569-000188</td>
                        <td className="p-2.5 font-semibold">องค์การเภสัชกรรม (GPO)</td>
                        <td className="p-2.5 text-gray-600">เวชภัณฑ์ยาจำเป็นประจำงวดไตรมาส</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">1,850,000.00</td>
                        <td className="p-2.5 text-center text-rose-600 font-bold">อีก 3 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            อนุมัติจ่ายแล้ว
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AP-2569-000189</td>
                        <td className="p-2.5 font-semibold">บริษัท สยามเมดิคอลเทค จำกัด</td>
                        <td className="p-2.5 text-gray-600">น้ำยาตรวจวิเคราะห์ทางห้องปฏิบัติการ Lab</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">920,000.00</td>
                        <td className="p-2.5 text-center text-gray-600 font-bold">อีก 14 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold">
                            รอตรวจรับของ
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="p-2.5 font-mono font-bold text-[#1687E8]">AP-2569-000190</td>
                        <td className="p-2.5 font-semibold">บริษัท ไบโอแล็บ เซอร์วิส จำกัด</td>
                        <td className="p-2.5 text-gray-600">สัญญาจ้างบำรุงรักษาเครื่องมือแพทย์รายปี</td>
                        <td className="p-2.5 font-mono font-bold text-right text-gray-800">650,000.00</td>
                        <td className="p-2.5 text-center text-gray-600 font-bold">อีก 28 วัน</td>
                        <td className="p-2.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold">
                            รอตัดงบประมาณ
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BUDGET & LOANS */}
          {activeTab === 'BUDGET' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Budget Control */}
                <div className="card-soft p-5">
                  <h4 className="font-bold text-sm text-[#08294F] mb-1">
                    การควบคุมวงเงินงบประมาณ (Budget Control Engine)
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-4">
                    ตรวจสอบวงเงินป้องกันงบติดลบแยกตามกลุ่มงาน
                  </p>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">กลุ่มงานบริการทางการแพทย์</span>
                        <span className="font-bold text-gray-700">ใช้ไป 78% (คงเหลือ ฿4.2M)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">กลุ่มงานเภสัชกรรมและคุ้มครอง</span>
                        <span className="font-bold text-gray-700">ใช้ไป 65% (คงเหลือ ฿6.1M)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">กลุ่มงานบริหารงานทั่วไป</span>
                        <span className="font-bold text-gray-700">ใช้ไป 84% (คงเหลือ ฿1.8M)</span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Government Loans */}
                <div className="card-soft p-5">
                  <h4 className="font-bold text-sm text-[#08294F] mb-1">
                    ระบบเงินยืมราชการ (Government Loans)
                  </h4>
                  <p className="text-[11px] text-gray-500 mb-4">
                    สัญญาเงินยืมทดรองและระบบแจ้งเตือนส่งใช้เงินยืม
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#08294F]">LN-69-0042 : จัดประชุมวิชาการ</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ส่งใช้แล้ว
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-1">
                        ผู้ยืม: พว.รัตนา วัฒนสุข • ยอดเงิน: ฿45,000.00
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-[#08294F]">LN-69-0045 : โครงการคัดกรองเบาหวาน</span>
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                          เหลือ 3 วัน
                        </span>
                      </div>
                      <div className="text-gray-500 text-[11px] mt-1">
                        ผู้ยืม: นพ.ธนา สิทธิรัตน์ • ยอดเงิน: ฿72,000.00
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="px-5 py-3.5 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-gray-500 flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>ระบบจำลอง (Simulation Mode) พร้อมใช้งานครบทุกฟังก์ชัน</span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
            >
              ปิดหน้าต่างจำลอง
            </button>
            <Link
              href="/login"
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบจริงสำหรับเจ้าหน้าที่</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

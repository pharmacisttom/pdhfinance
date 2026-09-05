'use client';

import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatThaiCurrency, formatThaiDate } from '@/lib/fiscal-year';

export default function ClosingPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmType, setConfirmType] = useState<'DAILY' | 'MONTHLY'>('DAILY');
  const [reopenReason, setReopenReason] = useState('');

  const fetchClosing = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cash-bank/closing');
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClosing();
  }, []);

  const handleAction = async () => {
    try {
      const res = await fetch('/api/cash-bank/closing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: confirmType === 'DAILY' ? 'DAILY_CLOSE' : 'MONTHLY_CLOSE',
          period: '2569-09',
          reason: reopenReason || 'ปิดยอดตามระเบียบการเงินการคลัง',
        }),
      });
      const json = await res.json();
      if (json.success) {
        alert(json.data.message);
        setShowConfirmModal(false);
        fetchClosing();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading || !data) {
    return <div className="p-8 text-center text-gray-500">กำลังโหลดข้อมูลการปิดยอด...</div>;
  }

  const { dailyClosing, monthlyPeriods } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
          <Lock className="w-5 h-5 text-[#1687E8]" />
          <span>การปิดยอดประจำวันและปิดงวดบัญชี (Daily & Monthly Closing)</span>
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          ปิดยอดการเงินประจำวัน และล็อกงวดบัญชีรายเดือนเพื่อป้องกันการแก้ไขข้อมูลย้อนหลังตามมาตรฐานธรรมาภิบาล
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Closing Section */}
        <div className="card-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#08294F]">
                  การปิดยอดการเงินประจำวัน (Daily Closing)
                </h3>
                <span className="text-xs text-gray-500">
                  ประจำวันที่ {formatThaiDate(new Date())}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1687E8] border border-blue-200">
                สถานะ: เปิดรับรายการ
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-6">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[11px] text-gray-500 block">ยอดยกมาต้นวัน</span>
                <span className="text-base font-bold text-[#08294F]">
                  {formatThaiCurrency(dailyClosing.openingBalance)} บาท
                </span>
              </div>
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-[11px] text-emerald-700 block">+ รวมรับเงินวันนี้</span>
                <span className="text-base font-bold text-emerald-700">
                  {formatThaiCurrency(dailyClosing.totalIncome)} บาท
                </span>
              </div>
              <div className="p-3.5 bg-red-50 rounded-xl border border-red-100">
                <span className="text-[11px] text-[#FF4664] block">- รวมจ่ายเงินวันนี้</span>
                <span className="text-base font-bold text-[#FF4664]">
                  {formatThaiCurrency(dailyClosing.totalExpense)} บาท
                </span>
              </div>
              <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-[11px] text-[#1687E8] block">= ยอดคงเหลือสิ้นวัน</span>
                <span className="text-base font-bold text-[#08294F]">
                  {formatThaiCurrency(dailyClosing.closingBalance)} บาท
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              * เมื่อกดปิดยอด รายการของวันนี้จะถูกตรวจสอบและสรุปรายงานสิ้นวัน
            </span>
            <button
              onClick={() => {
                setConfirmType('DAILY');
                setShowConfirmModal(true);
              }}
              className="px-5 py-2.5 bg-[#08294F] hover:bg-[#0D3768] text-white rounded-xl text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-[#08A7A4]" />
              <span>ยืนยันปิดยอดประจำวัน</span>
            </button>
          </div>
        </div>

        {/* Monthly Closing & Period Lock */}
        <div className="card-soft p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-[#08294F]">
                  การปิดงวดบัญชีประจำเดือน (Period Lock)
                </h3>
                <span className="text-xs text-gray-500">
                  ห้ามแก้ไขรายการในงวดที่ปิดแล้ว ยกเว้นได้รับอนุมัติจาก Admin / CFO
                </span>
              </div>
            </div>

            <div className="space-y-3 my-6">
              {monthlyPeriods.map((period: any, idx: number) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    period.isClosed
                      ? 'bg-gray-50/80 border-gray-200'
                      : 'bg-blue-50/50 border-blue-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        period.isClosed ? 'bg-gray-200 text-gray-700' : 'bg-[#1687E8] text-white'
                      }`}
                    >
                      {period.isClosed ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#08294F]">{period.period}</div>
                      <div className="text-[10px] text-gray-500">
                        {period.isClosed
                          ? `ปิดงวดแล้วเมื่อ: ${period.closedAt} โดย ${period.closedBy}`
                          : 'งวดปัจจุบัน (ยังไม่ปิดงวด)'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {period.isClosed ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-200 text-gray-700">
                        LOCKED
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmType('MONTHLY');
                          setShowConfirmModal(true);
                        }}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#08294F] text-white hover:bg-[#0D3768] transition-all"
                      >
                        ปิดงวดบัญชีนี้
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center space-x-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>ทุกการเปิด-ปิดงวดจะถูกบันทึกใน Audit Trail พร้อม IP Address อัตโนมัติ</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#08294F] mb-1">
              ยืนยันการ{confirmType === 'DAILY' ? 'ปิดยอดประจำวัน' : 'ปิดงวดบัญชีประจำเดือน'}?
            </h3>
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              {confirmType === 'DAILY'
                ? 'คุณต้องการสรุปยอดรายรับ-รายจ่ายของวันนี้ และบันทึกประวัติการปิดยอดใช่หรือไม่?'
                : 'เมื่อปิดงวดบัญชีแล้ว จะไม่อนุญาตให้แก้ไขหรือลบเอกสารทางการเงินในงวดนี้ เว้นแต่จะทำการปลดล็อกโดย CFO/Admin พร้อมระบุเหตุผล'}
            </p>

            {confirmType === 'MONTHLY' && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  หมายเหตุ / เหตุผลในการดำเนินการ
                </label>
                <textarea
                  rows={2}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="ระบุหมายเหตุการปิดงวด..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                />
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleAction}
                className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
              >
                ยืนยันการทำรายการ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

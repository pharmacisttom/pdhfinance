'use client';

import React, { useState, useEffect } from 'react';
import {
  Wallet,
  PlusCircle,
  Building,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Search,
  Landmark,
} from 'lucide-react';
import { formatThaiCurrency, maskAccountNumber } from '@/lib/fiscal-year';

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFullAccount, setShowFullAccount] = useState<Record<string, boolean>>({});

  // New Account Form state
  const [bankCode, setBankCode] = useState('KTB');
  const [bankName, setBankName] = useState('ธนาคารกรุงไทย');
  const [branch, setBranch] = useState('สาขาศูนย์ราชการ');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('CURRENT');
  const [openingBalance, setOpeningBalance] = useState('');

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cash-bank/accounts');
      const json = await res.json();
      if (json.success) {
        setAccounts(json.data.accounts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/cash-bank/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bankCode,
          bankName,
          branch,
          accountName,
          accountNumber,
          accountType,
          openingBalance,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowAddModal(false);
        fetchAccounts();
        setAccountName('');
        setAccountNumber('');
        setOpeningBalance('');
      } else {
        alert(json.error?.message || 'เกิดข้อผิดพลาด');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const totalBalance = accounts.reduce((sum, a) => sum + a.currentBalance, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-[#1687E8]" />
            <span>ทะเบียนบัญชีเงินฝากธนาคาร (Bank Accounts)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            จัดการบัญชีเงินบำรุง เงินบริจาค และกองทุนโรงพยาบาล พร้อม Masking เลขที่บัญชีเพื่อความปลอดภัย
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-[#08294F] hover:bg-[#0D3768] text-white text-xs font-semibold shadow-md flex items-center space-x-1.5 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#08A7A4]" />
            <span>เพิ่มบัญชีธนาคาร</span>
          </button>
        </div>
      </div>

      {/* Summary Total Card */}
      <div className="card-soft p-6 bg-gradient-to-r from-[#08294F] via-[#0D3768] to-[#1687E8] text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs text-blue-200 font-medium uppercase tracking-wider block">
            ยอดรวมเงินฝากทุกบัญชี (Total Bank Balances)
          </span>
          <div className="text-2xl sm:text-3xl font-bold mt-1">
            {formatThaiCurrency(totalBalance)} <span className="text-sm font-normal text-blue-200">บาท</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-xs text-blue-100">
          <div className="px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-xs border border-white/10">
            จำนวน {accounts.length} บัญชีเปิดใช้งาน
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/20 font-medium">
            ✓ ข้อมูลพร้อมกระทบยอด
          </div>
        </div>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accounts.map((acc) => {
          const isFull = showFullAccount[acc.id];
          return (
            <div
              key={acc.id}
              className="card-soft p-6 flex flex-col justify-between hover:border-[#1687E8] transition-all relative group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#08294F] flex items-center justify-center font-bold text-xs border border-blue-100">
                      {acc.bankCode}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#08294F] leading-tight">
                        {acc.bankName}
                      </div>
                      <div className="text-xs text-gray-500">{acc.branch}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    เปิดใช้งาน
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <div>
                    <span className="text-[11px] text-gray-400 block">ชื่อบัญชี</span>
                    <span className="text-xs font-semibold text-gray-800 line-clamp-1">
                      {acc.accountName}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 block">เลขที่บัญชี</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-gray-700">
                        {isFull ? acc.accountNumber : maskAccountNumber(acc.accountNumber)}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setShowFullAccount((prev) => ({ ...prev, [acc.id]: !isFull }))
                        }
                        className="text-[10px] text-[#1687E8] hover:underline"
                      >
                        {isFull ? 'ซ่อน' : 'แสดง'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-gray-400 block">ประเภทย่อย</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {acc.accountType === 'CURRENT' ? 'กระแสรายวัน (Current)' : 'ออมทรัพย์ (Savings)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block">ยอดคงเหลือปัจจุบัน</span>
                  <span className="text-base font-bold text-[#08294F]">
                    {formatThaiCurrency(acc.currentBalance)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">ยอดยกมา</span>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatThaiCurrency(acc.openingBalance)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bank Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-[#08294F] mb-1 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5 text-[#1687E8]" />
              <span>เพิ่มทะเบียนบัญชีเงินฝากธนาคาร</span>
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              บันทึกข้อมูลสมุดบัญชีธนาคารสำหรับเชื่อมโยงการรับ-จ่ายเงินของโรงพยาบาล
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ธนาคาร
                  </label>
                  <select
                    value={bankCode}
                    onChange={(e) => {
                      setBankCode(e.target.value);
                      if (e.target.value === 'KTB') setBankName('ธนาคารกรุงไทย');
                      if (e.target.value === 'SCB') setBankName('ธนาคารไทยพาณิชย์');
                      if (e.target.value === 'BBL') setBankName('ธนาคารกรุงเทพ');
                      if (e.target.value === 'KBANK') setBankName('ธนาคารกสิกรไทย');
                      if (e.target.value === 'GSB') setBankName('ธนาคารออมสิน');
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="KTB">KTB - ธนาคารกรุงไทย</option>
                    <option value="SCB">SCB - ธนาคารไทยพาณิชย์</option>
                    <option value="BBL">BBL - ธนาคารกรุงเทพ</option>
                    <option value="KBANK">KBANK - ธนาคารกสิกรไทย</option>
                    <option value="GSB">GSB - ธนาคารออมสิน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    สาขา
                  </label>
                  <input
                    type="text"
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                    placeholder="เช่น สาขาศูนย์ราชการ"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ชื่อบัญชี
                </label>
                <input
                  type="text"
                  required
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  placeholder="เช่น โรงพยาบาลศูนย์ - เงินบำรุง"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    เลขที่บัญชี
                  </label>
                  <input
                    type="text"
                    required
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                    placeholder="เช่น 0121234567"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    ประเภทบัญชี
                  </label>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  >
                    <option value="CURRENT">กระแสรายวัน (Current)</option>
                    <option value="SAVINGS">ออมทรัพย์ (Savings)</option>
                    <option value="FIXED">ประจำ (Fixed)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  ยอดยกมาเริ่มต้น (บาท)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#1687E8]"
                  placeholder="0.00"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#08294F] text-white rounded-xl text-xs font-semibold hover:bg-[#0D3768] shadow-md"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

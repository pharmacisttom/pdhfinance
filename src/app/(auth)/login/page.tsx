'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Landmark,
  Lock,
  User,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Building,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('pdhfinance10832');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 5, num2: 3 });
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate CAPTCHA if failed attempts >= 3
    if (failedAttempts >= 3) {
      if (parseInt(captchaAnswer, 10) !== captchaChallenge.num1 + captchaChallenge.num2) {
        setError('รหัสยืนยันความปลอดภัย (CAPTCHA) ไม่ถูกต้อง');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 3) {
          // Generate new captcha challenge
          setCaptchaChallenge({
            num1: Math.floor(Math.random() * 8) + 2,
            num2: Math.floor(Math.random() * 8) + 1,
          });
        }
        throw new Error(result.error?.message || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (userType: 'admin' | 'cfo' | 'finance' | 'budget' | 'auditor') => {
    setUsername(userType);
    setPassword(userType === 'admin' ? 'pdhfinance10832' : 'password123');
    setError(null);
    setFailedAttempts(0);
    setCaptchaAnswer('');
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="flex justify-center">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#08294F] via-[#0D3768] to-[#1687E8] flex items-center justify-center shadow-xl shadow-[#08294F]/20 group-hover:scale-105 transition-transform">
              <Landmark className="w-8 h-8 text-white" />
            </div>
          </Link>
        </div>

        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-[#08294F]">
          FINANCE CONTROL PLATFORM
        </h2>
        <p className="mt-1 text-center text-sm text-gray-600">
          ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม
        </p>
        <div className="mt-2 text-center inline-flex items-center justify-center w-full space-x-1 text-xs text-blue-700 font-medium">
          <Building className="w-3.5 h-3.5" />
          <span>หน่วยงานการเงินและบัญชี โรงพยาบาลศูนย์</span>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-2xl border border-gray-200/80 shadow-soft-lg">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 rounded-xl bg-[#FFF0F2] border border-[#FF4664]/30 text-[#FF4664] text-sm flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-[#08294F] mb-1.5">
                ชื่อผู้ใช้งาน หรือ อีเมล (Username / Email)
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <User className="h-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1687E8] focus:border-transparent transition-all outline-none"
                  placeholder="เช่น admin, cfo, finance หรือ email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-semibold text-[#08294F]">
                  รหัสผ่าน (Password)
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-[#1687E8] hover:text-[#0D3768] hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-[#1687E8] focus:border-transparent transition-all outline-none"
                  placeholder="กรอกรหัสผ่าน"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 h-5" /> : <Eye className="h-5 h-5" />}
                </button>
              </div>
            </div>

            {/* CAPTCHA Challenge if failed >= 3 */}
            {failedAttempts >= 3 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                <label className="block text-xs font-bold text-amber-800 mb-1">
                  การยืนยันความปลอดภัย (ระบบตรวจพบการล็อกอินผิดหลายครั้ง)
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {captchaChallenge.num1} + {captchaChallenge.num2} = ?
                  </span>
                  <input
                    type="number"
                    required
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    placeholder="ผลลัพธ์"
                    className="w-24 px-3 py-1.5 border border-amber-300 rounded-lg text-sm bg-white outline-none"
                  />
                </div>
              </div>
            )}

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1687E8] focus:ring-[#1687E8] border-gray-300"
                />
                <span>จดจำการเข้าสู่ระบบ (Remember me)</span>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-[#08294F]/20 text-sm font-semibold text-white bg-gradient-to-r from-[#08294F] via-[#0D3768] to-[#1687E8] hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1687E8] disabled:opacity-50 transition-all"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ (Sign in)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-500 mb-3 flex items-center justify-between">
              <span>เลือกสิทธิ์ทดสอบระบบ (Demo Accounts):</span>
              <span className="text-[11px] text-[#08A7A4] font-normal">รหัสผ่าน: password123</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('cfo')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'cfo' ? 'bg-blue-50 border-[#1687E8] text-[#08294F] font-semibold' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-bold">CFO (ผอ.การเงิน)</div>
                <div className="text-[11px] text-gray-500">cfo / อนุมัติทุกรายการ</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'admin' ? 'bg-blue-50 border-[#1687E8] text-[#08294F] font-semibold' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-bold">Super Admin</div>
                <div className="text-[11px] text-gray-500">admin / pdhfinance10832</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('finance')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'finance' ? 'bg-blue-50 border-[#1687E8] text-[#08294F] font-semibold' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-bold">เจ้าหน้าที่การเงิน</div>
                <div className="text-[11px] text-gray-500">finance / ลูกหนี้ เจ้าหนี้ ยืมเงิน</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('budget')}
                className={`p-2 rounded-lg border text-left transition-all ${
                  username === 'budget' ? 'bg-blue-50 border-[#1687E8] text-[#08294F] font-semibold' : 'bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700'
                }`}
              >
                <div className="font-bold">เจ้าหน้าที่งบประมาณ</div>
                <div className="text-[11px] text-gray-500">budget / จัดสรรงบ ควบคุมงบ</div>
              </button>
            </div>
          </div>
        </div>

        {/* Security & PDPA notice */}
        <div className="mt-6 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#08A7A4]" />
          <span>ระบบรักษาความปลอดภัยตามมาตรฐาน PDPA & OWASP</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#08294F] mb-2">ลืมรหัสผ่าน (Forgot Password)</h3>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              กรุณาติดต่อผู้ดูแลระบบศูนย์เทคโนโลยีสารสนเทศ หรือส่งคำร้องขอรีเซ็ตรหัสผ่านไปยังกลุ่มงานการเงินและบัญชี
              โทรภายใน: 1104 หรืออีเมล: <span className="font-semibold text-blue-600">admin@hospital.moph.go.th</span>
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 bg-[#08294F] text-white rounded-xl text-sm font-semibold hover:bg-[#0D3768]"
              >
                รับทราบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

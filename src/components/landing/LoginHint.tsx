'use client';

import React from 'react';
import { Lock, Sparkles, Touchpad } from 'lucide-react';

export default function LoginHint() {
  return (
    <div className="w-full max-w-md mx-auto text-center px-4 mt-2 sm:mt-4 z-10 transition-all duration-300">
      {/* Mobile Hint (Touch screen) */}
      <div className="inline-flex sm:hidden items-center justify-center space-x-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-cyan-200/80 shadow-sm text-xs text-[#08294F] font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>แตะโลโก้โรงพยาบาลเพื่อเข้าสู่ระบบ</span>
      </div>

      {/* Desktop / Tablet Hint */}
      <div className="hidden sm:inline-flex items-center justify-center space-x-2.5 px-5 py-2 rounded-full bg-white/70 backdrop-blur-md border border-cyan-100 shadow-sm text-xs text-gray-600">
        <Lock className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
        <span className="font-medium text-[#08294F]">คลิกตราสัญลักษณ์โรงพยาบาลเพื่อเข้าสู่ระบบ</span>
        <span className="text-gray-300">•</span>
        <span className="text-[11px] font-semibold text-cyan-700 tracking-wider">CLICK EMBLEM TO LOGIN</span>
      </div>
    </div>
  );
}

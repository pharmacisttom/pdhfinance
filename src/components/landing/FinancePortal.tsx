'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Info, ArrowRight } from 'lucide-react';
import HospitalLoginHotspot from './HospitalLoginHotspot';
import LoginHint from './LoginHint';

// Development Debug Hotspot switch: set to true to visualize bounding circle
const DEBUG_HOTSPOT = false;

export default function FinancePortal() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 400ms fade-in trigger on page load
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 overflow-hidden bg-gradient-to-br from-white via-cyan-50/40 to-blue-50/50 select-none">
      
      {/* Soft, harmonious radial ambient lighting tuned to emblem colors (cyan & deep teal) */}
      <div 
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_75%_75%_at_50%_48%,rgba(8,167,164,0.08)_0%,rgba(22,135,232,0.04)_40%,transparent_75%)]" 
        aria-hidden="true" 
      />

      {/* Top Header Branding & Quick Overview Link */}
      <header className="w-full max-w-5xl mx-auto z-10 pt-2 sm:pt-4 flex items-center justify-between px-2 sm:px-4">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-cyan-200/60 shadow-sm text-xs font-semibold text-[#08294F]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#08A7A4]" />
          <span>กลุ่มงานการเงินและบัญชี โรงพยาบาลปลวกแดง</span>
        </div>

        <Link
          href="/overview"
          className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white border border-cyan-200/70 shadow-sm text-xs font-semibold text-[#08294F] hover:text-[#1687E8] transition-all hover:scale-105 backdrop-blur-sm"
          title="ดูรายละเอียดแนะนำระบบเบื้องต้น"
        >
          <Info className="w-3.5 h-3.5 text-[#08A7A4]" />
          <span>แนะนำระบบเบื้องต้น</span>
          <span className="text-[#1687E8] font-bold">&rarr;</span>
        </Link>
      </header>

      {/* Central Visual Showcase (Main pdh.png with Interactive Hospital Logo Hotspot) */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-auto py-2">
        {/* Harmonious Oval Glow Behind the Emblem */}
        <div className="relative flex items-center justify-center">
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-cyan-400/15 via-emerald-300/10 to-transparent blur-2xl pointer-events-none" 
            aria-hidden="true" 
          />

          <div
            style={{
              width: 'min(78vh, 850px)',
              maxWidth: '100%',
            }}
            className={`
              relative
              aspect-square
              w-[90vw]
              max-w-[500px]
              sm:w-[min(70vh,700px)]
              sm:max-w-[700px]
              lg:w-[min(78vh,850px)]
              lg:max-w-[850px]
              transition-all
              duration-500
              ease-out
              ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}
            `}
          >
            {/* Main Hospital Finance Artwork: Transparent PNG with Organic Contour Drop Shadow */}
            <Image
              src="/img/pdh.png"
              alt="แผนกการเงิน โรงพยาบาลปลวกแดง"
              fill
              priority
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 70vh, 78vh"
              className="object-contain pointer-events-none drop-shadow-[0_15px_30px_rgba(8,41,79,0.12)]"
            />

            {/* Interactive Hospital Logo Hotspot (Calibrated to Central Circular Emblem) */}
            <HospitalLoginHotspot debug={DEBUG_HOTSPOT} />
          </div>
        </div>

        {/* User Guidance Hint */}
        <LoginHint />

        {/* Button for visitors interested in system overview */}
        <div className="mt-3 sm:mt-4 z-10">
          <Link
            href="/overview"
            className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-white/95 hover:bg-white text-xs font-semibold text-[#08294F] hover:text-[#1687E8] shadow-sm hover:shadow-md border border-cyan-200/80 transition-all duration-200 backdrop-blur-md group hover:scale-105"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#08A7A4] group-hover:scale-110 transition-transform animate-pulse" />
            <span>สำหรับผู้สนใจ: แนะนำระบบเบื้องต้น &amp; ชมตัวอย่างหน้าตาระบบ</span>
            <span className="text-[#08A7A4] font-bold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Official Bottom Tagline */}
      <footer className="w-full text-center z-10 pb-2 sm:pb-3">
        <div className="text-[11px] sm:text-xs text-gray-500 font-medium flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
          <span>โรงพยาบาลปลวกแดง • แผนกการเงิน (PLUAKDAENG HOSPITAL)</span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span className="font-semibold text-cyan-800 bg-white/80 px-2 py-0.5 rounded border border-cyan-200/70">
            Version 2026.09.05
          </span>
          <span className="hidden sm:inline text-gray-300">•</span>
          <span>ระบบนี้พัฒนาโดย Tomvis และสงวนสิทธิ์ทางกฎหมาย</span>
        </div>
      </footer>
    </main>
  );
}

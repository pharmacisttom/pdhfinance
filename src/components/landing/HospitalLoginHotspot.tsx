'use client';

import React from 'react';
import Link from 'next/link';
import { MousePointerClick, ShieldCheck } from 'lucide-react';

interface HospitalLoginHotspotProps {
  debug?: boolean;
}

export default function HospitalLoginHotspot({ debug = false }: HospitalLoginHotspotProps) {
  return (
    <>
      {/* Dynamic Keyframes for Attention Animation (runs 2 times on load, then stops) */}
      <style jsx global>{`
        @keyframes attentionPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
          }
          40% {
            box-shadow: 0 0 28px 8px rgba(6, 182, 212, 0.55), inset 0 0 15px rgba(6, 182, 212, 0.3);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(6, 182, 212, 0);
          }
        }

        .attention-pulse-init {
          animation: attentionPulse 1.6s cubic-bezier(0.4, 0, 0.2, 1) 2 forwards;
        }

        @media (prefers-reduced-motion: reduce) {
          .attention-pulse-init {
            animation: none !important;
          }
        }
      `}</style>

      {/* Hotspot Link Overlay */}
      <Link
        href="/login"
        role="button"
        tabIndex={0}
        aria-label="เข้าสู่ระบบการเงิน โรงพยาบาลปลวกแดง"
        style={{
          top: '46.7%',
          left: '50.0%',
          width: '30%',
          height: '30%',
          transform: 'translate(-50%, -50%)',
        }}
        className={`
          absolute
          rounded-full
          cursor-pointer
          select-none
          group
          transition-all
          duration-300
          ease-out
          attention-pulse-init
          focus-visible:outline-none
          focus-visible:ring-4
          focus-visible:ring-cyan-400
          focus-visible:ring-offset-4
          focus-visible:ring-offset-white
          hover:scale-[1.03]
          hover:ring-4
          hover:ring-cyan-300/80
          hover:shadow-[0_0_45px_rgba(6,182,212,0.65)]
          ${debug ? 'border-[3px] border-red-500 bg-red-500/25 shadow-lg' : 'bg-transparent'}
        `}
      >
        {/* Subtle hover pulse aura inside the emblem */}
        <span className="absolute inset-0 rounded-full bg-cyan-400/0 group-hover:bg-cyan-400/10 transition-colors duration-300 pointer-events-none" />

        {/* Small floating pointer indicator hint (Desktop) */}
        <span className="absolute -bottom-2 -right-2 hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-[#08294F] text-cyan-300 shadow-md border border-cyan-400/40 opacity-75 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none">
          <MousePointerClick className="w-4 h-4" />
        </span>

        {/* Floating Tooltip positioned below the Logo */}
        <div
          role="tooltip"
          className="
            absolute
            top-[103%]
            left-1/2
            -translate-x-1/2
            pt-2
            pointer-events-none
            opacity-0
            translate-y-2
            group-hover:opacity-100
            group-hover:translate-y-0
            group-focus-visible:opacity-100
            group-focus-visible:translate-y-0
            transition-all
            duration-200
            ease-out
            z-30
            whitespace-nowrap
          "
        >
          <div className="relative bg-[#08294F]/95 backdrop-blur-md text-white px-4 py-2 rounded-xl shadow-2xl border border-cyan-400/40 text-center">
            {/* Tooltip top arrow */}
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#08294F] border-t border-l border-cyan-400/40 transform rotate-45" />

            <div className="relative flex items-center space-x-1.5 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <div className="text-xs font-bold text-white tracking-wide">
                คลิกเพื่อเข้าสู่ระบบ
              </div>
            </div>
            <div className="text-[10px] font-medium tracking-widest text-cyan-200/90 uppercase mt-0.5">
              CLICK TO LOGIN
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}

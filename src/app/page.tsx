import React from 'react';
import type { Metadata } from 'next';
import FinancePortal from '@/components/landing/FinancePortal';

export const metadata: Metadata = {
  title: 'แผนกการเงิน โรงพยาบาลปลวกแดง | PLUAKDAENG HOSPITAL FINANCE',
  description: 'ระบบบริหารการเงินและบัญชี โรงพยาบาลปลวกแดง (Finance Management System, Pluakdaeng Hospital)',
};

export default function HomePage() {
  return <FinancePortal />;
}

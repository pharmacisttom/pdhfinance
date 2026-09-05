import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FINANCE CONTROL PLATFORM - ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม',
  description: 'ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม กลุ่มงานการเงินและบัญชี โรงพยาบาลปลวกแดง',
  icons: {
    icon: '/img/pdh.png',
    apple: '/img/pdh.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-[#F5F8FC] text-[#08294F]">
        {children}
      </body>
    </html>
  );
}

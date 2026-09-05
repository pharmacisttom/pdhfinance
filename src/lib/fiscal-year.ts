/**
 * Thai Fiscal Year & Date Utilities
 * 
 * Thai Fiscal Year starts on October 1st of previous calendar year 
 * and ends on September 30th of the fiscal year.
 * Example: FY 2569 = Oct 1, 2025 (2568 BE) to Sep 30, 2026 (2569 BE)
 */

export function getThaiFiscalYear(date: Date = new Date()): number {
  const month = date.getMonth(); // 0 = Jan, 9 = Oct
  const gregorianYear = date.getFullYear();
  const thaiYear = gregorianYear + 543;
  
  // If month is Oct (9), Nov (10), Dec (11), it belongs to next fiscal year
  if (month >= 9) {
    return thaiYear + 1;
  }
  return thaiYear;
}

export function getFiscalYearDateRange(fiscalYearBE: number): { startDate: Date; endDate: Date } {
  const gregorianFY = fiscalYearBE - 543;
  const startDate = new Date(gregorianFY - 1, 9, 1, 0, 0, 0); // Oct 1 of previous Gregorian year
  const endDate = new Date(gregorianFY, 8, 30, 23, 59, 59, 999); // Sep 30 of Gregorian FY year
  return { startDate, endDate };
}

export function formatThaiDate(date: Date | string | null | undefined, options?: { showTime?: boolean; shortMonth?: boolean }): string {
  if (!date) return '-';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '-';

  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear() + 543;

  const thaiMonthsFull = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const thaiMonthsShort = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const monthName = options?.shortMonth ? thaiMonthsShort[month] : thaiMonthsFull[month];
  let formatted = `${day} ${monthName} ${year}`;

  if (options?.showTime) {
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    formatted += ` ${hours}:${minutes} น.`;
  }

  return formatted;
}

export function formatThaiCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(Number(amount))) return '0.00';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

export interface AgingBucket {
  category: 'CURRENT' | '1_30' | '31_60' | '61_90' | 'OVER_90';
  label: string;
  daysOverdue: number;
}

export function calculateAging(dueDate: Date | string): AgingBucket {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const now = new Date();
  
  // Set both to start of day for accurate day calculation
  due.setHours(0, 0, 0, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { category: 'CURRENT', label: 'ยังไม่เกินกำหนด (Current)', daysOverdue: 0 };
  } else if (diffDays <= 30) {
    return { category: '1_30', label: '1 - 30 วัน', daysOverdue: diffDays };
  } else if (diffDays <= 60) {
    return { category: '31_60', label: '31 - 60 วัน', daysOverdue: diffDays };
  } else if (diffDays <= 90) {
    return { category: '61_90', label: '61 - 90 วัน', daysOverdue: diffDays };
  } else {
    return { category: 'OVER_90', label: 'เกิน 90 วัน', daysOverdue: diffDays };
  }
}

export function maskAccountNumber(accNumber: string | null | undefined): string {
  if (!accNumber) return '-';
  const clean = accNumber.replace(/\D/g, '');
  if (clean.length < 10) return accNumber;
  return `xxx-x-${clean.slice(4, 9)}-${clean.slice(-1)}`;
}

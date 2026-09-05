import { getThaiFiscalYear, calculateAging } from './fiscal-year';
import bcrypt from 'bcryptjs';

// Realistic Enterprise Data Store
export interface DbDepartment {
  id: string;
  code: string;
  name: string;
  type: string;
  isActive: boolean;
}

export interface DbFund {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export interface DbBankAccount {
  id: string;
  bankCode: string;
  bankName: string;
  branch: string;
  accountName: string;
  accountNumber: string;
  accountType: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export interface DbBankTransaction {
  id: string;
  bankAccountId: string;
  transactionDate: string;
  transactionType: 'INCOME' | 'EXPENSE' | 'TRANSFER';
  documentNo?: string;
  referenceNo?: string;
  description: string;
  amount: number;
  balanceAfter: number;
  source?: string;
  departmentId?: string;
  createdById?: string;
  createdAt: string;
}

export interface DbBankStatement {
  id: string;
  bankAccountId: string;
  statementDate: string;
  valueDate?: string;
  description: string;
  referenceNo?: string;
  debitAmount: number;
  creditAmount: number;
  balance: number;
  status: 'UNMATCHED' | 'MATCHED' | 'ADJUSTED';
  matchedTxId?: string;
  importedAt: string;
}

export interface DbReceivable {
  id: string;
  receivableNo: string;
  documentNo?: string;
  debtorId: string;
  debtorName: string;
  departmentId?: string;
  category: string;
  billDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: 'OPEN' | 'PARTIAL' | 'OVERDUE' | 'PAID' | 'WRITEOFF';
  description?: string;
  createdAt: string;
}

export interface DbReceivablePayment {
  id: string;
  receiptNo: string;
  receivableId: string;
  paymentDate: string;
  amount: number;
  bankAccountId: string;
  referenceNo?: string;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

export interface DbPayable {
  id: string;
  payableNo: string;
  documentNo?: string;
  vendorId: string;
  vendorName: string;
  departmentId?: string;
  fundId?: string;
  budgetId?: string;
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  balance: number;
  status: 'PENDING_DOCUMENT' | 'READY_TO_PAY' | 'WAITING_APPROVAL' | 'APPROVED' | 'PAID' | 'OVERDUE';
  description?: string;
  approvedById?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface DbCommitment {
  id: string;
  commitmentNo: string;
  sourceDocument: string;
  departmentId?: string;
  departmentName?: string;
  vendorId?: string;
  vendorName?: string;
  description: string;
  amount: number;
  expectedPaymentDate: string;
  status: 'ACTIVE' | 'LIQUIDATED' | 'CANCELLED';
  createdAt: string;
}

export interface DbGovernmentLoan {
  id: string;
  loanNo: string;
  borrowerCode: string;
  borrowerName: string;
  departmentId?: string;
  departmentName?: string;
  purpose: string;
  requestDate: string;
  approveDate?: string;
  paymentDate?: string;
  dueDate: string;
  amount: number;
  returnedAmount: number;
  balance: number;
  status: 'DRAFT' | 'SUBMITTED' | 'REVIEWED' | 'APPROVED' | 'PAID' | 'OUTSTANDING' | 'RETURNED' | 'CLEARED' | 'CLOSED';
  createdAt: string;
}

export interface DbLoanClearance {
  id: string;
  clearanceNo: string;
  loanId: string;
  loanNo: string;
  clearanceDate: string;
  expenseAmount: number;
  cashReturn: number;
  additionalPayment: number;
  documentReference?: string;
  notes?: string;
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface DbBudget {
  id: string;
  fiscalYear: number;
  fundId: string;
  fundName: string;
  departmentId: string;
  departmentName: string;
  budgetCodeId: string;
  budgetCode: string;
  budgetName: string;
  allocated: number;
  adjustment: number;
  committed: number;
  spent: number;
  available: number;
}

export interface DbRevenueTransaction {
  id: string;
  revenueDate: string;
  fundId: string;
  fundName: string;
  source: string;
  departmentId?: string;
  documentNo?: string;
  amount: number;
  description: string;
  bankAccountId?: string;
  createdAt: string;
}

export interface DbAuditLog {
  id: string;
  userId?: string;
  username: string;
  role?: string;
  action: string;
  module: string;
  entity: string;
  entityId?: string;
  beforeData?: any;
  afterData?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface DbNotification {
  id: string;
  userId?: string;
  title: string;
  message: string;
  category: 'RECEIVABLE' | 'PAYABLE' | 'LOAN' | 'BUDGET' | 'APPROVAL' | 'BANK_REC' | 'SYSTEM';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// In-Memory Master Store instance for high performance and fallback
class EnterpriseDataStore {
  departments: DbDepartment[] = [
    { id: 'dept-1', code: 'MED', name: 'กลุ่มงานอายุรกรรม', type: 'MEDICAL', isActive: true },
    { id: 'dept-2', code: 'SURG', name: 'กลุ่มงานศัลยกรรม', type: 'MEDICAL', isActive: true },
    { id: 'dept-3', code: 'PED', name: 'กลุ่มงานกุมารเวชกรรม', type: 'MEDICAL', isActive: true },
    { id: 'dept-4', code: 'PHARM', name: 'กลุ่มงานเภสัชกรรม', type: 'MEDICAL', isActive: true },
    { id: 'dept-5', code: 'FIN', name: 'กลุ่มงานการเงินและบัญชี', type: 'FINANCE', isActive: true },
    { id: 'dept-6', code: 'PLAN', name: 'กลุ่มงานยุทธศาสตร์และงบประมาณ', type: 'ADMINISTRATION', isActive: true },
    { id: 'dept-7', code: 'ADMIN', name: 'กลุ่มงานบริหารทั่วไป', type: 'ADMINISTRATION', isActive: true },
    { id: 'dept-8', code: 'ICU', name: 'กลุ่มงานผู้ป่วยวิกฤต (ICU)', type: 'MEDICAL', isActive: true },
  ];

  funds: DbFund[] = [
    { id: 'fund-1', code: 'UC01', name: 'เงินบำรุงโรงพยาบาล (UC)', description: 'รายได้จากการจัดบริการสุขภาพถ้วนหน้า', isActive: true },
    { id: 'fund-2', code: 'SSS02', name: 'กองทุนประกันสังคม', description: 'เงินชดเชยค่าบริการทางการแพทย์ประกันสังคม', isActive: true },
    { id: 'fund-3', code: 'CSMBS03', name: 'กองทุนสวัสดิการข้าราชการ', description: 'เงินชดเชยค่ารักษาพยาบาลข้าราชการ', isActive: true },
    { id: 'fund-4', code: 'DON04', name: 'เงินบริจาคพัฒนาโรงพยาบาล', description: 'เงินบริจาคเพื่อจัดซื้ออุปกรณ์และอาคาร', isActive: true },
    { id: 'fund-5', code: 'GOV05', name: 'งบประมาณแผ่นดิน', description: 'งบจัดสรรจากกระทรวงสาธารณสุข', isActive: true },
  ];

  bankAccounts: DbBankAccount[] = [
    {
      id: 'bank-1',
      bankCode: 'KTB',
      bankName: 'ธนาคารกรุงไทย',
      branch: 'สาขาศูนย์ราชการ / รพ.',
      accountName: 'โรงพยาบาลศูนย์ - บัญชีเงินบำรุง',
      accountNumber: '0121234567',
      accountType: 'CURRENT',
      openingBalance: 45000000.00,
      currentBalance: 52480350.00,
      isActive: true,
    },
    {
      id: 'bank-2',
      bankCode: 'SCB',
      bankName: 'ธนาคารไทยพาณิชย์',
      branch: 'สาขาศูนย์การแพทย์',
      accountName: 'โรงพยาบาลศูนย์ - เงินรับบริจาค',
      accountNumber: '4052987654',
      accountType: 'SAVINGS',
      openingBalance: 12500000.00,
      currentBalance: 14820000.00,
      isActive: true,
    },
    {
      id: 'bank-3',
      bankCode: 'BBL',
      bankName: 'ธนาคารกรุงเทพ',
      branch: 'สาขาหลักเมือง',
      accountName: 'โรงพยาบาลศูนย์ - กองทุนวิจัยและพัฒนา',
      accountNumber: '1284567890',
      accountType: 'SAVINGS',
      openingBalance: 6000000.00,
      currentBalance: 7150000.00,
      isActive: true,
    },
  ];

  bankTransactions: DbBankTransaction[] = [
    {
      id: 'btx-1',
      bankAccountId: 'bank-1',
      transactionDate: '2026-09-04T10:30:00.000Z',
      transactionType: 'INCOME',
      documentNo: 'RV-2569-000042',
      referenceNo: 'KTB-TRANS-98124',
      description: 'รับเงินชดเชยค่ารักษาพยาบาล IPD สปสช. ประจำงวด',
      amount: 4500000.00,
      balanceAfter: 52480350.00,
      source: 'REVENUE',
      departmentId: 'dept-5',
      createdAt: '2026-09-04T10:30:00.000Z',
    },
    {
      id: 'btx-2',
      bankAccountId: 'bank-1',
      transactionDate: '2026-09-03T14:15:00.000Z',
      transactionType: 'EXPENSE',
      documentNo: 'PV-2569-000088',
      referenceNo: 'KTB-PAY-11029',
      description: 'จ่ายชำระหนี้ค่ายาและเวชภัณฑ์ บริษัท สยามเภสัชเวชภัณฑ์ จำกัด',
      amount: 1280000.00,
      balanceAfter: 47980350.00,
      source: 'PAYABLE',
      departmentId: 'dept-4',
      createdAt: '2026-09-03T14:15:00.000Z',
    },
    {
      id: 'btx-3',
      bankAccountId: 'bank-2',
      transactionDate: '2026-09-02T09:00:00.000Z',
      transactionType: 'INCOME',
      documentNo: 'RV-2569-000041',
      referenceNo: 'SCB-DON-7721',
      description: 'รับเงินบริจาคจัดซื้อเครื่องช่วยหายใจ ICU คุณสมชายและครอบครัว',
      amount: 850000.00,
      balanceAfter: 14820000.00,
      source: 'REVENUE',
      departmentId: 'dept-8',
      createdAt: '2026-09-02T09:00:00.000Z',
    },
  ];

  bankStatements: DbBankStatement[] = [
    {
      id: 'stmt-1',
      bankAccountId: 'bank-1',
      statementDate: '2026-09-04T10:30:00.000Z',
      description: 'TRF IN 0121234567 NHSO IPD CLAIMS',
      referenceNo: 'KTB-TRANS-98124',
      debitAmount: 0,
      creditAmount: 4500000.00,
      balance: 52480350.00,
      status: 'MATCHED',
      matchedTxId: 'btx-1',
      importedAt: '2026-09-04T18:00:00.000Z',
    },
    {
      id: 'stmt-2',
      bankAccountId: 'bank-1',
      statementDate: '2026-09-03T14:15:00.000Z',
      description: 'DIRECT DEBIT SIAM PHARMA CO LTD',
      referenceNo: 'KTB-PAY-11029',
      debitAmount: 1280000.00,
      creditAmount: 0,
      balance: 47980350.00,
      status: 'MATCHED',
      matchedTxId: 'btx-2',
      importedAt: '2026-09-04T18:00:00.000Z',
    },
    {
      id: 'stmt-3',
      bankAccountId: 'bank-1',
      statementDate: '2026-09-05T08:20:00.000Z',
      description: 'EDC SETTLEMENT POS-CASHIER-01',
      referenceNo: 'KTB-POS-88912',
      debitAmount: 0,
      creditAmount: 145200.00,
      balance: 52625550.00,
      status: 'UNMATCHED',
      importedAt: '2026-09-05T09:00:00.000Z',
    },
  ];

  receivables: DbReceivable[] = [
    {
      id: 'rec-1',
      receivableNo: 'AR-2569-000001',
      documentNo: 'NHSO-IPD-2569-08',
      debtorId: 'deb-1',
      debtorName: 'สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)',
      departmentId: 'dept-5',
      category: 'UC',
      billDate: '2026-08-01',
      dueDate: '2026-08-31',
      amount: 18500000.00,
      paidAmount: 12000000.00,
      balance: 6500000.00,
      status: 'OVERDUE',
      description: 'ลูกหนี้ค่ารักษาพยาบาลผู้ป่วยใน สิทธิหลักประกันสุขภาพถ้วนหน้า ประจำเดือน ส.ค.',
      createdAt: '2026-08-01T08:00:00.000Z',
    },
    {
      id: 'rec-2',
      receivableNo: 'AR-2569-000002',
      documentNo: 'SSS-MED-2569-08',
      debtorId: 'deb-2',
      debtorName: 'สำนักงานประกันสังคม (สปส.)',
      departmentId: 'dept-5',
      category: 'SSS',
      billDate: '2026-08-15',
      dueDate: '2026-09-15',
      amount: 4200000.00,
      paidAmount: 0.00,
      balance: 4200000.00,
      status: 'OPEN',
      description: 'ลูกหนี้ค่าบริการทางการแพทย์กรณีโรคที่มีค่าใช้จ่ายสูง (High Cost)',
      createdAt: '2026-08-15T08:00:00.000Z',
    },
    {
      id: 'rec-3',
      receivableNo: 'AR-2569-000003',
      documentNo: 'CSMBS-DIRECT-2569-07',
      debtorId: 'deb-3',
      debtorName: 'กรมบัญชีกลาง (สวัสดิการข้าราชการ)',
      departmentId: 'dept-5',
      category: 'CSMBS',
      billDate: '2026-07-10',
      dueDate: '2026-08-10',
      amount: 3800000.00,
      paidAmount: 0.00,
      balance: 3800000.00,
      status: 'OVERDUE',
      description: 'ลูกหนี้ค่ารักษาพยาบาลข้าราชการและครอบครัว ระบบเบิกจ่ายตรง',
      createdAt: '2026-07-10T08:00:00.000Z',
    },
    {
      id: 'rec-4',
      receivableNo: 'AR-2569-000004',
      documentNo: 'INS-AIA-2569-09',
      debtorId: 'deb-4',
      debtorName: 'บริษัท เอไอเอ จำกัด (มหาชน)',
      departmentId: 'dept-5',
      category: 'PRIVATE',
      billDate: '2026-09-01',
      dueDate: '2026-10-01',
      amount: 1250000.00,
      paidAmount: 1250000.00,
      balance: 0.00,
      status: 'PAID',
      description: 'ค่าสินไหมทดแทนค่ารักษาพยาบาลผู้ป่วยประกันสุขภาพกลุ่ม',
      createdAt: '2026-09-01T08:00:00.000Z',
    },
    {
      id: 'rec-5',
      receivableNo: 'AR-2569-000005',
      documentNo: 'PAT-OLD-2568-12',
      debtorId: 'deb-5',
      debtorName: 'ลูกหนี้ผู้ป่วยค้างชำระทั่วไป',
      departmentId: 'dept-5',
      category: 'OTHER',
      billDate: '2026-05-10',
      dueDate: '2026-06-10',
      amount: 850000.00,
      paidAmount: 100000.00,
      balance: 750000.00,
      status: 'OVERDUE',
      description: 'ลูกหนี้ผู้ป่วยค้างชำระตามข้อตกลงผ่อนผัน เกินกำหนด 90 วัน',
      createdAt: '2026-05-10T08:00:00.000Z',
    },
  ];

  receivablePayments: DbReceivablePayment[] = [
    {
      id: 'rcp-1',
      receiptNo: 'RC-2569-000001',
      receivableId: 'rec-1',
      paymentDate: '2026-08-28',
      amount: 12000000.00,
      bankAccountId: 'bank-1',
      referenceNo: 'NHSO-E-REC-8891',
      paymentMethod: 'TRANSFER',
      notes: 'รับชำระงวดที่ 1 จาก สปสช.',
      createdAt: '2026-08-28T11:00:00.000Z',
    },
    {
      id: 'rcp-2',
      receiptNo: 'RC-2569-000002',
      receivableId: 'rec-4',
      paymentDate: '2026-09-03',
      amount: 1250000.00,
      bankAccountId: 'bank-1',
      referenceNo: 'AIA-PAY-4412',
      paymentMethod: 'TRANSFER',
      notes: 'รับชำระครบถ้วน',
      createdAt: '2026-09-03T15:30:00.000Z',
    },
  ];

  payables: DbPayable[] = [
    {
      id: 'pay-1',
      payableNo: 'AP-2569-000001',
      documentNo: 'PO-69-0412',
      vendorId: 'ven-1',
      vendorName: 'บริษัท สยามเภสัชเวชภัณฑ์ จำกัด',
      departmentId: 'dept-4',
      fundId: 'fund-1',
      budgetId: 'bdg-3',
      invoiceNo: 'INV-SP-2026-981',
      invoiceDate: '2026-08-25',
      dueDate: '2026-09-08',
      amount: 2450000.00,
      paidAmount: 0.00,
      balance: 2450000.00,
      status: 'READY_TO_PAY',
      description: 'จัดซื้อยาปฏิชีวนะและเวชภัณฑ์จำเป็น ประจำคลังยา รพ.',
      createdAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'pay-2',
      payableNo: 'AP-2569-000002',
      documentNo: 'PO-69-0418',
      vendorId: 'ven-2',
      vendorName: 'บริษัท บางกอกเมดิคอลเทค จำกัด',
      departmentId: 'dept-8',
      fundId: 'fund-1',
      budgetId: 'bdg-4',
      invoiceNo: 'INV-BMT-2569-102',
      invoiceDate: '2026-08-20',
      dueDate: '2026-09-06',
      amount: 1850000.00,
      paidAmount: 0.00,
      balance: 1850000.00,
      status: 'WAITING_APPROVAL',
      description: 'ค่าบริการบำรุงรักษาเครื่องเอกซเรย์คอมพิวเตอร์ CT-Scan ประจำไตรมาส',
      createdAt: '2026-08-20T10:00:00.000Z',
    },
    {
      id: 'pay-3',
      payableNo: 'AP-2569-000003',
      documentNo: 'PO-69-0390',
      vendorId: 'ven-3',
      vendorName: 'บริษัท นวัตกรรมการแพทย์ไทย จำกัด',
      departmentId: 'dept-2',
      fundId: 'fund-1',
      budgetId: 'bdg-4',
      invoiceNo: 'INV-TMI-8812',
      invoiceDate: '2026-07-15',
      dueDate: '2026-08-20',
      amount: 980000.00,
      paidAmount: 0.00,
      balance: 980000.00,
      status: 'OVERDUE',
      description: 'ชุดอุปกรณ์ผ่าตัดส่องกล้องผ่านกล้อง Laparoscopic Instruments',
      createdAt: '2026-07-15T11:00:00.000Z',
    },
    {
      id: 'pay-4',
      payableNo: 'AP-2569-000004',
      documentNo: 'PO-69-0422',
      vendorId: 'ven-4',
      vendorName: 'บริษัท คลีนแอนด์ไฮยีน โซลูชั่นส์ จำกัด',
      departmentId: 'dept-7',
      fundId: 'fund-1',
      budgetId: 'bdg-2',
      invoiceNo: 'INV-CHS-2569-08',
      invoiceDate: '2026-09-01',
      dueDate: '2026-09-30',
      amount: 540000.00,
      paidAmount: 0.00,
      balance: 540000.00,
      status: 'PENDING_DOCUMENT',
      description: 'ค่าจ้างเหมาบริการทำความสะอาดและฆ่าเชื้อประจำอาคารผู้ป่วยนอก',
      createdAt: '2026-09-01T08:30:00.000Z',
    },
  ];

  commitments: DbCommitment[] = [
    {
      id: 'cm-1',
      commitmentNo: 'CM-2569-000001',
      sourceDocument: 'PO-69-0501 (จัดซื้อยาเคมีบำบัด)',
      departmentId: 'dept-4',
      departmentName: 'กลุ่มงานเภสัชกรรม',
      vendorId: 'ven-1',
      vendorName: 'บริษัท สยามเภสัชเวชภัณฑ์ จำกัด',
      description: 'ภาระผูกพันตามใบสั่งซื้อยาเคมีบำบัด รอบส่งมอบเดือน ก.ย.',
      amount: 3200000.00,
      expectedPaymentDate: '2026-09-12',
      status: 'ACTIVE',
      createdAt: '2026-08-28T09:00:00.000Z',
    },
    {
      id: 'cm-2',
      commitmentNo: 'CM-2569-000002',
      sourceDocument: 'สัญญาจ้างเลขที่ รพ. 12/2569 (ปรับปรุงห้องผ่าตัด)',
      departmentId: 'dept-2',
      departmentName: 'กลุ่มงานศัลยกรรม',
      vendorId: 'ven-5',
      vendorName: 'หจก. ก่อสร้างพัฒนาสาธารณสุข',
      description: 'งวดงานที่ 3 สัญญาปรับปรุงระบบระบายอากาศห้องผ่าตัดแรงดันบวก',
      amount: 4800000.00,
      expectedPaymentDate: '2026-09-20',
      status: 'ACTIVE',
      createdAt: '2026-08-15T10:30:00.000Z',
    },
    {
      id: 'cm-3',
      commitmentNo: 'CM-2569-000003',
      sourceDocument: 'สัญญาเช่าระบบ Cloud PACS 69-02',
      departmentId: 'dept-7',
      departmentName: 'กลุ่มงานบริหารทั่วไป',
      vendorId: 'ven-2',
      vendorName: 'บริษัท บางกอกเมดิคอลเทค จำกัด',
      description: 'ค่าเช่าสัญญาณและระบบจัดเก็บภาพถ่ายรังสีทางการแพทย์',
      amount: 650000.00,
      expectedPaymentDate: '2026-10-05',
      status: 'ACTIVE',
      createdAt: '2026-09-01T11:00:00.000Z',
    },
    {
      id: 'cm-4',
      commitmentNo: 'CM-2569-000004',
      sourceDocument: 'PO-69-0520 (วัสดุห้องปฏิบัติการชันสูตร)',
      departmentId: 'dept-1',
      departmentName: 'กลุ่มงานอายุรกรรม',
      vendorId: 'ven-3',
      vendorName: 'บริษัท นวัตกรรมการแพทย์ไทย จำกัด',
      description: 'น้ำยาตรวจวิเคราะห์ทางชีวเคมีและภูมิคุ้มกันวิทยา',
      amount: 1450000.00,
      expectedPaymentDate: '2026-10-25',
      status: 'ACTIVE',
      createdAt: '2026-09-02T14:00:00.000Z',
    },
  ];

  loans: DbGovernmentLoan[] = [
    {
      id: 'loan-1',
      loanNo: 'LN-2569-000001',
      borrowerCode: 'EMP-0142',
      borrowerName: 'นพ. วีรชัย กิตติวิทยา (หัวหน้ากลุ่มงานศัลยกรรม)',
      departmentId: 'dept-2',
      departmentName: 'กลุ่มงานศัลยกรรม',
      purpose: 'ยืมเงินทดรองราชการเพื่อเข้าร่วมประชุมวิชาการศัลยศาสตร์ระดับนานาชาติ ณ ประเทศสิงคโปร์',
      requestDate: '2026-07-20',
      approveDate: '2026-07-22',
      paymentDate: '2026-07-25',
      dueDate: '2026-08-25',
      amount: 85000.00,
      returnedAmount: 0.00,
      balance: 85000.00,
      status: 'OUTSTANDING', // เกินกำหนด (>30 days alert)
      createdAt: '2026-07-20T08:00:00.000Z',
    },
    {
      id: 'loan-2',
      loanNo: 'LN-2569-000002',
      borrowerCode: 'EMP-0288',
      borrowerName: 'พว. มัลลิกา สุวรรณรัตน์ (พยาบาลวิชาชีพชำนาญการ)',
      departmentId: 'dept-8',
      departmentName: 'กลุ่มงานผู้ป่วยวิกฤต (ICU)',
      purpose: 'ยืมเงินราชการจัดอบรมเชิงปฏิบัติการ Advanced Critical Care Nursing รุ่นที่ 4',
      requestDate: '2026-08-10',
      approveDate: '2026-08-12',
      paymentDate: '2026-08-15',
      dueDate: '2026-09-08',
      amount: 120000.00,
      returnedAmount: 0.00,
      balance: 120000.00,
      status: 'OUTSTANDING', // ครบกำหนดภายใน 3 วัน
      createdAt: '2026-08-10T09:30:00.000Z',
    },
    {
      id: 'loan-3',
      loanNo: 'LN-2569-000003',
      borrowerCode: 'EMP-0095',
      borrowerName: 'ภก. ธนภัทร รุ่งเรือง (เภสัชกรชำนาญการพิเศษ)',
      departmentId: 'dept-4',
      departmentName: 'กลุ่มงานเภสัชกรรม',
      purpose: 'ยืมเงินราชการศึกษาดูงานระบบการจ่ายยาอัตโนมัติ (Automated Dispensing System)',
      requestDate: '2026-08-25',
      approveDate: '2026-08-27',
      paymentDate: '2026-08-30',
      dueDate: '2026-09-30',
      amount: 45000.00,
      returnedAmount: 0.00,
      balance: 45000.00,
      status: 'OUTSTANDING',
      createdAt: '2026-08-25T14:00:00.000Z',
    },
    {
      id: 'loan-4',
      loanNo: 'LN-2569-000004',
      borrowerCode: 'EMP-0311',
      borrowerName: 'นางสาวดาริกา พัฒนศิลป์ (นักวิชาการเงินและบัญชี)',
      departmentId: 'dept-5',
      departmentName: 'กลุ่มงานการเงินและบัญชี',
      purpose: 'ยืมเงินราชการจัดประชุมชี้แจงระเบียบการเงินการคลังสำหรับหัวหน้าหน่วยงาน',
      requestDate: '2026-08-01',
      approveDate: '2026-08-03',
      paymentDate: '2026-08-05',
      dueDate: '2026-08-20',
      amount: 35000.00,
      returnedAmount: 35000.00,
      balance: 0.00,
      status: 'CLEARED',
      createdAt: '2026-08-01T10:00:00.000Z',
    },
  ];

  loanClearances: DbLoanClearance[] = [
    {
      id: 'clr-1',
      clearanceNo: 'CL-2569-000001',
      loanId: 'loan-4',
      loanNo: 'LN-2569-000004',
      clearanceDate: '2026-08-18',
      expenseAmount: 31200.00,
      cashReturn: 3800.00,
      additionalPayment: 0.00,
      documentReference: 'ใบเสร็จค่าอาหารว่างและเอกสาร 8 รายการ',
      notes: 'ล้างเงินยืมครบถ้วนตามระเบียบ คืนเงินสด 3,800 บาท เข้าบัญชีเงินบำรุง',
      status: 'APPROVED',
      createdAt: '2026-08-18T14:00:00.000Z',
    },
  ];

  budgets: DbBudget[] = [
    {
      id: 'bdg-1',
      fiscalYear: 2569,
      fundId: 'fund-1',
      fundName: 'เงินบำรุงโรงพยาบาล (UC)',
      departmentId: 'dept-5',
      departmentName: 'กลุ่มงานการเงินและบัญชี',
      budgetCodeId: 'bc-1',
      budgetCode: '510101',
      budgetName: 'ค่าตอบแทนบุคลากรทางการแพทย์และเจ้าหน้าที่ (OT/พ.ต.ส.)',
      allocated: 35000000.00,
      adjustment: 2000000.00,
      committed: 0.00,
      spent: 29500000.00,
      available: 7500000.00,
    },
    {
      id: 'bdg-2',
      fiscalYear: 2569,
      fundId: 'fund-1',
      fundName: 'เงินบำรุงโรงพยาบาล (UC)',
      departmentId: 'dept-7',
      departmentName: 'กลุ่มงานบริหารทั่วไป',
      budgetCodeId: 'bc-2',
      budgetCode: '510201',
      budgetName: 'ค่าใช้สอย ค่าจ้างเหมาบริการ และสาธารณูปโภค',
      allocated: 24000000.00,
      adjustment: 0.00,
      committed: 1200000.00,
      spent: 19800000.00,
      available: 3000000.00,
    },
    {
      id: 'bdg-3',
      fiscalYear: 2569,
      fundId: 'fund-1',
      fundName: 'เงินบำรุงโรงพยาบาล (UC)',
      departmentId: 'dept-4',
      departmentName: 'กลุ่มงานเภสัชกรรม',
      budgetCodeId: 'bc-3',
      budgetCode: '510301',
      budgetName: 'ค่ายาและเวชภัณฑ์มิใช่ยา',
      allocated: 80000000.00,
      adjustment: 5000000.00,
      committed: 5650000.00,
      spent: 68400000.00,
      available: 10950000.00,
    },
    {
      id: 'bdg-4',
      fiscalYear: 2569,
      fundId: 'fund-1',
      fundName: 'เงินบำรุงโรงพยาบาล (UC)',
      departmentId: 'dept-8',
      departmentName: 'กลุ่มงานผู้ป่วยวิกฤต (ICU)',
      budgetCodeId: 'bc-4',
      budgetCode: '510401',
      budgetName: 'ค่าครุภัณฑ์ทางการแพทย์และระบบช่วยชีวิต',
      allocated: 18000000.00,
      adjustment: 0.00,
      committed: 4800000.00,
      spent: 11200000.00,
      available: 2000000.00,
    },
    {
      id: 'bdg-5',
      fiscalYear: 2569,
      fundId: 'fund-4',
      fundName: 'เงินบริจาคพัฒนาโรงพยาบาล',
      departmentId: 'dept-2',
      departmentName: 'กลุ่มงานศัลยกรรม',
      budgetCodeId: 'bc-4',
      budgetCode: '510401',
      budgetName: 'จัดซื้อเครื่องมือผ่าตัดเฉพาะทาง (เงินบริจาค)',
      allocated: 10000000.00,
      adjustment: 0.00,
      committed: 980000.00,
      spent: 5400000.00,
      available: 3620000.00,
    },
  ];

  revenueTransactions: DbRevenueTransaction[] = [
    {
      id: 'rev-1',
      revenueDate: '2026-09-04',
      fundId: 'fund-1',
      fundName: 'เงินบำรุงโรงพยาบาล (UC)',
      source: 'UC',
      departmentId: 'dept-5',
      documentNo: 'RV-2569-000042',
      amount: 4500000.00,
      description: 'รับชดเชยค่าบริการผู้ป่วยใน IPD สปสช. งวดที่ 11',
      bankAccountId: 'bank-1',
      createdAt: '2026-09-04T10:30:00.000Z',
    },
    {
      id: 'rev-2',
      revenueDate: '2026-09-02',
      fundId: 'fund-4',
      fundName: 'เงินบริจาคพัฒนาโรงพยาบาล',
      source: 'DONATION',
      departmentId: 'dept-8',
      documentNo: 'RV-2569-000041',
      amount: 850000.00,
      description: 'รับเงินบริจาคสมทบทุนจัดซื้อเครื่องช่วยหายใจ ICU',
      bankAccountId: 'bank-2',
      createdAt: '2026-09-02T09:00:00.000Z',
    },
    {
      id: 'rev-3',
      revenueDate: '2026-08-31',
      fundId: 'fund-2',
      fundName: 'กองทุนประกันสังคม',
      source: 'SSS',
      departmentId: 'dept-5',
      documentNo: 'RV-2569-000040',
      amount: 3200000.00,
      description: 'เงินชดเชยค่ารักษาพยาบาลเหมาจ่ายรายหัว ประกันสังคม',
      bankAccountId: 'bank-1',
      createdAt: '2026-08-31T14:00:00.000Z',
    },
    {
      id: 'rev-4',
      revenueDate: '2026-08-28',
      fundId: 'fund-3',
      fundName: 'กองทุนสวัสดิการข้าราชการ',
      source: 'CSMBS',
      departmentId: 'dept-5',
      documentNo: 'RV-2569-000039',
      amount: 2900000.00,
      description: 'ชดเชยระบบเบิกจ่ายตรง กรมบัญชีกลาง',
      bankAccountId: 'bank-1',
      createdAt: '2026-08-28T16:00:00.000Z',
    },
  ];

  auditLogs: DbAuditLog[] = [
    {
      id: 'aud-1',
      userId: 'usr-1',
      username: 'admin',
      role: 'SUPER_ADMIN',
      action: 'LOGIN',
      module: 'AUTH',
      entity: 'User',
      entityId: 'usr-1',
      beforeData: null,
      afterData: { ip: '127.0.0.1', agent: 'Mozilla/5.0' },
      ipAddress: '127.0.0.1',
      createdAt: '2026-09-05T06:00:00.000Z',
    },
    {
      id: 'aud-2',
      userId: 'usr-2',
      username: 'cfo_hospital',
      role: 'CFO',
      action: 'APPROVE',
      module: 'PAYABLE',
      entity: 'Payable',
      entityId: 'pay-1',
      beforeData: { status: 'WAITING_APPROVAL' },
      afterData: { status: 'READY_TO_PAY', approvedBy: 'cfo_hospital' },
      ipAddress: '192.168.1.45',
      createdAt: '2026-09-04T15:30:00.000Z',
    },
    {
      id: 'aud-3',
      userId: 'usr-3',
      username: 'fin_officer',
      role: 'FINANCE',
      action: 'CREATE',
      module: 'RECEIVABLE',
      entity: 'ReceivablePayment',
      entityId: 'rcp-2',
      beforeData: null,
      afterData: { receiptNo: 'RC-2569-000002', amount: 1250000 },
      ipAddress: '192.168.1.102',
      createdAt: '2026-09-03T15:30:00.000Z',
    },
  ];

  notifications: DbNotification[] = [
    {
      id: 'notif-1',
      title: 'แจ้งเตือนลูกหนี้เกินกำหนดชำระ',
      message: 'ลูกหนี้ สปสช. (AR-2569-000001) เกินกำหนดชำระ 5 วัน จำนวนคงค้าง 6,500,000.00 บาท',
      category: 'RECEIVABLE',
      link: '/receivables',
      isRead: false,
      createdAt: '2026-09-05T07:00:00.000Z',
    },
    {
      id: 'notif-2',
      title: 'เจ้าหนี้ครบกำหนดชำระใน 7 วัน',
      message: 'เจ้าหนี้ บจก. สยามเภสัชเวชภัณฑ์ (AP-2569-000001) ครบกำหนดชำระวันที่ 8 ก.ย. ยอด 2,450,000.00 บาท',
      category: 'PAYABLE',
      link: '/payables',
      isRead: false,
      createdAt: '2026-09-05T06:30:00.000Z',
    },
    {
      id: 'notif-3',
      title: 'เงินยืมราชการเกินกำหนดชำระ',
      message: 'สัญญายืม LN-2569-000001 (นพ. วีรชัย กิตติวิทยา) เกินกำหนดชำระเกิน 10 วัน จำนวน 85,000.00 บาท',
      category: 'LOAN',
      link: '/loans',
      isRead: false,
      createdAt: '2026-09-05T06:00:00.000Z',
    },
    {
      id: 'notif-4',
      title: 'แจ้งเตือนงบประมาณใกล้หมด',
      message: 'งบประมาณค่าครุภัณฑ์ ICU (bdg-4) มีการใช้จ่ายและผูกพันไปแล้ว 88.89% เหลือวงเงิน 2,000,000.00 บาท',
      category: 'BUDGET',
      link: '/budget',
      isRead: false,
      createdAt: '2026-09-04T16:00:00.000Z',
    },
    {
      id: 'notif-5',
      title: 'ยอด Bank Statement ยังไม่กระทบยอด',
      message: 'มีรายการ Statement ธ.กรุงไทย ยังไม่ได้จับคู่กับระบบ 1 รายการ ยอด 145,200.00 บาท',
      category: 'BANK_REC',
      link: '/cash-bank/reconciliation',
      isRead: true,
      createdAt: '2026-09-05T09:05:00.000Z',
    },
  ];

  // Helper Methods for calculations & CRUD
  getDashboardKpis(fiscalYear = 2569) {
    // 1. เงินสดและเงินฝากธนาคาร
    const cashAndBank = this.bankAccounts.reduce((sum, b) => sum + (b.isActive ? b.currentBalance : 0), 0);
    
    // 2. ลูกหนี้คงค้างทั้งหมด
    const totalReceivables = this.receivables
      .filter(r => r.status !== 'PAID' && r.status !== 'WRITEOFF')
      .reduce((sum, r) => sum + r.balance, 0);

    // 3. ลูกหนี้เกินกำหนด
    const overdueReceivables = this.receivables
      .filter(r => r.status === 'OVERDUE' || (r.status !== 'PAID' && calculateAging(r.dueDate).daysOverdue > 0))
      .reduce((sum, r) => sum + r.balance, 0);
    const overdueReceivableCount = this.receivables.filter(r => r.status === 'OVERDUE' || (r.status !== 'PAID' && calculateAging(r.dueDate).daysOverdue > 0)).length;

    // 4. เจ้าหนี้คงค้าง
    const totalPayables = this.payables
      .filter(p => p.status !== 'PAID')
      .reduce((sum, p) => sum + p.balance, 0);

    // 5. เจ้าหนี้ครบกำหนดภายใน 7 วัน
    const now = new Date();
    const next7Days = new Date();
    next7Days.setDate(now.getDate() + 7);
    const payablesDueIn7Days = this.payables
      .filter(p => {
        if (p.status === 'PAID') return false;
        const due = new Date(p.dueDate);
        return due >= now && due <= next7Days;
      })
      .reduce((sum, p) => sum + p.balance, 0);
    const payablesDueIn7DaysCount = this.payables.filter(p => {
      if (p.status === 'PAID') return false;
      const due = new Date(p.dueDate);
      return due >= now && due <= next7Days;
    }).length;

    // 6. เงินยืมราชการคงค้าง
    const outstandingLoans = this.loans
      .filter(l => l.status === 'OUTSTANDING' || l.status === 'PAID')
      .reduce((sum, l) => sum + l.balance, 0);

    // 7. เงินยืมเกินกำหนด
    const overdueLoans = this.loans
      .filter(l => (l.status === 'OUTSTANDING' || l.status === 'PAID') && calculateAging(l.dueDate).daysOverdue > 0)
      .reduce((sum, l) => sum + l.balance, 0);
    const overdueLoanCount = this.loans.filter(l => (l.status === 'OUTSTANDING' || l.status === 'PAID') && calculateAging(l.dueDate).daysOverdue > 0).length;

    // 8. ภาระผูกพัน
    const totalCommitments = this.commitments
      .filter(c => c.status === 'ACTIVE')
      .reduce((sum, c) => sum + c.amount, 0);

    // 9. งบประมาณทั้งหมด
    const totalBudgetAllocated = this.budgets.reduce((sum, b) => sum + b.allocated + b.adjustment, 0);

    // 10. เบิกจ่ายแล้ว
    const totalBudgetSpent = this.budgets.reduce((sum, b) => sum + b.spent, 0);

    // 11. งบประมาณคงเหลือ
    const totalBudgetAvailable = this.budgets.reduce((sum, b) => sum + b.available, 0);

    // 12. รายได้สะสม
    const totalAccumulatedRevenue = this.revenueTransactions.reduce((sum, r) => sum + r.amount, 0);

    return {
      cashAndBank,
      totalReceivables,
      overdueReceivables,
      overdueReceivableCount,
      totalPayables,
      payablesDueIn7Days,
      payablesDueIn7DaysCount,
      outstandingLoans,
      overdueLoans,
      overdueLoanCount,
      totalCommitments,
      totalBudgetAllocated,
      totalBudgetSpent,
      totalBudgetAvailable,
      totalAccumulatedRevenue,
    };
  }

  getFinancialAlerts() {
    const alerts: Array<{
      id: string;
      type: 'DANGER' | 'WARNING' | 'INFO';
      title: string;
      description: string;
      link: string;
      count?: number;
    }> = [];

    const kpis = this.getDashboardKpis();

    if (kpis.overdueReceivableCount > 0) {
      alerts.push({
        id: 'alt-ar-overdue',
        type: 'DANGER',
        title: `ลูกหนี้เกินกำหนดชำระ ${kpis.overdueReceivableCount} ราย`,
        description: `มียอดค้างชำระเกินกำหนดรวม ${kpis.overdueReceivables.toLocaleString()} บาท ต้องการการติดตามเร่งด่วน`,
        link: '/receivables?status=OVERDUE',
        count: kpis.overdueReceivableCount,
      });
    }

    if (kpis.payablesDueIn7DaysCount > 0) {
      alerts.push({
        id: 'alt-ap-due7',
        type: 'WARNING',
        title: `เจ้าหนี้ครบกำหนดใน 7 วัน ${kpis.payablesDueIn7DaysCount} ราย`,
        description: `มียอดที่ต้องเตรียมจ่ายรวม ${kpis.payablesDueIn7Days.toLocaleString()} บาท เพื่อรักษาสภาพคล่อง`,
        link: '/payables',
        count: kpis.payablesDueIn7DaysCount,
      });
    }

    if (kpis.overdueLoanCount > 0) {
      alerts.push({
        id: 'alt-loan-overdue',
        type: 'DANGER',
        title: `เงินยืมราชการเกินกำหนด ${kpis.overdueLoanCount} ราย`,
        description: `ยอดเงินยืมค้างล้างรวม ${kpis.overdueLoans.toLocaleString()} บาท ต้องส่งหนังสือทวงถามตามระเบียบ`,
        link: '/loans?status=OUTSTANDING',
        count: kpis.overdueLoanCount,
      });
    }

    // High budget usage alert
    const criticalBudgets = this.budgets.filter(b => (b.spent + b.committed) / (b.allocated + b.adjustment || 1) >= 0.85);
    if (criticalBudgets.length > 0) {
      alerts.push({
        id: 'alt-budget-critical',
        type: 'WARNING',
        title: `งบประมาณใช้เกิน 85% จำนวน ${criticalBudgets.length} หมวด`,
        description: `รายการงบ เช่น ${criticalBudgets[0].budgetName} ใกล้เต็มวงเงินแล้ว`,
        link: '/budget',
        count: criticalBudgets.length,
      });
    }

    // Unmatched statements
    const unmatchedCount = this.bankStatements.filter(s => s.status === 'UNMATCHED').length;
    if (unmatchedCount > 0) {
      alerts.push({
        id: 'alt-bank-unmatched',
        type: 'INFO',
        title: `ยอดธนาคารยังไม่กระทบยอด ${unmatchedCount} รายการ`,
        description: `มีรายการ Statement จากธนาคารรอจับคู่กระทบยอดกับระบบ`,
        link: '/cash-bank/reconciliation',
        count: unmatchedCount,
      });
    }

    return alerts;
  }

  logAudit(audit: Omit<DbAuditLog, 'id' | 'createdAt'>) {
    const newLog: DbAuditLog = {
      ...audit,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

// Global Singleton data store
const globalDataStore = globalThis as unknown as {
  enterpriseStore: EnterpriseDataStore | undefined;
};

export const store = globalDataStore.enterpriseStore ?? new EnterpriseDataStore();
if (process.env.NODE_ENV !== 'production') globalDataStore.enterpriseStore = store;

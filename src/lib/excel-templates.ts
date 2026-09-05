import * as XLSX from 'xlsx';

export interface TemplateDefinition {
  id: string;
  name: string;
  fileName: string;
  description: string;
  columns: {
    key: string;
    header: string;
    required: boolean;
    type: 'string' | 'number' | 'date';
    example: string | number;
    description: string;
  }[];
  sampleData: Record<string, any>[];
  notes: string[];
}

export const EXCEL_TEMPLATES: Record<string, TemplateDefinition> = {
  bank_statement: {
    id: 'bank_statement',
    name: 'นำเข้า Statement ธนาคาร (Bank Statement Import)',
    fileName: 'Bank_Statement_Template.xlsx',
    description: 'ใช้สำหรับนำเข้ารายการเคลื่อนไหวจากธนาคาร (KTB, SCB, BBL ฯลฯ) เพื่อทำ Bank Reconciliation',
    columns: [
      { key: 'txnDate', header: 'วันที่รายการ (YYYY-MM-DD)', required: true, type: 'date', example: '2024-09-01', description: 'วันที่เกิดรายการใน Statement รูปแบบ YYYY-MM-DD' },
      { key: 'bankCode', header: 'รหัสธนาคาร (KTB/SCB/BBL)', required: true, type: 'string', example: 'KTB', description: 'รหัสธนาคาร เช่น KTB, SCB, BBL' },
      { key: 'accountNumber', header: 'เลขที่บัญชี', required: true, type: 'string', example: '701-0-12345-6', description: 'เลขที่บัญชีเงินฝากที่ต้องการกระทบยอด' },
      { key: 'type', header: 'ประเภทรายการ (DEPOSIT/WITHDRAW)', required: true, type: 'string', example: 'DEPOSIT', description: 'DEPOSIT (เงินเข้า) หรือ WITHDRAW (เงินออก)' },
      { key: 'amount', header: 'จำนวนเงิน (บาท)', required: true, type: 'number', example: 125000.00, description: 'จำนวนเงินเป็นตัวเลขบวก ทศนิยม 2 ตำแหน่ง' },
      { key: 'referenceNo', header: 'เลขอ้างอิง/เลขที่เช็ค', required: false, type: 'string', example: 'CHQ-77821', description: 'เลขที่เช็ค หรือ Reference Code ของธนาคาร' },
      { key: 'description', header: 'คำอธิบายรายการ', required: true, type: 'string', example: 'รับโอนเงินจัดสรรงบประมาณ สปสช.', description: 'คำอธิบายรายการเคลื่อนไหว' },
      { key: 'balance', header: 'ยอดคงเหลือใน Statement', required: false, type: 'number', example: 52480350.00, description: 'ยอดคงเหลือหลังทำรายการ' },
    ],
    sampleData: [
      { txnDate: '2024-09-01', bankCode: 'KTB', accountNumber: '701-0-12345-6', type: 'DEPOSIT', amount: 3500000.00, referenceNo: 'TXN-0901-001', description: 'รับโอนเงินชดเชยค่าบริการทางการแพทย์ สปสช.', balance: 52480350.00 },
      { txnDate: '2024-09-02', bankCode: 'KTB', accountNumber: '701-0-12345-6', type: 'WITHDRAW', amount: 485000.00, referenceNo: 'CHQ-98124', description: 'จ่ายเช็คชำระหนี้ค่ายา บจก.สยามฟาร์มาซูติคอล', balance: 51995350.00 },
      { txnDate: '2024-09-03', bankCode: 'KTB', accountNumber: '701-0-12345-6', type: 'WITHDRAW', amount: 85000.00, referenceNo: 'TRF-LN0903', description: 'โอนเงินยืมราชการราชการ นพ.สมเกียรติ พัฒนกิจ', balance: 51910350.00 },
      { txnDate: '2024-09-04', bankCode: 'SCB', accountNumber: '111-2-34567-8', type: 'DEPOSIT', amount: 154200.00, referenceNo: 'DEP-POS0904', description: 'นำฝากเงินสดรายได้ค่ารักษาพยาบาลห้องการเงิน', balance: 14250000.00 },
    ],
    notes: [
      'รูปแบบวันที่แนะนำ: YYYY-MM-DD เช่น 2024-09-01 หรือ 2024-09-15',
      'ช่องประเภทรายการ (type) ต้องระบุเป็น "DEPOSIT" (เงินเข้า) หรือ "WITHDRAW" (เงินออก/ตัดจ่าย)',
      'จำนวนเงินต้องเป็นตัวเลขจำนวนบวก (Positive Number) ระบบจะหักลบตามประเภทรายการเอง',
    ],
  },

  receivables: {
    id: 'receivables',
    name: 'นำเข้าข้อมูลลูกหนี้ (Accounts Receivable Import)',
    fileName: 'Accounts_Receivable_Template.xlsx',
    description: 'ใช้สำหรับนำเข้ายอดลูกหนี้ค่ารักษาพยาบาลจากระบบ HIS หรือระบบ e-Claim (สปสช., ประกันสังคม, กรมบัญชีกลาง)',
    columns: [
      { key: 'invoiceNo', header: 'เลขที่ใบแจ้งหนี้/Claim ID', required: true, type: 'string', example: 'INV-2024-0801', description: 'เลขที่ใบแจ้งหนี้ หรือ Transaction Claim ID' },
      { key: 'debtorType', header: 'กลุ่มลูกหนี้ (UC/SSS/CSMBS/OTHER)', required: true, type: 'string', example: 'UC', description: 'UC=สิทธิบัตรทอง, SSS=ประกันสังคม, CSMBS=ข้าราชการ, OTHER=อื่นๆ' },
      { key: 'debtorName', header: 'ชื่อลูกหนี้/หน่วยงานเรียกเก็บ', required: true, type: 'string', example: 'สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)', description: 'ชื่อกองทุนหรือผู้มีหน้าที่จ่ายเงิน' },
      { key: 'patientHn', header: 'HN ผู้ป่วย (ถ้ามี)', required: false, type: 'string', example: 'HN67001234', description: 'เลขประจำตัวผู้ป่วย (กรณีเรียกเก็บรายบุคคล)' },
      { key: 'issueDate', header: 'วันที่ตั้งหนี้ (YYYY-MM-DD)', required: true, type: 'date', example: '2024-08-01', description: 'วันที่ส่งเคลมหรือตั้งลูกหนี้' },
      { key: 'dueDate', header: 'วันครบกำหนดชำระ (YYYY-MM-DD)', required: true, type: 'date', example: '2024-08-31', description: 'วันครบกำหนดตามรอบข้อตกลง' },
      { key: 'amount', header: 'ยอดลูกหนี้ (บาท)', required: true, type: 'number', example: 1250000.00, description: 'ยอดหนี้รวมที่ตั้งเบิก' },
      { key: 'department', header: 'กลุ่มงาน/แผนก', required: false, type: 'string', example: 'กลุ่มงานประกันสุขภาพ', description: 'แผนกที่ดูแลการส่งเบิก' },
    ],
    sampleData: [
      { invoiceNo: 'CLM-UC-67-0801', debtorType: 'UC', debtorName: 'สปสช. กองทุนผู้ป่วยใน (IPD)', patientHn: 'BATCH-IPD-AUG', issueDate: '2024-08-01', dueDate: '2024-08-31', amount: 4850000.00, department: 'กลุ่มงานประกันสุขภาพ' },
      { invoiceNo: 'CLM-SSS-67-0815', debtorType: 'SSS', debtorName: 'สำนักงานประกันสังคม จังหวัดกาญจนบุรี', patientHn: 'BATCH-SSS-72', issueDate: '2024-08-15', dueDate: '2024-09-15', amount: 1820000.00, department: 'กลุ่มงานประกันสุขภาพ' },
      { invoiceNo: 'CLM-CSMBS-67-0820', debtorType: 'CSMBS', debtorName: 'กรมบัญชีกลาง สิทธิเบิกจ่ายตรงข้าราชการ', patientHn: 'BATCH-CS-89', issueDate: '2024-08-20', dueDate: '2024-09-20', amount: 2450000.00, department: 'กลุ่มงานประกันสุขภาพ' },
      { invoiceNo: 'INV-OTH-67-0825', debtorType: 'OTHER', debtorName: 'บริษัท ทิพยประกันภัย จำกัด (มหาชน)', patientHn: 'HN67008921', issueDate: '2024-08-25', dueDate: '2024-09-25', amount: 45000.00, department: 'กลุ่มงานการเงินและบัญชี' },
    ],
    notes: [
      'กลุ่มลูกหนี้ (debtorType) ควรเป็น: UC, SSS, CSMBS, FOREIGN, SELF, หรือ OTHER',
      'ระบบจะคำนวณอายุหนี้ (Aging 30/60/90 วัน) ให้อัตโนมัติจากวันที่ครบกำหนด (dueDate)',
    ],
  },

  payables: {
    id: 'payables',
    name: 'นำเข้าข้อมูลเจ้าหนี้ (Accounts Payable Import)',
    fileName: 'Accounts_Payable_Template.xlsx',
    description: 'ใช้สำหรับนำเข้าบิล/ใบแจ้งหนี้เจ้าหนี้การค้า ค่ายา เวชภัณฑ์ และค่าจ้างบริการ',
    columns: [
      { key: 'invoiceNo', header: 'เลขที่บิล/ใบส่งของ/ใบแจ้งหนี้', required: true, type: 'string', example: 'INV-MED-8812', description: 'เลขที่เอกสารของเจ้าหนี้' },
      { key: 'vendorName', header: 'ชื่อเจ้าหนี้/บริษัท/ร้านค้า', required: true, type: 'string', example: 'องค์การเภสัชกรรม (GPO)', description: 'ชื่อนิติบุคคลหรือคู่สัญญา' },
      { key: 'vendorTaxId', header: 'เลขประจำตัวผู้เสียภาษี', required: false, type: 'string', example: '0105530012345', description: 'เลขผู้เสียภาษี 13 หลัก' },
      { key: 'category', header: 'หมวดหมู่ (DRUG/SUPPLY/SERVICE/EQUIP)', required: true, type: 'string', example: 'DRUG', description: 'DRUG=ยา, SUPPLY=เวชภัณฑ์, SERVICE=จ้างเหมา, EQUIP=ครุภัณฑ์' },
      { key: 'invoiceDate', header: 'วันที่ใบแจ้งหนี้ (YYYY-MM-DD)', required: true, type: 'date', example: '2024-08-10', description: 'วันที่ส่งของหรือรับวางบิล' },
      { key: 'dueDate', header: 'วันครบกำหนดชำระ (YYYY-MM-DD)', required: true, type: 'date', example: '2024-09-10', description: 'วันครบกำหนดเครดิตเทอม' },
      { key: 'amount', header: 'จำนวนเงินสุทธิ (บาท)', required: true, type: 'number', example: 854000.00, description: 'จำนวนเงินรวมภาษีมูลค่าเพิ่ม' },
      { key: 'poNumber', header: 'เลขที่สัญญา/PO (ถ้ามี)', required: false, type: 'string', example: 'PO-67-0412', description: 'เลขที่ใบสั่งซื้อหรือสัญญาที่ผูกพัน' },
    ],
    sampleData: [
      { invoiceNo: 'GPO-67-09881', vendorName: 'องค์การเภสัชกรรม', vendorTaxId: '0994000164221', category: 'DRUG', invoiceDate: '2024-08-15', dueDate: '2024-09-15', amount: 1450000.00, poNumber: 'PO-67-0312' },
      { invoiceNo: 'INV-DKSH-5412', vendorName: 'บริษัท ดีเคเอสเอช (ประเทศไทย) จำกัด', vendorTaxId: '0105501002341', category: 'DRUG', invoiceDate: '2024-08-20', dueDate: '2024-09-20', amount: 890000.00, poNumber: 'PO-67-0345' },
      { invoiceNo: 'BIL-MED-9921', vendorName: 'บริษัท เมดิคอลซัพพลายส์ จำกัด', vendorTaxId: '0105545089123', category: 'SUPPLY', invoiceDate: '2024-08-25', dueDate: '2024-09-25', amount: 320000.00, poNumber: 'PO-67-0388' },
      { invoiceNo: 'CLN-SERV-6708', vendorName: 'ห้างหุ้นส่วนจำกัด กาญจน์ คลีนนิ่ง เซอร์วิส', vendorTaxId: '0713550001239', category: 'SERVICE', invoiceDate: '2024-08-31', dueDate: '2024-09-30', amount: 165000.00, poNumber: 'CN-67-0044' },
    ],
    notes: [
      'หมวดหมู่ (category) แนะนำ: DRUG (ยา), SUPPLY (เวชภัณฑ์มิใช่ยา), SERVICE (จ้างเหมา), EQUIP (ครุภัณฑ์), UTILITY (สาธารณูปโภค)',
      'ระบบจะแจ้งเตือนเมื่อเจ้าหนี้มีกำหนดชำระภายใน 7 วัน และ 15 วัน',
    ],
  },

  government_loans: {
    id: 'government_loans',
    name: 'นำเข้าข้อมูลเงินยืมราชการ (Government Loan Import)',
    fileName: 'Government_Loan_Template.xlsx',
    description: 'ใช้สำหรับนำเข้าสัญญายืมเงินราชการ (เงินทดรองราชการ/เงินบำรุง) เพื่อติดตามการส่งใช้คืนตามระเบียบ',
    columns: [
      { key: 'loanNumber', header: 'เลขที่สัญญายืมเงิน', required: true, type: 'string', example: 'LN-67-0101', description: 'เลขที่สัญญา เช่น LN-67-xxxx' },
      { key: 'borrowerName', header: 'ชื่อ-นามสกุล ผู้ขอยืมเงิน', required: true, type: 'string', example: 'นพ.สมเกียรติ พัฒนกิจ', description: 'ชื่อข้าราชการ/ลูกจ้างผู้ทำสัญญายืม' },
      { key: 'department', header: 'กลุ่มงาน/แผนก', required: true, type: 'string', example: 'กลุ่มงานศัลยกรรม', description: 'กลุ่มงานที่สังกัด' },
      { key: 'purpose', header: 'วัตถุประสงค์การยืมเงิน', required: true, type: 'string', example: 'โครงการอบรมเชิงปฏิบัติการทางวิชาการศัลยแพทย์', description: 'โครงการ/กิจกรรมที่นำเงินไปใช้' },
      { key: 'borrowDate', header: 'วันที่ทำสัญญา/จ่ายเงิน (YYYY-MM-DD)', required: true, type: 'date', example: '2024-08-01', description: 'วันที่รับเงินยืม' },
      { key: 'dueDate', header: 'กำหนดส่งใช้คืน (YYYY-MM-DD)', required: true, type: 'date', example: '2024-08-31', description: 'กำหนดส่งใช้คืน (ปกติไม่เกิน 30 วันหลังเสร็จกิจกรรม)' },
      { key: 'amount', header: 'จำนวนเงินยืม (บาท)', required: true, type: 'number', example: 45000.00, description: 'ยอดเงินยืมตามสัญญา' },
      { key: 'fundSource', header: 'แหล่งเงิน (บำรุง/งบประมาณ)', required: false, type: 'string', example: 'เงินบำรุงโรงพยาบาล', description: 'แหล่งเงินที่ทดรองจ่าย' },
    ],
    sampleData: [
      { loanNumber: 'LN-67-0091', borrowerName: 'พญ.นภา วัฒนกุล', department: 'กลุ่มงานอายุรกรรม', purpose: 'จัดอบรมพัฒนาศักยภาพเครือข่ายโรคไตวายเรื้อรัง', borrowDate: '2024-08-05', dueDate: '2024-09-04', amount: 65000.00, fundSource: 'เงินบำรุงโรงพยาบาล' },
      { loanNumber: 'LN-67-0092', borrowerName: 'นางสาวมาลี รักษ์ดี', department: 'กลุ่มงานการพยาบาล', purpose: 'ศึกษาดูงานมาตรฐานการพยาบาลผู้ป่วยวิกฤต รพ.ศูนย์', borrowDate: '2024-08-10', dueDate: '2024-09-09', amount: 35000.00, fundSource: 'เงินบำรุงโรงพยาบาล' },
      { loanNumber: 'LN-67-0093', borrowerName: 'นายวิชัย สดใส', department: 'กลุ่มงานบริหารทั่วไป', purpose: 'จัดกิจกรรมวันป้องกันและบรรเทาสาธารณภัยประจำปี', borrowDate: '2024-08-15', dueDate: '2024-09-14', amount: 28000.00, fundSource: 'เงินงบประมาณแผ่นดิน' },
      { loanNumber: 'LN-67-0094', borrowerName: 'นพ.ประเสริฐ เกียรติคุณ', department: 'กลุ่มงานเวชศาสตร์ชุมชน', purpose: 'โครงการออกหน่วยแพทย์เคลื่อนที่เชิงรุกในถิ่นทุรกันดาร', borrowDate: '2024-08-20', dueDate: '2024-09-19', amount: 72000.00, fundSource: 'เงินบำรุงโรงพยาบาล' },
    ],
    notes: [
      'ตามระเบียบกระทรวงการคลัง ต้องส่งใช้คืนภายใน 30 วันนับจากวันที่เสร็จสิ้นโครงการ',
      'ระบบจะแจ้งเตือนเมื่อสัญญาค้างเกินกำหนด 30 วันทันที',
    ],
  },

  budget_plan: {
    id: 'budget_plan',
    name: 'นำเข้าแผนงบประมาณ (Budget Plan Import)',
    fileName: 'Budget_Plan_Template.xlsx',
    description: 'ใช้สำหรับนำเข้ากรอบงบประมาณประจำปี หมวดรายจ่าย และยอดจัดสรรรายแผนก',
    columns: [
      { key: 'fiscalYear', header: 'ปีงบประมาณ (พ.ศ.)', required: true, type: 'number', example: 2567, description: 'ปีงบประมาณไทย เช่น 2567 หรือ 2568' },
      { key: 'fundCode', header: 'รหัสกองทุน/แหล่งเงิน', required: true, type: 'string', example: 'REV_HOSP', description: 'รหัสกองทุน เช่น REV_HOSP (เงินบำรุง), GOV_BUDGET (งบแผ่นดิน)' },
      { key: 'categoryCode', header: 'รหัสหมวดรายจ่าย', required: true, type: 'string', example: 'OP_EXPENSE', description: 'OP_EXPENSE (ดำเนินงาน), INV_CAPITAL (ลงทุน), SAL_COMP (ค่าตอบแทน)' },
      { key: 'projectName', header: 'ชื่อโครงการ/กิจกรรม/รายการงบประมาณ', required: true, type: 'string', example: 'งบจัดซื้อยาและเวชภัณฑ์ประจำปี 2567', description: 'รายละเอียดรายการงบประมาณ' },
      { key: 'department', header: 'กลุ่มงานผู้รับผิดชอบ', required: true, type: 'string', example: 'กลุ่มงานเภสัชกรรม', description: 'ชื่อกลุ่มงานที่ได้รับจัดสรร' },
      { key: 'allocatedAmount', header: 'งบประมาณที่จัดสรร (บาท)', required: true, type: 'number', example: 85000000.00, description: 'ยอดวงเงินจัดสรรทั้งปี' },
    ],
    sampleData: [
      { fiscalYear: 2567, fundCode: 'REV_HOSP', categoryCode: 'OP_EXPENSE', projectName: 'จัดซื้อยาและเวชภัณฑ์เพื่อบริการผู้ป่วย', department: 'กลุ่มงานเภสัชกรรม', allocatedAmount: 85000000.00 },
      { fiscalYear: 2567, fundCode: 'REV_HOSP', categoryCode: 'OP_EXPENSE', projectName: 'วัสดุการแพทย์และวิทยาศาสตร์การแพทย์', department: 'กลุ่มงานเทคนิคการแพทย์', allocatedAmount: 24000000.00 },
      { fiscalYear: 2567, fundCode: 'REV_HOSP', categoryCode: 'INV_CAPITAL', projectName: 'จัดซื้อเครื่องตรวจอวัยวะภายในด้วยคลื่นเสียงความถี่สูง', department: 'กลุ่มงานรังสีวิทยา', allocatedAmount: 4800000.00 },
      { fiscalYear: 2567, fundCode: 'GOV_BUDGET', categoryCode: 'SAL_COMP', projectName: 'เงินเพิ่มพิเศษสำหรับบุคลากรสาธารณสุข (พ.ต.ส.)', department: 'กลุ่มงานทรัพยากรบุคคล', allocatedAmount: 18500000.00 },
    ],
    notes: [
      'ยอดงบประมาณที่จัดสรร (allocatedAmount) จะถูกนำไปตั้งเป็นวงเงินตั้งต้น',
      'การจัดซื้อหรือผูกพันสัญญาจะถูกหักออกจากวงเงินนี้โดยอัตโนมัติ',
    ],
  },

  revenue_records: {
    id: 'revenue_records',
    name: 'นำเข้าบันทึกรายได้ (Revenue Records Import)',
    fileName: 'Revenue_Record_Template.xlsx',
    description: 'ใช้สำหรับนำเข้ารายรับเงินบำรุง รายรับค่ารักษาพยาบาล และเงินจัดสรรเข้าบัญชีโรงพยาบาล',
    columns: [
      { key: 'receiveDate', header: 'วันที่รับเงิน (YYYY-MM-DD)', required: true, type: 'date', example: '2024-09-01', description: 'วันที่รับเงินหรือเงินเข้าบัญชี' },
      { key: 'receiptNo', header: 'เลขที่ใบเสร็จ/เอกสารรับเงิน', required: true, type: 'string', example: 'RC-67-09001', description: 'เลขที่ใบเสร็จรับเงินหรือหนังสือแจ้งโอน' },
      { key: 'revenueType', header: 'ประเภทรายได้ (UC/SSS/CASH/DONATION)', required: true, type: 'string', example: 'UC', description: 'ประเภทรายได้ตามผังบัญชี' },
      { key: 'source', header: 'แหล่งที่มาของรายได้', required: true, type: 'string', example: 'สำนักงานหลักประกันสุขภาพแห่งชาติ', description: 'หน่วยงานหรือบุคคลผู้นำส่ง' },
      { key: 'description', header: 'รายละเอียดรายได้', required: true, type: 'string', example: 'เงินชดเชยค่าบริการผู้ป่วยนอก (OPD) งวดที่ 22', description: 'คำอธิบายรายการ' },
      { key: 'bankCode', header: 'เข้าบัญชีธนาคาร (KTB/SCB/BBL)', required: true, type: 'string', example: 'KTB', description: 'ธนาคารที่นำเงินฝากเข้า' },
      { key: 'amount', header: 'จำนวนเงินรับ (บาท)', required: true, type: 'number', example: 1450000.00, description: 'จำนวนเงินสุทธิที่ได้รับ' },
    ],
    sampleData: [
      { receiveDate: '2024-09-01', receiptNo: 'RC-67-09001', revenueType: 'UC', source: 'สปสช.', description: 'เงินชดเชยบริการ IPD งวดประจำเดือนสิงหาคม', bankCode: 'KTB', amount: 3500000.00 },
      { receiveDate: '2024-09-02', receiptNo: 'RC-67-09002', revenueType: 'CASH', source: 'ผู้มารับบริการทั่วไป', description: 'รายได้ค่ารักษาพยาบาลห้องการเงินประจำวัน', bankCode: 'SCB', amount: 185200.00 },
      { receiveDate: '2024-09-03', receiptNo: 'RC-67-09003', revenueType: 'SSS', source: 'สำนักงานประกันสังคม', description: 'เงินเหมาจ่ายรายหัวประกันสังคมงวดที่ 3', bankCode: 'KTB', amount: 2400000.00 },
      { receiveDate: '2024-09-04', receiptNo: 'RC-67-09004', revenueType: 'DONATION', source: 'มูลนิธิโรงพยาบาลพหลพลพยุหเสนา', description: 'เงินบริจาคสมทบทุนจัดซื้อเครื่องมือแพทย์', bankCode: 'BBL', amount: 500000.00 },
    ],
    notes: [
      'จำนวนเงินจะถูกบันทึกเป็นรายได้สะสม และปรับปรุงยอดเงินฝากธนาคารให้ทันที',
    ],
  },
};

/**
 * Generate an Excel file with template headers, notes sheet, and realistic sample data.
 */
export function generateExcelTemplate(templateId: string): void {
  const template = EXCEL_TEMPLATES[templateId];
  if (!template) {
    throw new Error(`Template with id "${templateId}" not found`);
  }

  const workbook = XLSX.utils.book_new();

  // Sheet 1: Data Entry & Sample (ข้อมูลสำหรับกรอก)
  const headerRow = template.columns.map((col) => col.header);
  const sampleRows = template.sampleData.map((row) =>
    template.columns.map((col) => row[col.key] ?? '')
  );

  const dataSheetContent = [headerRow, ...sampleRows];
  const dataWorksheet = XLSX.utils.aoa_to_sheet(dataSheetContent);

  // Set column widths
  const colWidths = template.columns.map((col) => ({
    wch: Math.max(col.header.length * 2, 22),
  }));
  dataWorksheet['!cols'] = colWidths;

  XLSX.utils.book_append_sheet(workbook, dataWorksheet, 'ข้อมูลนำเข้า (Data)');

  // Sheet 2: Column Descriptions & Instructions (คำอธิบายโครงสร้างไฟล์และข้อแนะนำ)
  const descHeaders = ['ชื่อคอลัมน์ (Header)', 'รหัสฟิลด์', 'จำเป็นหรือไม่', 'ประเภทข้อมูล', 'คำอธิบาย', 'ตัวอย่าง'];
  const descRows = template.columns.map((col) => [
    col.header,
    col.key,
    col.required ? 'จำเป็น (Required)' : 'ไม่บังคับ (Optional)',
    col.type,
    col.description,
    col.example,
  ]);

  const descWorksheet = XLSX.utils.aoa_to_sheet([descHeaders, ...descRows]);
  descWorksheet['!cols'] = [{ wch: 32 }, { wch: 18 }, { wch: 20 }, { wch: 14 }, { wch: 45 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(workbook, descWorksheet, 'คำอธิบายฟิลด์ (Structure)');

  // Sheet 3: User Guidance Notes (ข้อควรระวัง)
  const notesContent = [
    ['ข้อแนะนำและข้อควรระวังในการเตรียมไฟล์ Excel:'],
    ['1. กรุณาอย่าลบหรือแก้ไขชื่อหัวคอลัมน์ (Header Row ในแถวที่ 1)'],
    ['2. วันที่ควรอยู่ในรูปแบบ YYYY-MM-DD เช่น 2024-09-01 หรือ 2024-12-31'],
    ['3. ช่องจำนวนเงินควรเป็นตัวเลขล้วน (สามารถมีทศนิยมได้) ไม่ควรมีเครื่องหมายตัวอักษรหรือช่องว่าง'],
    ...template.notes.map((n, i) => [`${i + 4}. ${n}`]),
  ];
  const notesWorksheet = XLSX.utils.aoa_to_sheet(notesContent);
  notesWorksheet['!cols'] = [{ wch: 80 }];
  XLSX.utils.book_append_sheet(workbook, notesWorksheet, 'ข้อแนะนำการใช้งาน (Notes)');

  // Download the workbook
  XLSX.writeFile(workbook, template.fileName);
}

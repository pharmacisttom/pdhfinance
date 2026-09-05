const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding pdhfinance MySQL database...');

  // 1. Roles
  const roles = [
    { code: 'SUPER_ADMIN', name: 'ผู้ดูแลระบบสูงสุด (Super Admin)', isSystem: true },
    { code: 'ADMIN', name: 'ผู้ดูแลระบบ (Admin)', isSystem: true },
    { code: 'CFO', name: 'ประธานเจ้าหน้าที่บริหารฝ่ายการเงิน (CFO)', isSystem: true },
    { code: 'FINANCE', name: 'เจ้าหน้าที่การเงิน (Finance)', isSystem: true },
    { code: 'ACCOUNTING', name: 'เจ้าหน้าที่บัญชี (Accounting)', isSystem: true },
    { code: 'BUDGET', name: 'เจ้าหน้าที่งบประมาณ (Budget)', isSystem: true },
    { code: 'REVENUE', name: 'เจ้าหน้าที่จัดเก็บรายได้ (Revenue)', isSystem: true },
    { code: 'AUDITOR', name: 'ผู้ตรวจสอบภายใน (Auditor)', isSystem: true },
    { code: 'EXECUTIVE', name: 'ผู้บริหารระดับสูง (Executive)', isSystem: true },
    { code: 'VIEWER', name: 'ผู้เข้าชมข้อมูล (Viewer)', isSystem: true },
  ];

  const roleMap = {};
  for (const r of roles) {
    const created = await prisma.role.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
    roleMap[r.code] = created.id;
  }
  console.log('✓ Roles seeded.');

  // 2. Departments
  const departments = [
    { code: 'MED', name: 'กลุ่มงานอายุรกรรม', type: 'MEDICAL' },
    { code: 'SURG', name: 'กลุ่มงานศัลยกรรม', type: 'MEDICAL' },
    { code: 'PED', name: 'กลุ่มงานกุมารเวชกรรม', type: 'MEDICAL' },
    { code: 'PHARM', name: 'กลุ่มงานเภสัชกรรม', type: 'MEDICAL' },
    { code: 'FIN', name: 'กลุ่มงานการเงินและบัญชี', type: 'FINANCE' },
    { code: 'PLAN', name: 'กลุ่มงานยุทธศาสตร์และงบประมาณ', type: 'ADMINISTRATION' },
    { code: 'ADMIN', name: 'กลุ่มงานบริหารทั่วไป', type: 'ADMINISTRATION' },
    { code: 'ICU', name: 'กลุ่มงานผู้ป่วยวิกฤต (ICU)', type: 'MEDICAL' },
  ];

  const deptMap = {};
  for (const d of departments) {
    const created = await prisma.department.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    });
    deptMap[d.code] = created.id;
  }
  console.log('✓ Departments seeded.');

  // 3. Funds
  const funds = [
    { code: 'UC01', name: 'เงินบำรุงโรงพยาบาล (UC)', description: 'รายได้จากการจัดบริการสุขภาพถ้วนหน้า' },
    { code: 'SSS02', name: 'กองทุนประกันสังคม', description: 'เงินชดเชยค่าบริการทางการแพทย์ประกันสังคม' },
    { code: 'CSMBS03', name: 'กองทุนสวัสดิการข้าราชการ', description: 'เงินชดเชยค่ารักษาพยาบาลข้าราชการ' },
    { code: 'DON04', name: 'เงินบริจาคพัฒนาโรงพยาบาล', description: 'เงินบริจาคเพื่อจัดซื้ออุปกรณ์และอาคาร' },
    { code: 'GOV05', name: 'งบประมาณแผ่นดิน', description: 'งบจัดสรรจากกระทรวงสาธารณสุข' },
  ];

  const fundMap = {};
  for (const f of funds) {
    const created = await prisma.fund.upsert({
      where: { code: f.code },
      update: {},
      create: f,
    });
    fundMap[f.code] = created.id;
  }
  console.log('✓ Funds seeded.');

  // 4. Budget Codes
  const budgetCodes = [
    { code: '510101', name: 'ค่าตอบแทนบุคลากรทางการแพทย์ (OT/พ.ต.ส.)', category: 'PERSONNEL' },
    { code: '510201', name: 'ค่าใช้สอย ค่าจ้างเหมา และสาธารณูปโภค', category: 'OPERATING' },
    { code: '510301', name: 'ค่ายาและเวชภัณฑ์มิใช่ยา', category: 'OPERATING' },
    { code: '510401', name: 'ค่าครุภัณฑ์ทางการแพทย์และยานพาหนะ', category: 'INVESTMENT' },
    { code: '510501', name: 'ค่าที่ดินและสิ่งก่อสร้าง', category: 'INVESTMENT' },
  ];

  const bcMap = {};
  for (const bc of budgetCodes) {
    const created = await prisma.budgetCode.upsert({
      where: { code: bc.code },
      update: {},
      create: bc,
    });
    bcMap[bc.code] = created.id;
  }
  console.log('✓ Budget Codes seeded.');

  // 5. Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const adminPasswordHash = await bcrypt.hash('pdhfinace10832', 10);
  const users = [
    {
      username: 'admin',
      email: 'admin@hospital.moph.go.th',
      passwordHash: adminPasswordHash,
      fullName: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
      roleId: roleMap['SUPER_ADMIN'],
      departmentId: deptMap['ADMIN'],
      position: 'ผู้อำนวยการฝ่ายเทคโนโลยีสารสนเทศ',
    },
    {
      username: 'cfo',
      email: 'cfo@hospital.moph.go.th',
      passwordHash,
      fullName: 'นพ. ชวลิต การเงินมั่นคง (CFO)',
      roleId: roleMap['CFO'],
      departmentId: deptMap['FIN'],
      position: 'รองผู้อำนวยการฝ่ายการเงินและแผนงาน',
    },
    {
      username: 'finance',
      email: 'finance@hospital.moph.go.th',
      passwordHash,
      fullName: 'นางสาวดาริกา พัฒนศิลป์ (การเงิน)',
      roleId: roleMap['FINANCE'],
      departmentId: deptMap['FIN'],
      position: 'นักวิชาการเงินและบัญชีชำนาญการ',
    },
    {
      username: 'budget',
      email: 'budget@hospital.moph.go.th',
      passwordHash,
      fullName: 'นายสมเกียรติ แผนงานดี (งบประมาณ)',
      roleId: roleMap['BUDGET'],
      departmentId: deptMap['PLAN'],
      position: 'นักวิเคราะห์นโยบายและแผนชำนาญการ',
    },
    {
      username: 'auditor',
      email: 'auditor@hospital.moph.go.th',
      passwordHash,
      fullName: 'นางสุภาพร ตรวจสอบเข้ม (ผู้ตรวจสอบ)',
      roleId: roleMap['AUDITOR'],
      departmentId: deptMap['ADMIN'],
      position: 'ผู้ตรวจสอบภายในวิชาชีพ',
    },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { username: u.username },
      update: {},
      create: u,
    });
  }
  console.log('✓ Users seeded.');

  // 6. Bank Accounts
  const bankAccounts = [
    {
      bankCode: 'KTB',
      bankName: 'ธนาคารกรุงไทย',
      branch: 'สาขาศูนย์ราชการ / รพ.',
      accountName: 'โรงพยาบาลศูนย์ - บัญชีเงินบำรุง',
      accountNumber: '0121234567',
      accountType: 'CURRENT',
      openingBalance: 45000000.00,
      currentBalance: 52480350.00,
    },
    {
      bankCode: 'SCB',
      bankName: 'ธนาคารไทยพาณิชย์',
      branch: 'สาขาศูนย์การแพทย์',
      accountName: 'โรงพยาบาลศูนย์ - เงินรับบริจาค',
      accountNumber: '4052987654',
      accountType: 'SAVINGS',
      openingBalance: 12500000.00,
      currentBalance: 14820000.00,
    },
    {
      bankCode: 'BBL',
      bankName: 'ธนาคารกรุงเทพ',
      branch: 'สาขาหลักเมือง',
      accountName: 'โรงพยาบาลศูนย์ - กองทุนวิจัยและพัฒนา',
      accountNumber: '1284567890',
      accountType: 'SAVINGS',
      openingBalance: 6000000.00,
      currentBalance: 7150000.00,
    },
  ];

  const bankMap = {};
  for (const b of bankAccounts) {
    const created = await prisma.bankAccount.upsert({
      where: { accountNumber: b.accountNumber },
      update: {},
      create: b,
    });
    bankMap[b.bankCode] = created.id;
  }
  console.log('✓ Bank Accounts seeded.');

  // 7. Debtors
  const debtors = [
    { debtorCode: 'DEB-001', debtorName: 'สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.)', category: 'UC', creditLimit: 50000000 },
    { debtorCode: 'DEB-002', debtorName: 'สำนักงานประกันสังคม (สปส.)', category: 'SSS', creditLimit: 20000000 },
    { debtorCode: 'DEB-003', debtorName: 'กรมบัญชีกลาง (สวัสดิการข้าราชการ)', category: 'CSMBS', creditLimit: 30000000 },
    { debtorCode: 'DEB-004', debtorName: 'บริษัท เอไอเอ จำกัด (มหาชน)', category: 'PRIVATE', creditLimit: 5000000 },
  ];

  const debtorMap = {};
  for (const d of debtors) {
    const created = await prisma.debtor.upsert({
      where: { debtorCode: d.debtorCode },
      update: {},
      create: d,
    });
    debtorMap[d.debtorCode] = created.id;
  }
  console.log('✓ Debtors seeded.');

  // 8. Vendors
  const vendors = [
    { vendorCode: 'VEN-001', vendorName: 'บริษัท สยามเภสัชเวชภัณฑ์ จำกัด', category: 'DRUG', bankName: 'ธนาคารกรุงไทย', bankAccountNumber: '0129998881' },
    { vendorCode: 'VEN-002', vendorName: 'บริษัท บางกอกเมดิคอลเทค จำกัด', category: 'EQUIPMENT', bankName: 'ธนาคารไทยพาณิชย์', bankAccountNumber: '4058887772' },
    { vendorCode: 'VEN-003', vendorName: 'บริษัท นวัตกรรมการแพทย์ไทย จำกัด', category: 'MEDICAL_SUPPLY', bankName: 'ธนาคารกรุงเทพ', bankAccountNumber: '1287776663' },
    { vendorCode: 'VEN-004', vendorName: 'บริษัท คลีนแอนด์ไฮยีน โซลูชั่นส์ จำกัด', category: 'SERVICE', bankName: 'ธนาคารกสิกรไทย', bankAccountNumber: '0346665554' },
  ];

  for (const v of vendors) {
    await prisma.vendor.upsert({
      where: { vendorCode: v.vendorCode },
      update: {},
      create: v,
    });
  }
  console.log('✓ Vendors seeded.');

  // 9. Document Sequences
  const docSeqs = [
    { code: 'AR', prefix: 'AR', fiscalYear: 2569, currentNumber: 5 },
    { code: 'AP', prefix: 'AP', fiscalYear: 2569, currentNumber: 4 },
    { code: 'LN', prefix: 'LN', fiscalYear: 2569, currentNumber: 4 },
    { code: 'PV', prefix: 'PV', fiscalYear: 2569, currentNumber: 88 },
    { code: 'RC', prefix: 'RC', fiscalYear: 2569, currentNumber: 2 },
    { code: 'RV', prefix: 'RV', fiscalYear: 2569, currentNumber: 42 },
    { code: 'CM', prefix: 'CM', fiscalYear: 2569, currentNumber: 4 },
    { code: 'CL', prefix: 'CL', fiscalYear: 2569, currentNumber: 1 },
  ];

  for (const ds of docSeqs) {
    await prisma.documentSequence.upsert({
      where: { code_fiscalYear: { code: ds.code, fiscalYear: ds.fiscalYear } },
      update: {},
      create: ds,
    });
  }
  console.log('✓ Document Sequences initialized.');

  console.log('Database seeding successfully finished!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

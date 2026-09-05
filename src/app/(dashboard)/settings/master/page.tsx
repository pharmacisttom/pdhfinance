'use client';

import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  Search,
  CheckCircle2,
  Layers,
  Wallet,
  PieChart,
  Users,
  Settings,
  ShieldCheck,
  Edit2,
  Trash2,
  Download,
  Save,
  Building,
  CreditCard,
  Receipt,
  FileCheck2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sliders,
  Check,
  X,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { store } from '@/lib/data-store';
import { alertSuccess, alertWarning, showToast } from '@/lib/sweetalert';

type MasterTab = 'PROFILE' | 'DEPT' | 'FUND' | 'BUDGET_CODE' | 'PAYER' | 'VENDOR' | 'BANK' | 'RULES';

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<MasterTab>('PROFILE');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Hospital Organization Profile State
  const [hospitalProfile, setHospitalProfile] = useState({
    hospitalName: 'โรงพยาบาลพหลพลพยุหเสนา',
    hcode: '10832',
    hospitalType: 'โรงพยาบาลทั่วไป (ระดับ A)',
    ministry: 'สำนักงานปลัดกระทรวงสาธารณสุข (สป.สธ.)',
    healthRegion: 'เขตสุขภาพที่ 5 (ราชบุรี/กาญจนบุรี/สุพรรณบุรี/นครปฐม/เพชรบุรี/สมุทรสาคร/สมุทรสงคราม/ประจวบฯ)',
    taxId: '0994000160832',
    address: 'เลขที่ 110 ถนนแสงชูโต ตำบลบ้านใต้ อำเภอเมือง จังหวัดกาญจนบุรี 71000',
    phone: '034-587800 ต่อ 1104',
    currentFiscalYear: '2567',
    cfoName: 'นายสมเกียรติ พัฒนกิจการ (หัวหน้ากลุ่มงานการเงินและบัญชี)',
    directorName: 'นายแพทย์ธีรพงษ์ เกียรติอนันต์ (ผู้อำนวยการโรงพยาบาล)',
  });

  // Financial Rules & Parameters State
  const [financialRules, setFinancialRules] = useState({
    loanDueDays: 30,
    loanWarningDays: 7,
    apWarningDays: 7,
    arAgingBuckets: '30, 60, 90, 180',
    provisionOverdue90Rate: 15,
    cfoApprovalLimit: 500000,
    directorApprovalLimit: 5000000,
    periodClosingDay: 25,
    requireReceiptForLoanClearance: true,
    enableAutoReconciliation: true,
  });

  // Department List State
  const [departments, setDepartments] = useState([
    { id: '1', code: 'DEPT-001', name: 'กลุ่มงานการเงินและบัญชี', type: 'ฝ่ายบริหาร', head: 'นายสมเกียรติ พัฒนกิจการ', ext: '1104', active: true },
    { id: '2', code: 'DEPT-002', name: 'กลุ่มงานพัสดุและบำรุงรักษา', type: 'ฝ่ายบริหาร', head: 'นางกมลวรรณ ทรัพย์เจริญ', ext: '1108', active: true },
    { id: '3', code: 'DEPT-003', name: 'กลุ่มงานเภสัชกรรม', type: 'บริการทางการแพทย์', head: 'ภก.ธนากร วงศ์สุวรรณ', ext: '2101', active: true },
    { id: '4', code: 'DEPT-004', name: 'กลุ่มงานการพยาบาล', type: 'บริการทางการแพทย์', head: 'นางสาววิไลลักษณ์ จันทร์เพ็ญ', ext: '3100', active: true },
    { id: '5', code: 'DEPT-005', name: 'กลุ่มงานประกันสุขภาพ ยุทธศาสตร์และสารสนเทศ', type: 'ฝ่ายยุทธศาสตร์', head: 'นพ.ประเสริฐ เกียรติคุณ', ext: '1150', active: true },
    { id: '6', code: 'DEPT-006', name: 'กลุ่มงานศัลยกรรม', type: 'บริการทางการแพทย์', head: 'นพ.สมเกียรติ พัฒนกิจ', ext: '4101', active: true },
    { id: '7', code: 'DEPT-007', name: 'กลุ่มงานอายุรกรรม', type: 'บริการทางการแพทย์', head: 'พญ.นภา วัฒนกุล', ext: '4102', active: true },
  ]);

  // Funds List State
  const [funds, setFunds] = useState([
    { id: '1', code: 'FUND-01', name: 'เงินบำรุงโรงพยาบาล (Hospital Revenue Fund)', description: 'รายได้จากการให้บริการทางการแพทย์และเงินชดเชยค่าบริการ', bankAcc: '701-0-12345-6 (KTB)', active: true },
    { id: '2', code: 'FUND-02', name: 'เงินงบประมาณแผ่นดิน (Government Budget)', description: 'เงินจัดสรรประจำปีจากสำนักงบประมาณ / กระทรวงสาธารณสุข', bankAcc: '222-3-45678-9 (BBL)', active: true },
    { id: '3', code: 'FUND-03', name: 'กองทุนเงินบริจาคสมทบทุนจัดซื้อเครื่องมือแพทย์', description: 'เงินบริจาคจากประชาชนเพื่อพัฒนาโรงพยาบาล', bankAcc: '111-2-34567-8 (SCB)', active: true },
    { id: '4', code: 'FUND-04', name: 'กองทุนหลักประกันสุขภาพแห่งชาติ (UC Fund)', description: 'เงินโอนจัดสรรค่าบริการเหมาจ่ายรายหัวและค่าบริการเฉพาะกลุ่ม', bankAcc: '701-0-12345-6 (KTB)', active: true },
  ]);

  // Budget Categories State
  const [budgetCategories, setBudgetCategories] = useState([
    { id: '1', code: 'CAT-OP-01', name: 'งบยาและเวชภัณฑ์มิใช่ยา', gfmisCode: '5104010101', type: 'งบดำเนินงาน', active: true },
    { id: '2', code: 'CAT-OP-02', name: 'งบดำเนินงานและค่าจ้างเหมาบริการ', gfmisCode: '5104010199', type: 'งบดำเนินงาน', active: true },
    { id: '3', code: 'CAT-SAL-01', name: 'งบค่าตอบแทนบุคลากรทางการแพทย์ (พ.ต.ส./เบี้ยเลี้ยง)', gfmisCode: '5101010101', type: 'งบบุคลากร', active: true },
    { id: '4', code: 'CAT-INV-01', name: 'งบลงทุนและจัดซื้อครุภัณฑ์ทางการแพทย์', gfmisCode: '1206010101', type: 'งบลงทุน', active: true },
    { id: '5', code: 'CAT-UTIL-01', name: 'งบค่าสาธารณูปโภค (ไฟฟ้า น้ำประปา สื่อสาร)', gfmisCode: '5104020101', type: 'งบสาธารณูปโภค', active: true },
  ]);

  // Healthcare Schemes State
  const [payerSchemes, setPayerSchemes] = useState([
    { id: '1', code: 'UC', name: 'สิทธิหลักประกันสุขภาพถ้วนหน้า (บัตรทอง 30 บาท)', clearingHouse: 'สปสช.', creditDays: 30, active: true },
    { id: '2', code: 'SSS', name: 'สิทธิประกันสังคม (Social Security Scheme)', clearingHouse: 'สำนักงานประกันสังคม', creditDays: 30, active: true },
    { id: '3', code: 'CSMBS', name: 'สิทธิสวัสดิการรักษาพยาบาลข้าราชการ', clearingHouse: 'กรมบัญชีกลาง', creditDays: 15, active: true },
    { id: '4', code: 'LGO', name: 'สิทธิพนักงานองค์กรปกครองส่วนท้องถิ่น (อปท.)', clearingHouse: 'กรมส่งเสริมการปกครองท้องถิ่น', creditDays: 30, active: true },
    { id: '5', code: 'FOREIGN', name: 'สิทธิประกันสุขภาพแรงงานต่างด้าว', clearingHouse: 'กระทรวงสาธารณสุข', creditDays: 15, active: true },
    { id: '6', code: 'CASH', name: 'ผู้มารับบริการชำระเงินเอง (Self-Pay)', clearingHouse: 'ห้องการเงินโรงพยาบาล', creditDays: 0, active: true },
  ]);

  // Vendor Categories State
  const [vendorCategories, setVendorCategories] = useState([
    { id: '1', code: 'VEN-DRUG', name: 'ค่ายาและเวชภัณฑ์ยา', defaultCreditDays: 60, requiredDocs: 'ใบส่งของ, ใบกำกับภาษี, ใบตรวจรับ', active: true },
    { id: '2', code: 'VEN-SUPPLY', name: 'เวชภัณฑ์มิใช่ยาและวัสดุการแพทย์', defaultCreditDays: 30, requiredDocs: 'ใบส่งของ, ใบกำกับภาษี', active: true },
    { id: '3', code: 'VEN-EQUIP', name: 'ครุภัณฑ์และเครื่องมือแพทย์', defaultCreditDays: 30, requiredDocs: 'สัญญาซื้อขาย, ใบตรวจรับงวดงาน', active: true },
    { id: '4', code: 'VEN-SERVICE', name: 'ค่าจ้างเหมาบริการ (ทำความสะอาด/รปภ./ซักฟอก)', defaultCreditDays: 30, requiredDocs: 'ใบแจ้งหนี้, ใบตรวจรับประจำงวด', active: true },
    { id: '5', code: 'VEN-UTIL', name: 'ค่าสาธารณูปโภค (กฟภ., กปภ., โทรคมนาคม)', defaultCreditDays: 15, requiredDocs: 'ใบแจ้งหนี้ค่าสาธารณูปโภค', active: true },
  ]);

  // Bank Accounts State
  const [bankAccounts, setBankAccounts] = useState([
    { id: '1', code: 'KTB-01', bankName: 'ธนาคารกรุงไทย', branch: 'สาขากาญจนบุรี', accNo: '701-0-12345-6', accType: 'กระแสรายวัน', purpose: 'บัญชีเงินบำรุงโรงพยาบาล', active: true },
    { id: '2', code: 'SCB-01', bankName: 'ธนาคารไทยพาณิชย์', branch: 'สาขาเมืองกาญจนบุรี', accNo: '111-2-34567-8', accType: 'ออมทรัพย์', purpose: 'บัญชีเงินบริจาคสมทบทุน', active: true },
    { id: '3', code: 'BBL-01', bankName: 'ธนาคารกรุงเทพ', branch: 'สาขาศาลากลางกาญจนบุรี', accNo: '222-3-45678-9', accType: 'กระแสรายวัน', purpose: 'บัญชีเงินงบประมาณลงทุน', active: true },
  ]);

  // New Record Form State
  const [newRecord, setNewRecord] = useState({
    code: '',
    name: '',
    type: '',
    extra: '',
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alertSuccess('บันทึกข้อมูลหน่วยงานสำเร็จ', 'ข้อมูลองค์กรและหัวหน้างานได้รับการปรับปรุงเรียบร้อยแล้ว');
  };

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    alertSuccess('บันทึกการตั้งค่าสำเร็จ', 'นโยบายและพารามิเตอร์ทางการเงินมีผลบังคับใช้ในระบบทันที');
  };

  const handleToggleStatus = (listSetter: any, id: string) => {
    listSetter((prev: any[]) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
    showToast('ปรับปรุงสถานะการใช้งานเรียบร้อยแล้ว', 'success');
  };

  const handleExportMaster = () => {
    const wb = XLSX.utils.book_new();

    const deptWs = XLSX.utils.json_to_sheet(departments);
    XLSX.utils.book_append_sheet(wb, deptWs, 'กลุ่มงาน_แผนก');

    const fundWs = XLSX.utils.json_to_sheet(funds);
    XLSX.utils.book_append_sheet(wb, fundWs, 'กองทุน');

    const catWs = XLSX.utils.json_to_sheet(budgetCategories);
    XLSX.utils.book_append_sheet(wb, catWs, 'หมวดงบประมาณ');

    const payerWs = XLSX.utils.json_to_sheet(payerSchemes);
    XLSX.utils.book_append_sheet(wb, payerWs, 'สิทธิการรักษา');

    const vendorWs = XLSX.utils.json_to_sheet(vendorCategories);
    XLSX.utils.book_append_sheet(wb, vendorWs, 'ประเภทเจ้าหนี้');

    const bankWs = XLSX.utils.json_to_sheet(bankAccounts);
    XLSX.utils.book_append_sheet(wb, bankWs, 'บัญชีธนาคาร');

    XLSX.writeFile(wb, 'Hospital_Master_Data_Export.xlsx');
    showToast('ส่งออกข้อมูลหลักเป็นไฟล์ Excel สำเร็จ', 'success');
  };

  const handleAddNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecord.code || !newRecord.name) {
      alertWarning('กรุณากรอกข้อมูลให้ครบถ้วน', 'โปรดระบุรหัสและชื่อรายการก่อนบันทึก');
      return;
    }

    const newId = String(Date.now());

    if (activeTab === 'DEPT') {
      setDepartments([...departments, { id: newId, code: newRecord.code, name: newRecord.name, type: newRecord.type || 'ฝ่ายบริหาร', head: newRecord.extra || '-', ext: '-', active: true }]);
    } else if (activeTab === 'FUND') {
      setFunds([...funds, { id: newId, code: newRecord.code, name: newRecord.name, description: newRecord.extra || '-', bankAcc: '701-0-12345-6 (KTB)', active: true }]);
    } else if (activeTab === 'BUDGET_CODE') {
      setBudgetCategories([...budgetCategories, { id: newId, code: newRecord.code, name: newRecord.name, gfmisCode: newRecord.extra || '-', type: newRecord.type || 'งบดำเนินงาน', active: true }]);
    } else if (activeTab === 'PAYER') {
      setPayerSchemes([...payerSchemes, { id: newId, code: newRecord.code, name: newRecord.name, clearingHouse: newRecord.extra || '-', creditDays: 30, active: true }]);
    } else if (activeTab === 'VENDOR') {
      setVendorCategories([...vendorCategories, { id: newId, code: newRecord.code, name: newRecord.name, defaultCreditDays: 30, requiredDocs: newRecord.extra || 'ใบส่งของ', active: true }]);
    } else if (activeTab === 'BANK') {
      setBankAccounts([...bankAccounts, { id: newId, code: newRecord.code, bankName: newRecord.name, branch: newRecord.type || 'สาขาหลัก', accNo: newRecord.extra || '-', accType: 'กระแสรายวัน', purpose: 'เงินบำรุง', active: true }]);
    }

    setShowAddModal(false);
    alertSuccess('เพิ่มรายการใหม่สำเร็จ!', `เพิ่มข้อมูล ${newRecord.name} (${newRecord.code}) เข้าสู่ระบบเรียบร้อย`);
    setNewRecord({ code: '', name: '', type: '', extra: '' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#08294F] flex items-center space-x-2">
            <Settings className="w-6 h-6 text-[#1687E8]" />
            <span>จัดการข้อมูลพื้นฐานของระบบ (System Master Settings)</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            กำหนดข้อมูลองค์กร กลุ่มงาน กองทุน หมวดงบประมาณ สิทธิการรักษา เจ้าหนี้ ธนาคาร และกฎทางการเงิน
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleExportMaster}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>ส่งออก Excel</span>
          </button>

          {activeTab !== 'PROFILE' && activeTab !== 'RULES' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#08294F] hover:bg-[#0D3768] shadow-md shadow-[#08294F]/20 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มรายการใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-1.5 border-b border-gray-200 pb-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'PROFILE', label: 'ข้อมูลหน่วยงาน (Profile)', icon: Building2 },
          { id: 'DEPT', label: `กลุ่มงาน / แผนก (${departments.length})`, icon: Users },
          { id: 'FUND', label: `กองทุน / แหล่งเงิน (${funds.length})`, icon: Layers },
          { id: 'BUDGET_CODE', label: `หมวดงบประมาณ (${budgetCategories.length})`, icon: PieChart },
          { id: 'PAYER', label: `สิทธิการรักษา (${payerSchemes.length})`, icon: Receipt },
          { id: 'VENDOR', label: `ประเภทเจ้าหนี้ (${vendorCategories.length})`, icon: CreditCard },
          { id: 'BANK', label: `บัญชีธนาคาร (${bankAccounts.length})`, icon: Wallet },
          { id: 'RULES', label: 'กฎและพารามิเตอร์การเงิน', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as MasterTab);
                setSearchQuery('');
              }}
              className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#08294F] text-white font-bold shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar for Table Tabs */}
      {activeTab !== 'PROFILE' && activeTab !== 'RULES' && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหารหัส หรือชื่อรายการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#1687E8] focus:ring-1 focus:ring-[#1687E8]"
            />
          </div>
          <span className="text-[11px] text-gray-500">
            คลิกปุ่มสถานะเพื่อ เปิด/ปิด การใช้งานในระบบ
          </span>
        </div>
      )}

      {/* TAB 1: HOSPITAL ORGANIZATION PROFILE */}
      {activeTab === 'PROFILE' && (
        <form onSubmit={handleSaveProfile} className="card-soft p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-[#1687E8]" />
              <span>ข้อมูลพื้นฐานโรงพยาบาลและหน่วยบริการ (Organization Profile)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              ข้อมูลนี้จะถูกนำไปใช้ในหัวรายงานทางการ แบบพิมพ์ใบเสร็จรับเงิน ใบสำคัญจ่าย และรายงานเสนอกระทรวง
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">ชื่อโรงพยาบาล</label>
              <input
                type="text"
                value={hospitalProfile.hospitalName}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, hospitalName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-semibold text-[#08294F] focus:border-[#1687E8] focus:ring-1 focus:ring-[#1687E8]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">รหัสหน่วยบริการ (Hcode 5 หลัก)</label>
              <input
                type="text"
                value={hospitalProfile.hcode}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, hcode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F] focus:border-[#1687E8] focus:ring-1 focus:ring-[#1687E8]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ระดับหน่วยบริการ</label>
              <input
                type="text"
                value={hospitalProfile.hospitalType}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, hospitalType: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">สังกัดกระทรวง</label>
              <input
                type="text"
                value={hospitalProfile.ministry}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, ministry: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">เขตสุขภาพ</label>
              <input
                type="text"
                value={hospitalProfile.healthRegion}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, healthRegion: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
              <input
                type="text"
                value={hospitalProfile.taxId}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, taxId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono text-gray-700"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="block font-bold text-gray-700 mb-1">ที่อยู่สถานที่ตั้งหน่วยบริการ</label>
              <input
                type="text"
                value={hospitalProfile.address}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">เบอร์โทรศัพท์ติดต่อ / แฟกซ์</label>
              <input
                type="text"
                value={hospitalProfile.phone}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ปีงบประมาณปัจจุบัน (พ.ศ.)</label>
              <input
                type="text"
                value={hospitalProfile.currentFiscalYear}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, currentFiscalYear: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-bold text-[#1687E8]"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">หัวหน้ากลุ่มงานการเงินและบัญชี (CFO)</label>
              <input
                type="text"
                value={hospitalProfile.cfoName}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, cfoName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">ผู้อำนวยการโรงพยาบาล</label>
              <input
                type="text"
                value={hospitalProfile.directorName}
                onChange={(e) => setHospitalProfile({ ...hospitalProfile, directorName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#08294F] to-[#1687E8] hover:opacity-95 shadow-md shadow-[#08294F]/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกข้อมูลหน่วยงาน</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: DEPARTMENTS */}
      {activeTab === 'DEPT' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสกลุ่มงาน</th>
                <th className="py-3 px-4">ชื่อกลุ่มงาน / แผนก</th>
                <th className="py-3 px-4">ประเภท</th>
                <th className="py-3 px-4">หัวหน้ากลุ่มงาน</th>
                <th className="py-3 px-4">เบอร์ต่อภายใน</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {departments
                .filter((d) => d.name.includes(searchQuery) || d.code.includes(searchQuery))
                .map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{d.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{d.name}</td>
                    <td className="py-3 px-4 text-gray-500">{d.type}</td>
                    <td className="py-3 px-4 text-gray-700">{d.head}</td>
                    <td className="py-3 px-4 font-mono text-gray-500">{d.ext}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setDepartments, d.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          d.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {d.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{d.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: FUNDS */}
      {activeTab === 'FUND' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสกองทุน</th>
                <th className="py-3 px-4">ชื่อกองทุน / แหล่งเงิน</th>
                <th className="py-3 px-4">คำอธิบายวัตถุประสงค์</th>
                <th className="py-3 px-4">บัญชีเงินฝากที่ผูกพัน</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {funds
                .filter((f) => f.name.includes(searchQuery) || f.code.includes(searchQuery))
                .map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{f.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{f.name}</td>
                    <td className="py-3 px-4 text-gray-500">{f.description}</td>
                    <td className="py-3 px-4 font-mono text-blue-700">{f.bankAcc}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setFunds, f.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          f.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {f.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{f.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: BUDGET CATEGORIES */}
      {activeTab === 'BUDGET_CODE' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสหมวด</th>
                <th className="py-3 px-4">ชื่อหมวดงบประมาณ / รายจ่าย</th>
                <th className="py-3 px-4">ประเภทงบประมาณ</th>
                <th className="py-3 px-4">รหัสบัญชี GFMIS</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {budgetCategories
                .filter((b) => b.name.includes(searchQuery) || b.code.includes(searchQuery))
                .map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{b.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{b.name}</td>
                    <td className="py-3 px-4 text-gray-600">{b.type}</td>
                    <td className="py-3 px-4 font-mono text-purple-700 font-semibold">{b.gfmisCode}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setBudgetCategories, b.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {b.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{b.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: HEALTHCARE PAYER SCHEMES */}
      {activeTab === 'PAYER' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสสิทธิ</th>
                <th className="py-3 px-4">ชื่อสิทธิการรักษาพยาบาล (Payer Scheme)</th>
                <th className="py-3 px-4">หน่วยงาน Clearing House</th>
                <th className="py-3 px-4 text-center">เครดิตเทอม (วัน)</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {payerSchemes
                .filter((p) => p.name.includes(searchQuery) || p.code.includes(searchQuery))
                .map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{p.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{p.name}</td>
                    <td className="py-3 px-4 text-gray-600">{p.clearingHouse}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{p.creditDays} วัน</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setPayerSchemes, p.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {p.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{p.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: VENDOR CATEGORIES */}
      {activeTab === 'VENDOR' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสหมวด</th>
                <th className="py-3 px-4">ประเภทเจ้าหนี้ / ผู้ขาย</th>
                <th className="py-3 px-4 text-center">เครดิตเทอมมาตรฐาน (วัน)</th>
                <th className="py-3 px-4">เอกสารประกอบการเบิกจ่ายที่จำเป็น</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {vendorCategories
                .filter((v) => v.name.includes(searchQuery) || v.code.includes(searchQuery))
                .map((v) => (
                  <tr key={v.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{v.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{v.name}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{v.defaultCreditDays} วัน</td>
                    <td className="py-3 px-4 text-gray-600">{v.requiredDocs}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setVendorCategories, v.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          v.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {v.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{v.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 7: BANK ACCOUNTS */}
      {activeTab === 'BANK' && (
        <div className="card-soft overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#08294F] text-white">
              <tr>
                <th className="py-3 px-4">รหัสอ้างอิง</th>
                <th className="py-3 px-4">ธนาคาร</th>
                <th className="py-3 px-4">สาขา</th>
                <th className="py-3 px-4">เลขที่บัญชี</th>
                <th className="py-3 px-4">ประเภทบัญชี</th>
                <th className="py-3 px-4">วัตถุประสงค์บัญชี</th>
                <th className="py-3 px-4 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {bankAccounts
                .filter((b) => b.bankName.includes(searchQuery) || b.accNo.includes(searchQuery))
                .map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono font-bold text-[#08294F]">{b.code}</td>
                    <td className="py-3 px-4 font-bold text-gray-800">{b.bankName}</td>
                    <td className="py-3 px-4 text-gray-500">{b.branch}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">{b.accNo}</td>
                    <td className="py-3 px-4 text-gray-600">{b.accType}</td>
                    <td className="py-3 px-4 text-gray-600">{b.purpose}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(setBankAccounts, b.id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-colors ${
                          b.active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {b.active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                        <span>{b.active ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 8: FINANCIAL RULES & PARAMETERS */}
      {activeTab === 'RULES' && (
        <form onSubmit={handleSaveRules} className="card-soft p-6 space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#1687E8]" />
              <span>การตั้งค่าระเบียบและพารามิเตอร์ทางการเงิน (Financial Rules & Parameters)</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              กำหนดระยะเวลาเตือนภัย เกณฑ์การคำนวณสำรองหนี้สงสัยจะสูญ และวงเงินการอนุมัติ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                กำหนดส่งใช้คืนเงินยืมราชการ (วัน)
              </label>
              <input
                type="number"
                value={financialRules.loanDueDays}
                onChange={(e) => setFinancialRules({ ...financialRules, loanDueDays: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F]"
              />
              <p className="text-[11px] text-gray-500">
                ตามระเบียบกระทรวงการคลัง (ปกติไม่เกิน 30 วันนับจากเสร็จสิ้นกิจกรรม)
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                แจ้งเตือนล่วงหน้าก่อนครบกำหนดเงินยืม (วัน)
              </label>
              <input
                type="number"
                value={financialRules.loanWarningDays}
                onChange={(e) => setFinancialRules({ ...financialRules, loanWarningDays: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F]"
              />
              <p className="text-[11px] text-gray-500">
                ระบบจะส่ง Alert ไปยังผู้ยืมล่วงหน้า 7 วันก่อนครบกำหนด
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                แจ้งเตือนเจ้าหนี้ใกล้ครบกำหนด (วัน)
              </label>
              <input
                type="number"
                value={financialRules.apWarningDays}
                onChange={(e) => setFinancialRules({ ...financialRules, apWarningDays: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F]"
              />
              <p className="text-[11px] text-gray-500">
                แจ้งเตือนใน Financial Alert Panel ล่วงหน้า 7 วัน
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                % การตั้งสำรองหนี้สงสัยจะสูญ (หนี้ &gt; 90 วัน)
              </label>
              <input
                type="number"
                value={financialRules.provisionOverdue90Rate}
                onChange={(e) => setFinancialRules({ ...financialRules, provisionOverdue90Rate: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-rose-700"
              />
              <p className="text-[11px] text-gray-500">
                คิดอัตราสำรอง % สำหรับลูกหนี้ค่ารักษาค้างเกิน 90 วัน
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                วงเงินอนุมัติสูงสุดของ CFO (บาท)
              </label>
              <input
                type="number"
                value={financialRules.cfoApprovalLimit}
                onChange={(e) => setFinancialRules({ ...financialRules, cfoApprovalLimit: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F]"
              />
              <p className="text-[11px] text-gray-500">
                รายการที่ยอดเงินเกินจากนี้ต้องเสนอผู้อำนวยการโรงพยาบาล
              </p>
            </div>

            <div className="p-4 rounded-xl border border-gray-200 space-y-2">
              <label className="block font-bold text-gray-800">
                วันที่ตัดรอบปิดงวดบัญชีประจำเดือน (Day)
              </label>
              <input
                type="number"
                value={financialRules.periodClosingDay}
                onChange={(e) => setFinancialRules({ ...financialRules, periodClosingDay: parseInt(e.target.value, 10) })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 font-mono font-bold text-[#08294F]"
              />
              <p className="text-[11px] text-gray-500">
                วันที่ 25 ของทุกเดือน ระบบจะแจ้งเตือนเตรียมปิดงวดบัญชี
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#08294F] to-[#1687E8] hover:opacity-95 shadow-md shadow-[#08294F]/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการตั้งค่านโยบายการเงิน</span>
            </button>
          </div>
        </form>
      )}

      {/* Modal Add New Record */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#08294F] flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-[#1687E8]" />
                <span>เพิ่มรายการข้อมูลหลักใหม่: {activeTab}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">รหัสรายการ (Code) *</label>
                <input
                  type="text"
                  placeholder="เช่น DEPT-008 หรือ FUND-05"
                  value={newRecord.code}
                  onChange={(e) => setNewRecord({ ...newRecord, code: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1687E8]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ชื่อรายการ (Name) *</label>
                <input
                  type="text"
                  placeholder="เช่น กลุ่มงานทันตกรรม หรือ กองทุนวิจัย"
                  value={newRecord.name}
                  onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1687E8]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ประเภท / กลุ่ม (Type / Category)</label>
                <input
                  type="text"
                  placeholder="เช่น บริการทางการแพทย์, ฝ่ายบริหาร"
                  value={newRecord.type}
                  onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1687E8]"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">ข้อมูลเพิ่มเติม / คำอธิบาย</label>
                <input
                  type="text"
                  placeholder="เช่น หัวหน้ากลุ่มงาน, วัตถุประสงค์ หรือ เลขที่บัญชี"
                  value={newRecord.extra}
                  onChange={(e) => setNewRecord({ ...newRecord, extra: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-[#1687E8]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#08294F] text-white font-bold hover:bg-[#0D3768]"
                >
                  บันทึกข้อมูล
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

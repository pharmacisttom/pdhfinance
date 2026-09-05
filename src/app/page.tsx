import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Building2,
  Wallet,
  Users,
  CreditCard,
  PieChart,
  ArrowRight,
  CheckCircle2,
  Lock,
  Layers,
  FileCheck2,
  Activity,
  Receipt,
  Landmark,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F8FC] flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-[#08294F]/95 backdrop-blur-md text-white border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1687E8] to-[#08A7A4] flex items-center justify-center shadow-lg shadow-[#1687E8]/20">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-wide block text-white leading-tight">
                FINANCE CONTROL PLATFORM
              </span>
              <span className="text-xs text-blue-200 block">
                ระบบบริหารการเงิน งบประมาณ ลูกหนี้ เจ้าหนี้ และเงินยืม
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-all duration-200 border border-white/15 backdrop-blur-sm"
            >
              เข้าสู่ระบบ (Login)
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1687E8] to-[#08A7A4] hover:from-[#116DBE] hover:to-[#068684] text-white text-sm font-semibold shadow-lg shadow-[#1687E8]/25 transition-all duration-200 flex items-center space-x-1.5"
            >
              <span>เข้าสู่ Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#08294F] via-[#0D3768] to-[#08294F] text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1687E8_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[#08A7A4] animate-pulse"></span>
            <span>มาตรฐานระบบการเงินการคลังภาครัฐ & โรงพยาบาลระดับ Enterprise</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
            "เห็นเงิน เห็นหนี้ เห็นภาระผูกพัน<br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1687E8] via-[#08A7A4] to-cyan-300">
              เห็นกำหนดชำระ
            </span> และตรวจสอบย้อนหลังได้จากระบบเดียว"
          </h1>

          <p className="text-base sm:text-xl text-blue-100/90 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            แพลตฟอร์มบริหารจัดการการเงินครบวงจร บูรณาการเงินสด ธนาคาร ทะเบียนลูกหนี้-เจ้าหนี้
            สัญญาเงินยืมราชการ และการควบคุมวงเงินงบประมาณแบบ Real-time พร้อมระบบ Audit Trail ป้องกันความผิดพลาด
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#1687E8] to-[#08A7A4] hover:from-[#116DBE] hover:to-[#068684] text-white font-semibold shadow-xl shadow-[#1687E8]/30 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <Activity className="w-5 h-5" />
              <span>เปิดใช้งาน Finance Dashboard</span>
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium border border-white/20 transition-all duration-200 flex items-center justify-center space-x-2 text-base"
            >
              <Lock className="w-4 h-4 text-cyan-300" />
              <span>เข้าสู่ระบบด้วยสิทธิ์ผู้ใช้งาน</span>
            </Link>
          </div>

          {/* Highlights Mini Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pt-10 border-t border-white/10">
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div className="text-xs text-blue-200 mt-1">กระทบยอดธนาคารสมบูรณ์</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-bold text-[#08A7A4]">Real-time</div>
              <div className="text-xs text-blue-200 mt-1">คำนวณอายุหนี้ Aging</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-bold text-[#1687E8]">ปีงบประมาณไทย</div>
              <div className="text-xs text-blue-200 mt-1">1 ต.ค. - 30 ก.ย. อัตโนมัติ</div>
            </div>
            <div className="text-center p-3">
              <div className="text-2xl sm:text-3xl font-bold text-white">Audit Trail</div>
              <div className="text-xs text-blue-200 mt-1">บันทึกทุก Action ปลอดภัย</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24">
        
        {/* Section 1: ปัญหาที่มักพบก่อนใช้ระบบ (3 Cards) */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[#FF4664] font-semibold text-sm tracking-wider uppercase bg-[#FFF0F2] px-3.5 py-1 rounded-full border border-[#FF4664]/20">
              Pain Points & Challenges
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#08294F] mt-3">
              ปัญหาที่มักพบก่อนใช้ระบบ
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              อุปสรรคสำคัญในการบริหารการเงินของหน่วยงานที่ทำให้ขาดสภาพคล่องและเสี่ยงต่อการถูกตรวจสอบ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="card-soft p-8 relative overflow-hidden group border-l-4 border-l-[#FF4664]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0F2] flex items-center justify-center mb-6 text-[#FF4664] group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-[#FF4664] tracking-wider uppercase mb-1">ปัญหาที่ 1</div>
              <h3 className="text-xl font-bold text-[#08294F] mb-3">
                ไม่รู้ภาระผูกพันล่วงหน้า
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                มีใบสั่งซื้อ สัญญา หรือข้อตกลงเกิดขึ้นที่แผนกต้นทาง แต่เอกสารยังไม่ส่งถึงฝ่ายการเงิน
                ทำให้ไม่ทราบยอดที่ต้องจ่ายล่วงหน้า 7, 15, 30 วัน จนกระทบสภาพคล่องเงินสดในบัญชี
              </p>
            </div>

            {/* Card 2 */}
            <div className="card-soft p-8 relative overflow-hidden group border-l-4 border-l-[#FF4664]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0F2] flex items-center justify-center mb-6 text-[#FF4664] group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-[#FF4664] tracking-wider uppercase mb-1">ปัญหาที่ 2</div>
              <h3 className="text-xl font-bold text-[#08294F] mb-3">
                เงินยืมค้างนานโดยไม่มีใครติดตาม
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                เจ้าหน้าที่ยืมเงินทดรองราชการไปปฏิบัติงานหรือจัดโครงการแล้วลืมคืนเงินตามกำหนด 30 วัน
                ไม่มีระบบแจ้งเตือนอัตโนมัติ ส่งผลให้ยอดลูกหนี้เงินยืมค้างทับถมข้ามปีงบประมาณ
              </p>
            </div>

            {/* Card 3 */}
            <div className="card-soft p-8 relative overflow-hidden group border-l-4 border-l-[#FF4664]">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF0F2] flex items-center justify-center mb-6 text-[#FF4664] group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <div className="text-xs font-bold text-[#FF4664] tracking-wider uppercase mb-1">ปัญหาที่ 3</div>
              <h3 className="text-xl font-bold text-[#08294F] mb-3">
                ลูกหนี้ค้างชำระไม่มีการจัดกลุ่มตามอายุหนี้
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                ยอดลูกหนี้ค่ารักษาพยาบาล สปสช. ประกันสังคม และข้าราชการ ถูกบันทึกกระจัดกระจายใน Excel
                ไม่ทราบว่าหนี้ก้อนไหนเกิน 30, 60, 90 วัน ขาดการวิเคราะห์ Aging เพื่อทวงหนี้อย่างเป็นระบบ
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: ระบบทำอะไรได้บ้าง (4 Cards) */}
        <section className="bg-gradient-to-br from-[#EEF4FC] to-[#E7F3FD] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-3xl">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[#1687E8] font-semibold text-sm tracking-wider uppercase bg-blue-100/70 px-3.5 py-1 rounded-full border border-[#1687E8]/20">
                Core Capabilities
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-[#08294F] mt-3">
                ระบบทำอะไรได้บ้าง
              </h2>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">
                โมดูลการเงิน 4 เสาหลักที่เชื่อมโยงกันอย่างสมบูรณ์แบบ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-md transition-all border border-blue-100/80">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1687E8] flex items-center justify-center mb-5">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#08294F] mb-2">
                  เงินสดและเงินฝากธนาคาร
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  จัดการทะเบียนสมุดบัญชีธนาคาร (KTB, SCB, BBL), นำเข้า Statement จับคู่กระทบยอด (Reconciliation) อัตโนมัติ พร้อมระบบปิดยอดรายวันและปิดงวดประจำเดือน
                </p>
                <div className="text-xs font-semibold text-[#1687E8] flex items-center space-x-1">
                  <span>Reconciliation & Closing</span>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-md transition-all border border-blue-100/80">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#08A7A4] flex items-center justify-center mb-5">
                  <Receipt className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#08294F] mb-2">
                  ลูกหนี้และเจ้าหนี้
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  ทะเบียนลูกหนี้ UC/SSS/CSMBS คำนวณ Aging อัตโนมัติ (ไม่เกิน 30, 31-60, 61-90, มากกว่า 90 วัน), ออกใบเสร็จรับเงิน, บริหารเจ้าหนี้การค้า ค่ายา เวชภัณฑ์ และกำหนดชำระเงิน
                </p>
                <div className="text-xs font-semibold text-[#08A7A4] flex items-center space-x-1">
                  <span>Aging Analysis & Vouchers</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-md transition-all border border-blue-100/80">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-5">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#08294F] mb-2">
                  ยืมเงินราชการ
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Workflow อนุมัติการยืมเงินทดรองราชการ ตรวจสอบกำหนดส่งใช้ ระบบแจ้งเตือน 7, 3, 1 วันก่อนครบกำหนด และระบบเคลียร์เงินยืมรองรับคืนเงิน/หักล้างเอกสาร
                </p>
                <div className="text-xs font-semibold text-amber-600 flex items-center space-x-1">
                  <span>Lifecycle & Clearance</span>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-soft-md transition-all border border-blue-100/80">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5">
                  <PieChart className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-[#08294F] mb-2">
                  งบประมาณและรายได้
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  โครงสร้างงบประมาณตามปีงบประมาณไทย กองทุน โครงการ แผนก ควบคุมวงเงินป้องกันงบติดลบ (Budget Control Engine) และวิเคราะห์รายได้สะสมแยกตามแหล่งเงิน
                </p>
                <div className="text-xs font-semibold text-indigo-600 flex items-center space-x-1">
                  <span>Real-time Budget Control</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: ลำดับการทำงานในระบบ (4 Steps) */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[#08A7A4] font-semibold text-sm tracking-wider uppercase bg-[#E6F6F6] px-3.5 py-1 rounded-full border border-[#08A7A4]/20">
              System Workflow
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#08294F] mt-3">
              ลำดับการทำงานในระบบ
            </h2>
            <p className="text-gray-600 mt-2 text-sm sm:text-base">
              กระบวนการ 4 ขั้นตอนที่รัดกุมตามระเบียบพัสดุและการเงินการคลังภาครัฐ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="card-soft p-6 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#08294F] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                1
              </div>
              <h3 className="text-base font-bold text-[#08294F] mb-2">
                Step 1: รับข้อมูลจากต้นทาง
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                บันทึกภาระผูกพัน (Commitment), สัญญาจ้าง, PO, สัญญายืมเงินราชการ และข้อมูลเรียกเก็บค่ารักษาพยาบาล
              </p>
            </div>

            {/* Step 2 */}
            <div className="card-soft p-6 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#1687E8] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                2
              </div>
              <h3 className="text-base font-bold text-[#08294F] mb-2">
                Step 2: ตั้งหนี้และตั้งลูกหนี้
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                สร้างเอกสารลูกหนี้ (AR) และเจ้าหนี้ (AP) เมื่อได้รับใบแจ้งหนี้ พร้อมตรวจสอบวงเงินงบประมาณอัตโนมัติ
              </p>
            </div>

            {/* Step 3 */}
            <div className="card-soft p-6 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-[#08A7A4] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                3
              </div>
              <h3 className="text-base font-bold text-[#08294F] mb-2">
                Step 3: รับ-จ่ายเงินจริง
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                ออกใบสำคัญจ่าย (PV), ใบเสร็จรับเงิน (RC), ตัดยอดลูกหนี้/เจ้าหนี้ และบันทึกบัญชีเงินฝากธนาคารแบบ Transaction
              </p>
            </div>

            {/* Step 4 */}
            <div className="card-soft p-6 flex flex-col items-center text-center relative">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md">
                4
              </div>
              <h3 className="text-base font-bold text-[#08294F] mb-2">
                Step 4: กระทบยอดและรายงาน
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Reconcile Statement ธนาคาร, ปิดยอดประจำวัน/งวดประจำเดือน และออกรายงานผู้บริหาร 16 ชุด
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: สิ่งที่เปลี่ยนไปเมื่อใช้ระบบ (4 Checkmarks) */}
        <section className="bg-[#08294F] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#1687E8]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-[#08A7A4] font-semibold text-xs sm:text-sm tracking-wider uppercase bg-white/10 px-3.5 py-1 rounded-full border border-[#08A7A4]/30">
                Key Transformation
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold mt-3">
                สิ่งที่เปลี่ยนไปเมื่อใช้ระบบ
              </h2>
              <p className="text-blue-200 mt-2 text-sm sm:text-base">
                ผลลัพธ์ที่เป็นรูปธรรมและยกระดับธรรมาภิบาลทางการเงินขององค์กร
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#08A7A4]/20 text-[#08A7A4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    เห็นภาระผูกพันที่กำลังจะถึงกำหนด
                  </h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed">
                    วางแผนบริหารสภาพคล่องเงินสดในมือล่วงหน้า 7, 15, 30, 60 วันได้อย่างแม่นยำ ไม่สะดุด
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#08A7A4]/20 text-[#08A7A4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    ลูกหนี้ถูกจัดกลุ่มตามอายุหนี้
                  </h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed">
                    ระบบคำนวณ Aging อัตโนมัติทุกวัน แยกหนี้ตามกลุ่มสิทธิและอายุหนี้ พร้อมสำหรับกระบวนการติดตามหนี้ทันที
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#08A7A4]/20 text-[#08A7A4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    เงินยืมแจ้งเตือนก่อนครบกำหนด
                  </h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed">
                    แจ้งเตือนล่วงหน้า 7 วัน 3 วัน 1 วัน และแจ้งเตือนเมื่อเกินกำหนด ลดปัญหาเงินยืมค้างนานข้ามปีงบประมาณ
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#08A7A4]/20 text-[#08A7A4] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">
                    รายการการเงินตรวจสอบย้อนหลังได้
                  </h3>
                  <p className="text-blue-100/80 text-sm leading-relaxed">
                    Audit Trail บันทึกทุกความเคลื่อนไหว ใคร ทำอะไร ที่ไหน เมื่อไหร่ พร้อมข้อมูลก่อนและหลังแก้ไขอย่างโปร่งใส
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#1687E8] to-[#08A7A4] text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all text-base"
              >
                <span>เข้าสู่ระบบบริหารการเงิน (Finance Platform)</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#08294F] text-blue-200 border-t border-white/10 py-8 px-4 text-center text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Landmark className="w-4 h-4 text-[#08A7A4]" />
            <span className="font-semibold text-white">FINANCE CONTROL PLATFORM</span>
            <span>- สำหรับโรงพยาบาลและหน่วยงานราชการ</span>
          </div>
          <div className="text-blue-300">
            มาตรฐานปีงบประมาณไทย • รองรับ Production บน Ubuntu VPS
          </div>
        </div>
      </footer>
    </div>
  );
}

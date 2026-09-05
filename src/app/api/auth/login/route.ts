import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { generateSessionToken, setSessionCookie } from '@/lib/auth';
import { store } from '@/lib/data-store';

// Demo users with roles
const USER_ACCOUNTS: Record<string, { id: string; username: string; email: string; fullName: string; role: string; departmentId: string; departmentName: string; position: string }> = {
  admin: {
    id: 'usr-admin',
    username: 'admin',
    email: 'admin@hospital.moph.go.th',
    fullName: 'ผู้ดูแลระบบสูงสุด (Super Administrator)',
    role: 'SUPER_ADMIN',
    departmentId: 'dept-7',
    departmentName: 'กลุ่มงานบริหารทั่วไป',
    position: 'ผู้อำนวยการฝ่ายเทคโนโลยีสารสนเทศ',
  },
  cfo: {
    id: 'usr-cfo',
    username: 'cfo',
    email: 'cfo@hospital.moph.go.th',
    fullName: 'นพ. ชวลิต การเงินมั่นคง (CFO / รอง ผอ. ฝ่ายการเงิน)',
    role: 'CFO',
    departmentId: 'dept-5',
    departmentName: 'กลุ่มงานการเงินและบัญชี',
    position: 'รองผู้อำนวยการฝ่ายการเงินและแผนงาน',
  },
  finance: {
    id: 'usr-fin',
    username: 'finance',
    email: 'finance@hospital.moph.go.th',
    fullName: 'นางสาวดาริกา พัฒนศิลป์ (หัวหน้างานการเงิน)',
    role: 'FINANCE',
    departmentId: 'dept-5',
    departmentName: 'กลุ่มงานการเงินและบัญชี',
    position: 'นักวิชาการเงินและบัญชีชำนาญการ',
  },
  budget: {
    id: 'usr-bdg',
    username: 'budget',
    email: 'budget@hospital.moph.go.th',
    fullName: 'นายสมเกียรติ แผนงานดี (หัวหน้างานงบประมาณ)',
    role: 'BUDGET',
    departmentId: 'dept-6',
    departmentName: 'กลุ่มงานยุทธศาสตร์และงบประมาณ',
    position: 'นักวิเคราะห์นโยบายและแผนชำนาญการพิเศษ',
  },
  auditor: {
    id: 'usr-aud',
    username: 'auditor',
    email: 'auditor@hospital.moph.go.th',
    fullName: 'นางสุภาพร ตรวจสอบเข้ม (ผู้ตรวจสอบภายใน)',
    role: 'AUDITOR',
    departmentId: 'dept-7',
    departmentName: 'หน่วยตรวจสอบภายใน',
    position: 'ผู้ตรวจสอบภายในวิชาชีพ',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, rememberMe } = body;

    if (!username || !password) {
      return apiError('กรุณากรอกชื่อผู้ใช้งานหรืออีเมล และรหัสผ่าน', 'VALIDATION_ERROR', 400);
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = USER_ACCOUNTS[cleanUsername] || Object.values(USER_ACCOUNTS).find(u => u.email.toLowerCase() === cleanUsername);

    // Standard password check (accepts password123 or matches demo users)
    if (!user || (password !== 'password123' && password !== 'admin123' && password !== 'cfo123' && password !== 'finance123')) {
      // Log failed attempt in audit
      store.logAudit({
        username: cleanUsername,
        action: 'LOGIN',
        module: 'AUTH',
        entity: 'User',
        beforeData: null,
        afterData: { status: 'FAILED', reason: 'Invalid credentials' },
        ipAddress: req.ip || '127.0.0.1',
      });

      return apiError('ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง', 'INVALID_CREDENTIALS', 401);
    }

    // Generate Session Token
    const sessionToken = generateSessionToken();
    const maxAge = rememberMe ? 30 * 24 * 3600 : 8 * 3600; // 30 days or 8 hours
    await setSessionCookie(sessionToken, maxAge);

    // Log Successful Login
    store.logAudit({
      userId: user.id,
      username: user.username,
      role: user.role,
      action: 'LOGIN',
      module: 'AUTH',
      entity: 'User',
      entityId: user.id,
      beforeData: null,
      afterData: { status: 'SUCCESS', ip: req.ip || '127.0.0.1' },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({
      user,
      sessionToken,
    });
  } catch (err: any) {
    return apiError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'SERVER_ERROR', 500);
  }
}

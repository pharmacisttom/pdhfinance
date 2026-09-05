import { NextRequest } from 'next/server';
import { apiSuccess, apiError } from '@/lib/api-response';
import { generateSessionToken, setSessionCookie, verifyPassword } from '@/lib/auth';
import { store } from '@/lib/data-store';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Demo users with roles (Fallback)
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
    let authUser: any = null;
    let isPasswordValid = false;

    // 1. Try checking against MySQL Database via Prisma
    try {
      const dbUser = await prisma.user.findFirst({
        where: {
          OR: [
            { username: cleanUsername },
            { email: cleanUsername },
          ],
        },
        include: {
          role: true,
          department: true,
        },
      });

      if (dbUser) {
        // Verify bcrypt password from DB, or match pdhfinace10832 / password123
        const passwordMatches = await bcrypt.compare(password, dbUser.passwordHash);
        if (
          passwordMatches ||
          password === 'pdhfinance10832' ||
          password === 'pdhfinace10832' ||
          password === 'password123'
        ) {
          isPasswordValid = true;
          authUser = {
            id: dbUser.id,
            username: dbUser.username,
            email: dbUser.email,
            fullName: dbUser.fullName,
            role: dbUser.role?.code || 'ADMIN',
            departmentId: dbUser.departmentId,
            departmentName: dbUser.department?.name,
            position: dbUser.position,
          };

          // Update last login in MySQL
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastLoginAt: new Date(),
              lastLoginIp: req.ip || '127.0.0.1',
              failedLoginAttempts: 0,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('Prisma DB query failed, falling back to local store:', dbErr);
    }

    // 2. Fallback to in-memory store if not verified via DB
    if (!authUser) {
      const fallbackUser = USER_ACCOUNTS[cleanUsername] || Object.values(USER_ACCOUNTS).find(u => u.email.toLowerCase() === cleanUsername);
      if (fallbackUser) {
        if (
          password === 'pdhfinance10832' ||
          password === 'pdhfinace10832' ||
          password === 'password123' ||
          password === 'admin123' ||
          password === 'cfo123' ||
          password === 'finance123'
        ) {
          isPasswordValid = true;
          authUser = fallbackUser;
        }
      }
    }

    if (!isPasswordValid || !authUser) {
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
      userId: authUser.id,
      username: authUser.username,
      role: authUser.role,
      action: 'LOGIN',
      module: 'AUTH',
      entity: 'User',
      entityId: authUser.id,
      beforeData: null,
      afterData: { status: 'SUCCESS', ip: req.ip || '127.0.0.1' },
      ipAddress: req.ip || '127.0.0.1',
    });

    return apiSuccess({
      user: authUser,
      sessionToken,
    });
  } catch (err: any) {
    return apiError(err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'SERVER_ERROR', 500);
  }
}

import { NextRequest } from 'next/server';
import { apiSuccess } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  // Return current active session user or default admin
  const user = {
    id: 'usr-cfo',
    username: 'cfo',
    email: 'cfo@hospital.moph.go.th',
    fullName: 'นพ. ชวลิต การเงินมั่นคง (CFO)',
    role: 'CFO',
    departmentId: 'dept-5',
    departmentName: 'กลุ่มงานการเงินและบัญชี',
    position: 'รองผู้อำนวยการฝ่ายการเงินและแผนงาน',
  };

  return apiSuccess({ user });
}

import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'finance_session_token';

export interface AuthSessionUser {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  departmentId?: string | null;
  departmentName?: string | null;
  position?: string | null;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateSessionToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~';
  let token = '';
  for (let i = 0; i < 64; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${Date.now()}_${token}`;
}

export async function setSessionCookie(token: string, maxAge = 28800) {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: maxAge, // 8 hours
  });
}

export async function clearSessionCookie() {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getSessionTokenFromCookies(): Promise<string | undefined> {
  const cookieStore = cookies();
  return cookieStore.get(SESSION_COOKIE_NAME)?.value;
}

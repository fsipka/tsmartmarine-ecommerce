import { JWTPayload, UserSession, SessionData } from './types';
import { companyService } from '../api/services/company.service';

const SESSION_KEY = 'marine_session';
const CONTENT_URL = process.env.NEXT_PUBLIC_CONTENT_URL || 'https://marineapi.tsmart.ai/contents';

/**
 * JWT token'ı decode eder
 */
export function decodeJWT(token: string): JWTPayload | null {
  if (!token || typeof token !== 'string') {
    return null;
  }

  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

/**
 * Content URL oluşturur (companyLogoUrl veya user image için)
 */
export function getContentUrl(filename: string | null | undefined): string | null {
  if (!filename) return null;
  return `${CONTENT_URL}/${filename}`;
}

/**
 * Token'dan UserSession objesi oluşturur
 */
export async function createUserSessionFromToken(
  accessToken: string,
  refreshToken: string,
  expiresAt: string
): Promise<UserSession | null> {
  const payload = decodeJWT(accessToken);
  if (!payload) return null;

  const userImageClaim = payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri'];

  // Fetch company logo from API if companyId exists
  let companyLogoUrl = '';
  if (payload.companyId) {
    try {
      const company = await companyService.getCompanyWithDetails(parseInt(payload.companyId));
      const logoUrl = companyService.getCompanyLogoUrl(company);
      companyLogoUrl = logoUrl || '';
    } catch (error) {
      console.error('Failed to fetch company logo:', error);
      // Fallback to token's companyLogoUrl if API call fails
      companyLogoUrl = getContentUrl(payload.companyLogoUrl) || '';
    }
  }

  return {
    id: payload.sub,
    name: payload.name,
    imageUrl: getContentUrl(userImageClaim),
    companyId: payload.companyId,
    companyName: payload.companyName,
    companyLogoUrl,
    isCustomer: payload.isCustomer === 'true',
    roles: payload.roles,
    accessToken,
    refreshToken,
    expiresAt: payload.exp * 1000, // Convert to milliseconds
  };
}

/**
 * Session'ı localStorage'a kaydeder
 */
export function saveSession(user: UserSession): void {
  if (typeof window === 'undefined') return;

  const sessionData: SessionData = {
    user,
    isAuthenticated: true,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
}

/**
 * Session'ı localStorage'dan alır
 */
export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null;

  try {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;

    const session: SessionData = JSON.parse(data);

    // Token expired kontrolü
    if (session.user.expiresAt < Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch (error) {
    clearSession();
    return null;
  }
}

/**
 * Session'ı temizler
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Session'ın geçerli olup olmadığını kontrol eder
 */
export function isSessionValid(): boolean {
  const session = getSession();
  return session !== null && session.isAuthenticated;
}

/**
 * Kullanıcının belirli bir role sahip olup olmadığını kontrol eder
 */
export function hasRole(role: string): boolean {
  const session = getSession();
  if (!session) return false;
  return session.user.roles.includes(role);
}

/**
 * Kullanıcının herhangi bir role sahip olup olmadığını kontrol eder
 */
export function hasAnyRole(roles: string[]): boolean {
  const session = getSession();
  if (!session) return false;
  return roles.some(role => session.user.roles.includes(role));
}

/**
 * Kullanıcının tüm rollere sahip olup olmadığını kontrol eder
 */
export function hasAllRoles(roles: string[]): boolean {
  const session = getSession();
  if (!session) return false;
  return roles.every(role => session.user.roles.includes(role));
}

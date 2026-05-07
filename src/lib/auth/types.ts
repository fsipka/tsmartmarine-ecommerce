export interface JWTPayload {
  sub: string; // user id
  name: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/uri'?: string; // user image claim
  companyName: string;
  companyId: string;
  companyLogoUrl: string;
  isCustomer: string;
  roles: string[];
  approvalStatus?: number;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}

export type AccountType = 'buyer' | 'vendor';

export interface UserSession {
  id: string;
  name: string;
  email?: string;
  imageUrl: string | null;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  isCustomer: boolean;
  roles: string[];
  accountType?: AccountType;
  approvalStatus?: number | null;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SessionData {
  user: UserSession;
  isAuthenticated: boolean;
}

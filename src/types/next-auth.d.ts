import 'next-auth';
import { AccountType } from '@/lib/api/types';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      accessToken: string;
      companyId?: number;
      companyLogoUrl?: string | null;
      accountType?: AccountType;
      approvalStatus?: number;
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string;
    accessToken?: string;
    refreshToken?: string;
    companyId?: number;
    companyLogoUrl?: string | null;
    accountType?: AccountType;
    approvalStatus?: number;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    companyId?: number;
    companyLogoUrl?: string | null;
    accountType?: AccountType;
    approvalStatus?: number;
  }
}
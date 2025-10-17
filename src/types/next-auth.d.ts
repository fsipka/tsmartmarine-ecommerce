import 'next-auth';

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
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
    refreshToken?: string;
    companyId?: number;
    companyLogoUrl?: string | null;
  }
}

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/lib/api/services';
import { AccountType } from '@/lib/api/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
        accountType: { label: 'Account Type', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          const accountType: AccountType =
            credentials.accountType === 'vendor' ? 'vendor' : 'buyer';

          const response = await authService.login({
            email: credentials.email,
            password: credentials.password,
            accountType,
          });

          if (response && response.user) {
            const user = {
              id: response.user.id,
              email: response.user.email,
              name: `${response.user.firstName} ${response.user.lastName}`.trim() || response.user.email,
              companyId: response.user.companyId,
              companyLogoUrl: null,
              accountType: response.user.accountType,
              approvalStatus: response.user.approvalStatus,
              accessToken: response.token,
              refreshToken: response.refreshToken,
            };
            return user as any;
          }

          return null;
        } catch (error: any) {
          console.error('❌ NextAuth authorize - Auth error:', {
            message: error.message,
            responseData: error.response?.data,
            status: error.response?.status,
          });
          throw new Error(
            error.response?.data?.error ||
              error.response?.data?.errors?.[0] ||
              error.response?.data?.ErrorMessage?.[0] ||
              error.response?.data?.message ||
              'Authentication failed',
          );
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
        token.id = (user as any).id;
        token.companyId = (user as any).companyId;
        token.companyLogoUrl = (user as any).companyLogoUrl;
        token.accountType = (user as any).accountType;
        token.approvalStatus = (user as any).approvalStatus;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken as string,
          companyId: token.companyId as number | undefined,
          companyLogoUrl: token.companyLogoUrl as string | null | undefined,
          accountType: token.accountType as AccountType | undefined,
          approvalStatus: token.approvalStatus as number | undefined,
        } as any;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
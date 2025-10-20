import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authService } from '@/lib/api/services';
import { companyService } from '@/lib/api/services/company.service';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'email@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Call your .NET API
          const response = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });


          if (response && response.user) {
            let companyLogoUrl = null;

            // Fetch company logo if user has companyId
            if (response.user.companyId) {
              try {
                const company = await companyService.getCompanyWithDetails(response.user.companyId);
                companyLogoUrl = companyService.getCompanyLogoUrl(company);
              } catch (error) {
                console.error('Failed to fetch company details:', error);
                // Continue with login even if company fetch fails
              }
            }

            const user = {
              id: response.user.id,
              email: response.user.email,
              name: `${response.user.firstName} ${response.user.lastName}`,
              companyId: response.user.companyId,
              companyLogoUrl,
              accessToken: response.token,
              refreshToken: response.refreshToken,
            };
            return user;
          }

          return null;
        } catch (error: any) {
          console.error('❌ NextAuth authorize - Auth error:', {
            message: error.message,
            responseData: error.response?.data,
            status: error.response?.status
          });
          throw new Error(error.response?.data?.message || 'Authentication failed');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.id = user.id;
        token.companyId = user.companyId;
        token.companyLogoUrl = user.companyLogoUrl;
      }

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (token) {
        session.user = {
          ...session.user,
          id: token.id as string,
          accessToken: token.accessToken as string,
          companyId: token.companyId as number | undefined,
          companyLogoUrl: token.companyLogoUrl as string | null | undefined,
        };
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

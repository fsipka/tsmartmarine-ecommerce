import { api } from '../client';
import {
  AccountType,
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  VendorRegisterRequest,
} from '../types';
import { jwtDecode } from 'jwt-decode';

const decode = (accessToken: string): any => {
  try {
    return jwtDecode(accessToken);
  } catch {
    return {};
  }
};

const buildAuthResponse = (
  apiData: any,
  accountType: AccountType,
  fallbackEmail: string,
): AuthResponse => {
  const accessToken = apiData.accessToken || apiData.token;
  const decoded: any = decode(accessToken);
  const companyId = decoded.companyId ? parseInt(String(decoded.companyId), 10) : undefined;
  const approvalStatus =
    decoded.approvalStatus != null ? Number(decoded.approvalStatus) : undefined;

  const user = {
    id: decoded.sub || '',
    email: fallbackEmail,
    firstName: decoded.name?.split(' ')[0] || decoded.name || '',
    lastName: decoded.name?.split(' ').slice(1).join(' ') || '',
    companyId,
    role: accountType === 'vendor' ? 'Vendor' : 'Buyer',
    accountType,
    approvalStatus,
  };

  return {
    token: accessToken,
    refreshToken: apiData.refreshToken,
    expiration: apiData.expiration,
    user,
  };
};

export const authService = {
  // Buyer login — only allows UserType=3 (Buyer).
  loginBuyer: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/Buyers/Login', {
      Email: credentials.email,
      Password: credentials.password,
    });
    const apiData = response.data.data as any;
    if (!apiData) throw new Error('Invalid API response format');
    return buildAuthResponse(apiData, 'buyer', credentials.email);
  },

  // Vendor (company admin) login — uses /Users/Login. Carries approvalStatus
  // claim used by the application-status gate.
  loginVendor: async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/Users/Login', {
      Email: credentials.email,
      Password: credentials.password,
    });
    const apiData = response.data.data as any;
    if (!apiData) throw new Error('Invalid API response format');
    return buildAuthResponse(apiData, 'vendor', credentials.email);
  },

  // Account-type aware login. Falls back to the alternate endpoint if the
  // first one rejects (allows users to sign in without remembering which
  // flavor of account they registered with).
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const order: AccountType[] =
      credentials.accountType === 'vendor' ? ['vendor', 'buyer'] : ['buyer', 'vendor'];
    let lastError: any = null;
    for (const t of order) {
      try {
        if (t === 'vendor') {
          return await authService.loginVendor({
            email: credentials.email,
            password: credentials.password,
          });
        }
        return await authService.loginBuyer({
          email: credentials.email,
          password: credentials.password,
        });
      } catch (err: any) {
        lastError = err;
      }
    }
    throw lastError ?? new Error('Authentication failed');
  },

  // Buyer (regular ecommerce user) registration — UserType=3, CompanyId=null.
  // Returns nothing actionable; client must follow up with login() to obtain
  // a token.
  register: async (data: RegisterRequest): Promise<{ id: number; email: string }> => {
    const response = await api.post<ApiResponse<{ id: number; email: string }>>('/Buyers/Register', {
      Name: (data as any).firstName ?? (data as any).Name ?? '',
      Surname: (data as any).lastName ?? (data as any).Surname ?? '',
      Email: data.email,
      Password: data.password,
      Phone: (data as any).phone ?? (data as any).Phone ?? null,
    });
    if (!response.data.data) throw new Error('Invalid API response format');
    return response.data.data;
  },

  // Vendor registration — creates a Company (ApprovalStatus=Pending) plus an
  // admin User. Returns { company, admin, token, approvalStatus }. The caller
  // can use the embedded token to log in immediately; the user lands on the
  // application-status page until Root approves.
  registerVendor: async (
    data: VendorRegisterRequest,
  ): Promise<{
    company: any;
    admin: { id: number; email: string };
    token: any;
    approvalStatus: number;
  }> => {
    const response = await api.post<ApiResponse<any>>('/Companies/Register', data);
    if (!response.data.data) throw new Error('Invalid API response format');
    return response.data.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/refresh', {
      refreshToken,
    });
    return response.data.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.data;
  },

  // Vendor application status (current company)
  getMyApplication: async () => {
    const response = await api.get<ApiResponse<any>>('/Companies/MyApplication');
    return response.data.data;
  },

  // Re-apply after rejection
  reApply: async (): Promise<void> => {
    await api.post('/Companies/ReApply');
  },
};
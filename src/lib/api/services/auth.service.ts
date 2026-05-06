import { api } from '../client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  // Buyer login — hits /Buyers/Login on the marine API. Backend rejects
  // anything other than UserType=Buyer (3); admin-panel users cannot
  // authenticate through this path.
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/Buyers/Login', {
      Email: credentials.email,
      Password: credentials.password,
    });

    const apiData = response.data.data;
    if (!apiData) {
      throw new Error('Invalid API response format');
    }

    const accessToken = apiData.accessToken || apiData.token;

    let decodedToken: any = {};
    try {
      decodedToken = jwtDecode(accessToken);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
    }

    const user = {
      id: decodedToken.sub || '',
      email: credentials.email,
      firstName: decodedToken.name?.split(' ')[0] || decodedToken.name || '',
      lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
      companyId: undefined,
      role: 'Buyer',
    };

    return {
      token: accessToken,
      refreshToken: apiData.refreshToken,
      expiration: apiData.expiration,
      user,
    };
  },

  // Buyer registration — creates a Users row with UserType=3 (Buyer) and
  // hashed password. Returns nothing actionable; client must follow up with
  // login() to obtain a token.
  register: async (data: RegisterRequest): Promise<{ id: number; email: string }> => {
    const response = await api.post<ApiResponse<{ id: number; email: string }>>('/Buyers/Register', {
      Name: (data as any).firstName ?? (data as any).Name ?? '',
      Surname: (data as any).lastName ?? (data as any).Surname ?? '',
      Email: data.email,
      Password: data.password,
      Phone: (data as any).phone ?? (data as any).Phone ?? null,
    });

    if (!response.data.data) {
      throw new Error('Invalid API response format');
    }
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
};

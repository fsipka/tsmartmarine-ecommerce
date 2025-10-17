import { api } from '../client';
import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest } from '../types';
import { jwtDecode } from 'jwt-decode';

export const authService = {
  // Login
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/users/login', credentials);

      // API response format: { data: { accessToken, refreshToken, expiration, user }, statusCode, errors }
      const apiData = response.data.data;

      if (!apiData) {
        throw new Error('Invalid API response format');
      }

      const accessToken = apiData.accessToken || apiData.token;

      // Decode JWT token to extract user information
      let decodedToken: any = {};
      try {
        decodedToken = jwtDecode(accessToken);
      } catch (error) {
        console.error('Failed to decode JWT token:', error);
      }

      // Create user object from decoded token
      const user = {
        id: decodedToken.sub || '',
        email: decodedToken.email || '',
        firstName: decodedToken.name?.split(' ')[0] || decodedToken.name || '',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        companyId: decodedToken.companyId ? parseInt(decodedToken.companyId) : undefined,
        role: decodedToken.roles?.[0] || decodedToken.role,
      };

      // Return normalized AuthResponse
      return {
        token: accessToken,
        refreshToken: apiData.refreshToken,
        expiration: apiData.expiration,
        user,
      };
    } catch (error: any) {
      throw error;
    }
  },

  // Register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
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

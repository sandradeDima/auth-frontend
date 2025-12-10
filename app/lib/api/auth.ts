import { api } from './client';
import { MensajeApi } from '@/types/api';
import { LoginResponse } from '@/types/loginResponse';

interface RefreshTokenRequest {
  refreshToken: string;
  userId: number;
}

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: LoginResponse['user'];
}

export const authApi = {
  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (refreshToken: string, userId: number): Promise<RefreshTokenResponse> => {
    const response: MensajeApi<RefreshTokenResponse> = await api.post('/api/auth/refresh', {
      refreshToken,
      userId
    });
    
    if (response.error) {
      throw new Error(response.message || 'Token refresh failed');
    }
    
    return response.data!;
  }
};

'use client';

import { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api/client';

/**
 * Hook that provides API methods with automatic token management
 * Automatically includes the access token in requests
 */
export function useApi() {
  const { accessToken, refreshAccessToken } = useAuth();

  const apiWithAuth = useMemo(() => {
    return {
      get: async <T>(path: string) => {
        try {
          console.log('llega a api.get');
          return await api.get<T>(path, accessToken || undefined);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return await api.get<T>(path, accessToken || undefined);
            }
          }
          throw error;
        }
      },
      post: async <T>(path: string, body?: unknown) => {
        try {
          return await api.post<T>(path, body, accessToken || undefined);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return await api.post<T>(path, body, accessToken || undefined);
            }
          }
          throw error;
        }
      },
      put: async <T>(path: string, body?: unknown) => {
        try {
          return await api.put<T>(path, body, accessToken || undefined);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return await api.put<T>(path, body, accessToken || undefined);
            }
          }
          throw error;
        }
      },
      patch: async <T>(path: string, body?: unknown) => {
        try {
          return await api.patch<T>(path, body, accessToken || undefined);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return await api.patch<T>(path, body, accessToken || undefined);
            }
          }
          throw error;
        }
      },
      delete: async <T>(path: string, body?: unknown) => {
        try {
          return await api.delete<T>(path, body, accessToken || undefined);
        } catch (error) {
          if (error instanceof Error && error.message.includes('401')) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              return await api.delete<T>(path, body, accessToken || undefined);
            }
          }
          throw error;
        }
      },
    };
  }, [accessToken, refreshAccessToken]);

  return apiWithAuth;
}

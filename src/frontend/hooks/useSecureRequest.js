import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../context/axiosInstance';

// Custom hook koji vraća secureRequest funkciju
const useSecureRequest = () => {
  const { token, setToken, logout, refreshToken } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // secureRequest automatski dodaje token i osvežava ga ako je istekao
  const secureRequest = useCallback(
    async (method, url, data = {}, options = {}) => {
      try {
        const config = { ...options, method, url, ...(data ? { data } : {}) };

        if (token) {
          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return await axiosInstance(config);
      } catch (error) {
        if (error.response?.status === 401 && !options._retry) {
          try {
            setIsRefreshing(true);
            const newToken = await refreshToken();

            if (newToken) {
              setToken(newToken);
              return secureRequest(method, url, data, {
                ...options,
                _retry: true,
              });
            } else {
              logout();
              throw new Error('Token refresh failed');
            }
          } catch (refreshError) {
            logout();
            throw refreshError;
          } finally {
            setIsRefreshing(false);
          }
        }

        throw error;
      }
    },
    [token, setToken, logout, refreshToken]
  );

  return { secureRequest, isRefreshing };
};

export default useSecureRequest;

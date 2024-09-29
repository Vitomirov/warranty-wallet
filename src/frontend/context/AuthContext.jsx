import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const { token, login, logout, refreshToken, user } = useContext(AuthContext);
  return { token, login, logout, refreshToken, user, isLoading: false };
};

export default AuthContext;
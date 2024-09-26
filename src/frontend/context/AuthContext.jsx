import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const { token, login, logout, refreshToken } = useContext(AuthContext);
  return { token, login, logout, refreshToken, user: token ? true : false, isLoading: false };
};

export default AuthContext;
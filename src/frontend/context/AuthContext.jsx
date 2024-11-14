import { createContext, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const { token, login, logout, refreshToken, user, updateUser } = useContext(AuthContext);
  return { token, login, logout, refreshToken, user, updateUser, isLoading: false };
};

export default AuthContext;
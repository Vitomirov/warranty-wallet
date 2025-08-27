import { createContext, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to access auth context values
export const useAuth = () => {
  const { token, login, logout, refreshToken, setToken, user, updateUser } = useContext(AuthContext);

  // Return auth-related values and functions
  return { token, login, logout, refreshToken, setToken, user, updateUser, isLoading: false };
};

export default AuthContext;
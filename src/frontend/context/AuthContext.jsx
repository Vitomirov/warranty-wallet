import { createContext, useContext } from 'react';

// Create a new context for authentication
const AuthContext = createContext();

// A hook to access the authentication context
export const useAuth = () => {
  
  // Use the useContext hook to access the AuthContext
  return useContext(AuthContext);
};

export default AuthContext;

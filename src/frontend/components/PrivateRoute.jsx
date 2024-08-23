import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user === null) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <>Loading...</>
  }

  return user ? children : null;
};

export default PrivateRoute;

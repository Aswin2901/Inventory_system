import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust the path if necessary

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    element
  ) : (
    <Navigate
      to="/"
      state={{ error: 'Something went wrong. Please login again!' }}
      replace
    />
  );
};

export default PrivateRoute;

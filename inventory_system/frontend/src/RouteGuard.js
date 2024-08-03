// RouteGuard.js
import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

const RouteGuard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
    }
  }, [navigate, token]);

  return <Outlet />;
};

export default RouteGuard;

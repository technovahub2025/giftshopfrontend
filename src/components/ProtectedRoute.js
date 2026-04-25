import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Login from './Login';
import Dashboard from './Dashboard';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return <Dashboard />;
};

export default ProtectedRoute;

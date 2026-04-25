import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage on app load
    const checkExistingUser = () => {
      const savedUser = localStorage.getItem('giftShopUser');
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const isNewUser = localStorage.getItem('isNewUser');
      
      console.log('AuthContext - Checking existing user:', {
        savedUser: !!savedUser,
        token: !!token,
        role,
        isNewUser
      });
      
      if (savedUser && token) {
        // User found with valid token
        const userData = JSON.parse(savedUser);
        userData.token = token;
        userData.role = role || 'user';
        console.log('AuthContext - Setting user:', userData);
        setUser(userData);
      } else {
        console.log('AuthContext - No user found');
      }
      
      setIsLoading(false);
    };

    checkExistingUser();
  }, []);

  const login = (userData, isNew = false) => {
    setUser(userData);
    localStorage.setItem('giftShopUser', JSON.stringify(userData));
    
    if (userData.token) {
      localStorage.setItem('token', userData.token);
    }
    if (userData.role) {
      localStorage.setItem('role', userData.role);
    }
    
    if (isNew) {
      localStorage.setItem('isNewUser', 'true');
    } else {
      localStorage.removeItem('isNewUser');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('giftShopUser');
    localStorage.removeItem('isNewUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const markAsExistingUser = () => {
    localStorage.removeItem('isNewUser');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    markAsExistingUser,
    isAuthenticated: !!user,
    isNewUser: !!user && localStorage.getItem('isNewUser') === 'true'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
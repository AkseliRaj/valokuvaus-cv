import React, { useState, useEffect } from 'react';
import Login from './Login';
import AdminPanel from './AdminPanel';
import './AdminPage.css';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  // Add/remove body class for admin page scrolling
  useEffect(() => {
    document.body.classList.add('admin-page-active');
    return () => {
      document.body.classList.remove('admin-page-active');
    };
  }, []);

  const handleLogin = (data) => {
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <div className="admin-page">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <AdminPanel onLogout={handleLogout} />
      )}
    </div>
  );
};

export default AdminPage; 
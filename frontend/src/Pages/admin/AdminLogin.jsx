import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin, signout, user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from || '/admin/dashboard';

  // Don't auto-redirect - let user manually navigate to dashboard
  // Remove the useEffect that was auto-redirecting

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!trimmedPassword) {
      newErrors.password = 'Password is required';
    } else if (trimmedPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAdminLogin = async () => {
    if (validateForm()) {
      setIsLoading(true);
      setErrorMessage('');
      
      try {
        const data = await signin(email.trim(), password.trim());
        
        console.log('Login response:', data);
        
        // Check if user is admin IMMEDIATELY after signin
        if (data.profile && data.profile.role === 'admin') {
          console.log('✅ Admin login successful, profile updated in context');
          // Small delay to ensure context updates, then navigate
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 100);
        } else {
          // Not an admin - clear session and show error
          setErrorMessage('Access denied. Admin credentials required.');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Login error:', error);
        setErrorMessage(error.message || 'Invalid email or password.');
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAdminLogin();
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="admin-login-page">
        <div className="admin-login-container">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '16px', color: '#8b7355' }}>Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Always show login form at /admin
  // Dashboard is only accessible at /admin/dashboard

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-logo">
          <h1>Wild Trail Admin Login</h1>
          {from !== '/admin/dashboard' && (
            <p style={{ 
              fontSize: '14px', 
              color: '#ff6b6b', 
              marginTop: '12px',
              background: '#fff3cd',
              padding: '8px 12px',
              borderRadius: '4px'
            }}>
              ⚠️ Login required to access: <strong>{from}</strong>
            </p>
          )}
        </div>

        {errorMessage && (
          <div className="error-banner">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="admin-form-section">
          <div className="input-group">
            <label htmlFor="admin-email">Email</label>
            <input
              type="email"
              id="admin-email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              autoComplete="email"
              autoFocus
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="input-group">
            <label htmlFor="admin-password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="admin-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <button 
            type="button" 
            className="admin-login-btn" 
            onClick={handleAdminLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Nav from '../components/Navbar';
import NotificationToast from './NotificationToast';
import './Login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signin } = useAuth(); // Use AuthContext
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: 'success', message: '' });
  const [loading, setLoading] = useState(false);
  
  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password states
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const from = location.state?.from || '/';

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

  const handleLogin = async () => {
    if (validateForm()) {
      setLoading(true);
      
      try {
        console.log('Attempting login with email:', email.trim());
        
        // Use AuthContext signin which calls your backend API
        const result = await signin(email.trim(), password.trim());
        
        console.log('Login result:', result);
        
        // Show success toast
        setToastMessage({
          type: 'success',
          message: 'Login successful! Welcome back!'
        });
        setShowToast(true);
        
        // Clear form
        setEmail('');
        setPassword('');
        
        // Redirect after toast shows
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
        
      } catch (error) {
        console.error('Login error:', error);
        
        // Show error toast
        setToastMessage({
          type: 'error',
          message: error.message || 'Login failed. Please try again.'
        });
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleForgotPassword = () => {
    setShowForgotModal(true);
  };

  const handleSendResetEmail = async () => {
    const trimmedEmail = resetEmail.trim();
    
    if (!trimmedEmail) {
      setToastMessage({
        type: 'error',
        message: 'Please enter your email address'
      });
      setShowToast(true);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setToastMessage({
        type: 'error',
        message: 'Please enter a valid email address'
      });
      setShowToast(true);
      return;
    }

    setResetLoading(true);
    
    try {
      // Import supabase client
      const { supabase } = await import('../config/supabase');
      
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      setToastMessage({
        type: 'success',
        message: 'Password reset email sent! Check your inbox (and spam folder).'
      });
      setShowToast(true);
      setShowForgotModal(false);
      setResetEmail('');
      
      // Clear login form
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Reset password error:', error);
      setToastMessage({
        type: 'error',
        message: error.message || 'Failed to send reset email'
      });
      setShowToast(true);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <>
      <Nav />
      <div className="login-page">
        <NotificationToast 
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          type={toastMessage.type}
          message={toastMessage.message}
          duration={4000}
        />

        <div className="login-container">
          <div className="logo1">
            <h1>Welcome Back!</h1>
            {from !== '/' && (
              <p style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
                Please login to continue
              </p>
            )}
          </div>

          <div className="form-section">
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                autoComplete="email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  autoComplete="current-password"
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}
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

            <div className="options">
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <a className="forgot-password" onClick={handleForgotPassword}>
                Forgot password?
              </a>
            </div>

            <button 
              type="button" 
              className="login-btn" 
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="signup-link">
            Don't have an account? <a onClick={() => navigate('/signup')}>Sign up</a>
          </div>
        </div>

        {showForgotModal && (
          <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Reset Password</h2>
              <p className="modal-description">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <div className="input-group">
                <label htmlFor="reset-email">Email</label>
                <input
                  type="email"
                  id="reset-email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendResetEmail()}
                  autoComplete="email"
                />
              </div>

              <div className="modal-buttons">
                <button 
                  className="cancel-btn"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetEmail('');
                  }}
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button 
                  className="login-btn"
                  onClick={handleSendResetEmail}
                  disabled={resetLoading}
                >
                  {resetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
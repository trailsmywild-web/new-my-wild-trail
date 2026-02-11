import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import { signOutUser, getUserData, updateUserData } from '../firebase/auth';
// import { auth } from '../firebase/config';
import Nav from '../components/Navbar';
import NotificationToast from './NotificationToast';
import './ProfilePage.css';

const Profile = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    profileImage: null
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({ ...user });
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: 'success', message: '' });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const currentUser = auth.currentUser;
      const storedEmail = localStorage.getItem('userEmail');
      const storedUserId = localStorage.getItem('userId');

      console.log('Loading user data...', { currentUser, storedEmail, storedUserId });

      if (currentUser) {
        // Get user data from Firestore
        const result = await getUserData(currentUser.uid);
        
        if (result.success) {
          setUser({
            name: result.data.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            phone: result.data.phone || '',
            profileImage: currentUser.photoURL || null
          });
        } else {
          // Fallback to basic auth data
          setUser({
            name: currentUser.email.split('@')[0],
            email: currentUser.email,
            phone: '',
            profileImage: null
          });
        }
      } else if (storedEmail && storedUserId) {
        // Get user data from Firestore using stored userId
        const result = await getUserData(storedUserId);
        
        if (result.success) {
          setUser({
            name: result.data.displayName || storedEmail.split('@')[0],
            email: storedEmail,
            phone: result.data.phone || '',
            profileImage: null
          });
        } else {
          // Fallback to stored email
          setUser({
            name: storedEmail.split('@')[0],
            email: storedEmail,
            phone: '',
            profileImage: null
          });
        }
      } else {
        // No user logged in, redirect to login
        console.log('No user found, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }
      
      setLoading(false);
    };

    loadUserData();
  }, [navigate]);

  // Update editedUser when user data changes
  useEffect(() => {
    setEditedUser({ ...user });
  }, [user]);

  const handleSignOut = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = async () => {
    // Sign out from Firebase
    await signOutUser();
    
    // Clear ALL authentication data
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    localStorage.removeItem('wishlist');
    localStorage.removeItem('cart');
    
    // Close modal
    setShowSignOutModal(false);
    
    // Navigate to login
    setTimeout(() => {
      navigate('/login', { replace: true });
    }, 100);
  };

  const cancelSignOut = () => {
    setShowSignOutModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('userId');
    
    if (userId) {
      const result = await updateUserData(userId, editedUser);
      
      if (result.success) {
        setUser({ ...editedUser });
        setIsEditing(false);
        
        setToastMessage({
          type: 'success',
          message: 'Profile updated successfully!'
        });
        setShowToast(true);
      } else {
        setToastMessage({
          type: 'error',
          message: 'Failed to update profile. Please try again.'
        });
        setShowToast(true);
      }
    }
  };

  const handleCancel = () => {
    setEditedUser({ ...user });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    setEditedUser({
      ...editedUser,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div className="profile-page">
          <div className="profile-container">
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Loading your profile...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="profile-page">
        <NotificationToast 
          isOpen={showToast}
          onClose={() => setShowToast(false)}
          type={toastMessage.type}
          message={toastMessage.message}
          duration={3000}
        />

        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-icon-wrapper">
              {user.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="profile-image" />
              ) : (
                <div className="profile-icon">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="profile-title">My Profile</h1>
          </div>

          <div className="profile-info">
            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="info-content">
                <label className="info-label">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={editedUser.name}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Enter your name"
                  />
                ) : (
                  <p className="info-value">{user.name || 'Not set'}</p>
                )}
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="info-content">
                <label className="info-label">Email Address</label>
                <p className="info-value">{user.email}</p>
                {isEditing && (
                  <small style={{ color: '#999', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                    Email cannot be changed
                  </small>
                )}
              </div>
            </div>

            <div className="info-item">
              <div className="info-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="info-content">
                <label className="info-label">Phone Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleChange}
                    className="info-input"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="info-value">{user.phone || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn btn-save" onClick={handleSave}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </button>
                <button className="btn btn-cancel" onClick={handleCancel}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-edit" onClick={handleEdit}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit Profile
              </button>
            )}

            <button className="btn btn-signout" onClick={handleSignOut}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>

        {/* Sign Out Confirmation Modal */}
        {showSignOutModal && (
          <div className="login-modal-overlay" onClick={cancelSignOut}>
            <div className="login-modal warning" onClick={(e) => e.stopPropagation()}>
              <div className="login-modal-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </div>
              
              <div className="login-modal-content">
                <h2 className="login-modal-title">Sign Out?</h2>
                <p className="login-modal-message">Are you sure you want to sign out of your account?</p>
                
                <div className="login-modal-buttons">
                  <button 
                    className="login-modal-btn login-modal-btn-primary"
                    onClick={confirmSignOut}
                  >
                    Yes, Sign Out
                  </button>
                  <button 
                    className="login-modal-btn login-modal-btn-secondary"
                    onClick={cancelSignOut}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
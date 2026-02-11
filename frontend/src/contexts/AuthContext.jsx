import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../config/supabase';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setUser(session?.user ?? null);
      if (session?.access_token) {
        localStorage.setItem('supabase_token', session.access_token);
        fetchProfile();
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setUser(session?.user ?? null);
        if (session?.access_token) {
          localStorage.setItem('supabase_token', session.access_token);
          await fetchProfile();
        } else {
          localStorage.removeItem('supabase_token');
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async () => {
    try {
      console.log('Fetching profile...');
      const { data } = await authAPI.getProfile();
      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, userData) => {
    try {
      const { data } = await authAPI.signup({
        email,
        password,
        fullName: userData.full_name,
        phone: userData.phone || ''
      });
      
      if (data.session?.access_token) {
        localStorage.setItem('supabase_token', data.session.access_token);
        setProfile(data.profile);
      }
      
      return data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Signup failed');
    }
  };

  const signin = async (email, password) => {
    try {
      console.log('🔐 Signing in:', email);
      const { data } = await authAPI.signin({ email, password });
      
      console.log('📥 Signin response:', data);
      
      if (data.session?.access_token) {
        localStorage.setItem('supabase_token', data.session.access_token);
        
        // CRITICAL: Set the session in Supabase client
        console.log('💾 Setting Supabase session...');
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        });
        
        // Set user and profile in state
        setUser(data.user);
        
        // IMPORTANT: Set profile immediately from signin response
        if (data.profile) {
          setProfile(data.profile);
          console.log('✅ Profile set from signin:', data.profile);
        }
      }
      
      return data;
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error(error.message || 'Signin failed');
    }
  };

  const signout = async () => {
    try {
      await authAPI.signout();
      await supabase.auth.signOut();
      localStorage.removeItem('supabase_token');
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Signout error:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('supabase_token');
      setUser(null);
      setProfile(null);
    }
  };

  const value = {
    user,
    profile,
    loading,
    signup,
    signin,
    signout,
    isAdmin: profile?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
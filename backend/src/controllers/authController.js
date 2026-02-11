import { supabase, supabaseAdmin } from '../config/supabase.js';

// Signup Controller - FIXED VERSION (KEEP THIS ONE)
export const signup = async (req, res) => {
  try {
    console.log('📥 Signup request received:', req.body);
    
    const { email, password, fullName, phone } = req.body;

    console.log('📧 Email:', email);
    console.log('👤 Full Name:', fullName);
    console.log('📱 Phone:', phone);
    console.log('🔑 Password length:', password?.length);

    if (!email || !password || !fullName) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({ 
        message: 'Email, password, and full name are required' 
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return res.status(400).json({ 
        message: 'Invalid email address format' 
      });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters' 
      });
    }

    console.log('✅ Validation passed, calling Supabase with ADMIN CLIENT...');

    // ⭐ USE ADMIN CLIENT - BYPASSES RATE LIMITS ⭐
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName.trim(),
        phone: phone || '',
        role: 'customer'
      }
    });

    if (authError) {
      console.error('❌ Auth signup error:', authError);
      
      let errorMessage = authError.message;
      
      if (authError.message.includes('already registered') || 
          authError.message.includes('User already registered')) {
        errorMessage = 'This email is already registered. Please login instead.';
      }
      
      return res.status(400).json({ message: errorMessage });
    }

    if (!authData.user) {
      console.log('❌ User creation failed - no user returned');
      return res.status(400).json({ message: 'User creation failed' });
    }

    console.log('✅ User created in auth:', authData.user.id);
    console.log('✅ Email auto-confirmed: YES');

    // Wait for database trigger to complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Fetch user profile
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('⚠️ User profile fetch error:', userError);
    }

    // Update phone if provided
    if (userData && phone) {
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ phone: phone.trim() })
        .eq('id', authData.user.id);
      
      if (updateError) {
        console.error('⚠️ Phone update error:', updateError);
      }
    }

    console.log('✅ Signup successful:', { email, userId: authData.user.id });

    // Sign them in to get a session token
    console.log('🔐 Signing in user to get session...');
    const { data: sessionData, error: sessionError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password
    });

    if (sessionError) {
      console.error('⚠️ Auto-signin error:', sessionError);
      // Still return success - user can login manually
      return res.status(201).json({
        message: 'Signup successful! Please login.',
        user: authData.user,
        profile: userData || { 
          id: authData.user.id, 
          email: email, 
          full_name: fullName,
          phone: phone || '',
          role: 'customer' 
        }
      });
    }

    console.log('✅ Session created successfully');

    res.status(201).json({
      message: 'Signup successful',
      session: sessionData.session,
      user: sessionData.user,
      profile: userData || { 
        id: authData.user.id, 
        email: email, 
        full_name: fullName,
        phone: phone || '',
        role: 'customer' 
      }
    });

  } catch (error) {
    console.error('❌ Signup error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({ message: error.message || 'Signup failed' });
  }
};

// Signin Controller (KEEP AS IS)
export const signin = async (req, res) => {
  try {
    console.log('📥 Signin request received');
    
    const { email, password } = req.body;

    console.log('📧 Email:', email);

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    console.log('✅ Validation passed, calling Supabase with regular client...');

    // USE REGULAR CLIENT (anon key) for signin
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (authError) {
      console.error('❌ Auth signin error:', authError);
      return res.status(401).json({ message: authError.message });
    }

    console.log('✅ User signed in:', authData.user.id);

    // Use admin client to fetch profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      return res.status(404).json({ message: 'User profile not found' });
    }

    console.log('✅ Signin successful:', { email, userId: authData.user.id });

    res.status(200).json({
      message: 'Signin successful',
      session: authData.session,
      user: authData.user,
      profile: profile
    });

  } catch (error) {
    console.error('❌ Signin error:', error);
    res.status(500).json({ message: error.message || 'Signin failed' });
  }
};

// Get Profile Controller (KEEP AS IS)
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📥 Getting profile for user:', userId);

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('❌ Profile fetch error:', profileError);
      return res.status(404).json({ message: 'Profile not found' });
    }

    console.log('✅ Profile fetched successfully');

    res.status(200).json(profile);

  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Signout Controller (KEEP AS IS)
export const signout = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('📥 Signout request received');

    if (token) {
      const { error } = await supabaseAdmin.auth.admin.signOut(token);
      
      if (error) {
        console.error('⚠️ Signout error:', error);
      }
    }

    console.log('✅ Signout successful');
    res.status(200).json({ message: 'Signout successful' });
  } catch (error) {
    console.error('❌ Signout error:', error);
    res.status(500).json({ message: error.message });
  }
};
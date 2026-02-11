import { supabaseAdmin } from '../src/config/supabase.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';
  const adminName = process.env.ADMIN_NAME || 'Admin User';

  console.log('Creating admin user...');
  console.log(' Email:', adminEmail);

  try {
    // Use ADMIN client to bypass restrictions
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: adminName,
        role: 'admin'
      }
    });

    if (authError) {
      console.error('Error:', authError.message);
      process.exit(1);
    }

    if (!authData.user) {
      console.error(' User creation failed');
      process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log(' User ID:', authData.user.id);
    console.log(' Email:', authData.user.email);
    console.log(' Email auto-confirmed: Yes');
    console.log('\n Login credentials:');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('\n  NEXT STEP: Update user role to admin');
    console.log('   Run this SQL query in Supabase:');
    console.log(`   UPDATE public.users SET role = 'admin' WHERE email = '${adminEmail}';`);
    
    process.exit(0);
  } catch (error) {
    console.error(' Unexpected error:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

createAdminUser();
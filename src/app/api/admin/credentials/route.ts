import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const dynamic = 'force-dynamic';

// Validate email format
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validate password strength: minimum 8 characters, uppercase, lowercase, number, special char
const validatePassword = (password: string) => {
  if (password.length < 8) return false;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN' || !session.user?.email) {
      return NextResponse.json({ error: 'अनधिकृत प्रवेश (Unauthorized)' }, { status: 401 });
    }

    const body = await req.json();
    const { action, currentPassword } = body;

    if (!currentPassword) {
      return NextResponse.json({ error: 'वर्तमान पासवर्ड आवश्यक है।' }, { status: 400 });
    }

    // Retrieve user from auth.users using email or id
    const userId = (session.user as any).id;
    const userEmail = session.user.email;

    let queryText = 'SELECT id, email, encrypted_password FROM auth.users WHERE LOWER(email) = LOWER($1) LIMIT 1';
    let queryParams = [userEmail];

    if (userId) {
      queryText = 'SELECT id, email, encrypted_password FROM auth.users WHERE id = $1 LIMIT 1';
      queryParams = [userId];
    }

    const { rows } = await pool.query(queryText, queryParams);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'उपयोगकर्ता नहीं मिला।' }, { status: 404 });
    }

    const user = rows[0];

    // Verify current password
    const isPasswordValid = bcrypt.compareSync(currentPassword, user.encrypted_password || '');
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'गलत वर्तमान पासवर्ड।' }, { status: 400 });
    }

    if (action === 'update-email') {
      const { newEmail } = body;
      if (!newEmail || !validateEmail(newEmail)) {
        return NextResponse.json({ error: 'कृपया एक मान्य ईमेल पता दर्ज करें।' }, { status: 400 });
      }

      if (newEmail.trim().toLowerCase() === user.email.toLowerCase()) {
        return NextResponse.json({ error: 'नया ईमेल वर्तमान ईमेल के समान नहीं हो सकता।' }, { status: 400 });
      }

      // Check if email is already in use
      const { rows: existingRows } = await pool.query(
        'SELECT id FROM auth.users WHERE LOWER(email) = LOWER($1) AND id <> $2 LIMIT 1',
        [newEmail.trim(), user.id]
      );

      if (existingRows.length > 0) {
        return NextResponse.json({ error: 'यह ईमेल पहले से ही किसी अन्य खाते द्वारा उपयोग में है।' }, { status: 400 });
      }

      // Update email in Supabase Auth auth.users table
      await pool.query(
        `UPDATE auth.users 
         SET email = $1, email_confirmed_at = NOW(), updated_at = NOW() 
         WHERE id = $2`,
        [newEmail.trim().toLowerCase(), user.id]
      );

      return NextResponse.json({ success: true, message: 'ईमेल सफलतापूर्वक अपडेट किया गया।' });

    } else if (action === 'update-password') {
      const { newPassword, confirmPassword } = body;
      if (!newPassword || !validatePassword(newPassword)) {
        return NextResponse.json({ 
          error: 'नया पासवर्ड कम से कम 8 वर्णों का होना चाहिए और उसमें कम से कम एक अपरकेस अक्षर, एक लोअरकेस अक्षर, एक अंक और एक विशेष वर्ण होना चाहिए।' 
        }, { status: 400 });
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json({ error: 'पासवर्ड और पुष्टि पासवर्ड मेल नहीं खाते।' }, { status: 400 });
      }

      // Hash the new password
      const hashed = bcrypt.hashSync(newPassword, 10);

      // Update password in Supabase Auth auth.users table
      await pool.query(
        `UPDATE auth.users 
         SET encrypted_password = $1, updated_at = NOW() 
         WHERE id = $2`,
        [hashed, user.id]
      );

      return NextResponse.json({ success: true, message: 'पासवर्ड सफलतापूर्वक अपडेट किया गया।' });
    }

    return NextResponse.json({ error: 'अमान्य कार्रवाई (Invalid Action)' }, { status: 400 });

  } catch (error: any) {
    console.error('Credentials update API error:', error);
    return NextResponse.json({ error: error.message || 'आंतरिक सर्वर त्रुटि (Internal Server Error)' }, { status: 500 });
  }
}

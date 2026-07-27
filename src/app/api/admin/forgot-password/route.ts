import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required.' },
        { status: 400 }
      );
    }

    // 1. Verify email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // 2. Check if the email exists in auth.users as an admin
    const trimmedEmail = email.trim().toLowerCase();
    const { rows } = await pool.query(
      `SELECT id, raw_app_meta_data 
       FROM auth.users 
       WHERE LOWER(email) = $1 
       LIMIT 1;`,
      [trimmedEmail]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'This email is not registered as an administrator.' },
        { status: 400 }
      );
    }

    // Verify if the user is actually an admin (role in raw_app_meta_data)
    const user = rows[0];
    const appMetaData = user.raw_app_meta_data || {};
    const role = appMetaData.role || 'USER';

    if (role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Access denied: User is not an administrator.' },
        { status: 403 }
      );
    }

    // 3. Check if Supabase client keys are configured
    const currentAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];
    if (!currentAnonKey) {
      return NextResponse.json(
        { error: 'Supabase Anon Key is not configured on the server.' },
        { status: 500 }
      );
    }

    // 4. Trigger Supabase Auth Password Recovery Email
    const redirectTo = `${req.nextUrl.origin}/admin/reset-password`;
    
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo,
    });

    if (resetError) {
      console.error('Supabase reset password error:', resetError);
      
      let clientErrorMessage = resetError.message;
      if (clientErrorMessage === '{}' || !clientErrorMessage || resetError.name === 'AuthRetryableFetchError') {
        clientErrorMessage = 'Unable to send recovery email. This is typically caused by Supabase SMTP rate limits (max 3 emails per hour on the free tier) or misconfigured SMTP credentials in your Supabase project dashboard.';
      }
      
      return NextResponse.json(
        { error: clientErrorMessage },
        { status: resetError.status || 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password recovery email sent successfully.',
    });

  } catch (error: any) {
    console.error('Forgot password API error:', error);
    let clientErrorMessage = error.message;
    if (clientErrorMessage === '{}' || !clientErrorMessage) {
      clientErrorMessage = 'An internal server error occurred while processing the request.';
    }
    return NextResponse.json(
      { error: clientErrorMessage },
      { status: 500 }
    );
  }
}

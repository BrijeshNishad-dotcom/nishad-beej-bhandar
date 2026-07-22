import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { pool } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Supabase Auth',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Query Supabase Auth (auth.users) directly for authenticating the admin
          const { rows } = await pool.query(
            `SELECT id, email, encrypted_password, raw_app_meta_data, raw_user_meta_data 
             FROM auth.users 
             WHERE LOWER(email) = LOWER($1) 
             LIMIT 1;`,
            [credentials.email.trim()]
          );

          if (rows.length === 0) {
            return null;
          }

          const user = rows[0];
          if (!user.encrypted_password) {
            return null;
          }

          const isPasswordValid = bcrypt.compareSync(
            credentials.password,
            user.encrypted_password
          );

          if (!isPasswordValid) {
            return null;
          }

          const userMetaData = user.raw_user_meta_data || {};
          const appMetaData = user.raw_app_meta_data || {};

          return {
            id: user.id,
            email: user.email,
            name: userMetaData.name || 'Abhay Nishad',
            role: appMetaData.role || 'ADMIN',
          };
        } catch (error) {
          console.error('Supabase Auth authentication error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'nishadbeej_bhandar_secret_key_super_secure_2026',
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};


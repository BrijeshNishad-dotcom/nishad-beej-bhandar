'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import React, { useEffect } from 'react';

function SessionSyncTracker() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      const isSessionActive = sessionStorage.getItem('admin_session_active');
      if (!isSessionActive) {
        // Clear cookies and sign out if the browser session ended (sessionStorage is empty)
        signOut({ callbackUrl: window.location.pathname });
      }
    }
  }, [status, session]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionSyncTracker />
      {children}
    </SessionProvider>
  );
}

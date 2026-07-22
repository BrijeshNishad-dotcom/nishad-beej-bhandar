import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import SettingsClient from './SettingsClient';

export const revalidate = 0; // Disable cache so setting modifications reflect immediately

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);
  const adminEmail = session?.user?.email || '';

  const settings = await prisma.setting.findMany();
  
  // Format key-value object
  const config: Record<string, string> = {};
  settings.forEach((s) => {
    config[s.key] = s.value;
  });

  return (
    <SettingsClient initialSettings={config} currentAdminEmail={adminEmail} />
  );
}

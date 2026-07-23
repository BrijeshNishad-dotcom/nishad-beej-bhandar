import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

import { getSettings } from '@/lib/settings';

// GET: Fetch all settings as key-value pairs
export async function GET() {
  try {
    const config = await getSettings();
    return NextResponse.json({ settings: config });
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Bulk update settings (Admin only)
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json(); // Expected format: { key1: value1, key2: value2 }
    console.log("PUT /api/settings received body:", body);

    const updates = Object.entries(body).map(([key, value]) => {
      return prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    });

    await prisma.$transaction(updates);

    // Revalidate all pages dynamically
    revalidatePath('/', 'layout');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}


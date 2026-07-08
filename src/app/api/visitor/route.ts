import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    // Get IP address from headers
    const forwardedFor = req.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    // Get current date as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Upsert visitor log
    await prisma.visitor.upsert({
      where: {
        ip_date: {
          ip,
          date: today,
        },
      },
      update: {
        count: {
          increment: 1,
        },
      },
      create: {
        ip,
        date: today,
        count: 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Visitor tracking error:', error);
    // Silent fail to prevent user-facing errors on analytics failure
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json({ banners });
  } catch (error: any) {
    console.error('Banners fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, title, subtitle, link, order } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Image URL and Title are required' }, { status: 400 });
    }

    const newBanner = await prisma.banner.create({
      data: {
        imageUrl,
        title,
        subtitle: subtitle || null,
        link: link || null,
        order: order ? parseInt(order, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, banner: newBanner });
  } catch (error: any) {
    console.error('Banner creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

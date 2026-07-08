import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const images = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ images });
  } catch (error: any) {
    console.error('Gallery fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, title, description } = await req.json();

    if (!imageUrl || !title) {
      return NextResponse.json({ error: 'Image URL and Title are required' }, { status: 400 });
    }

    const newImage = await prisma.gallery.create({
      data: { 
        imageUrl, 
        title,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, image: newImage });
  } catch (error: any) {
    console.error('Gallery creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

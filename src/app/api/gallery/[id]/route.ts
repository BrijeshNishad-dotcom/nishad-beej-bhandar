import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.gallery.delete({
      where: { id: galleryId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Gallery image deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const galleryId = parseInt(id, 10);
    if (isNaN(galleryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { title, imageUrl, description } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'Title and Image URL are required' }, { status: 400 });
    }

    const updated = await prisma.gallery.update({
      where: { id: galleryId },
      data: {
        title,
        imageUrl,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, image: updated });
  } catch (error: any) {
    console.error('Gallery image update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteParams = {
  params: Promise<{ id: string }>
}

// PUT: Edit category (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const { name, nameEn, icon } = await req.json();
    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const updatedCategory = await prisma.category.update({
      where: { id: catId },
      data: { name, nameEn: nameEn || null, slug, icon: icon || '🌱' },
    });

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    console.error('Category update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete category (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const catId = parseInt(id, 10);
    if (isNaN(catId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id: catId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Category deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

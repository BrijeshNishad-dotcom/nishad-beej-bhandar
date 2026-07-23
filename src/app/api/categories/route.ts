import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Fetch all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Categories fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new category (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, nameEn, icon } = await req.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Category name is required and cannot be empty' }, { status: 400 });
    }

    // Generate unique slug
    let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Check if slug exists, append random if needed
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const newCategory = await prisma.category.create({
      data: { name, nameEn: nameEn || null, slug, icon: icon || '🌱' },
    });

    return NextResponse.json({ success: true, category: newCategory });
  } catch (error: any) {
    console.error('Category creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

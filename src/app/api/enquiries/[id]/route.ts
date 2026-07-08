import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteParams = {
  params: Promise<{ id: string }>
}

// PATCH: Mark enquiry as contacted
export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const enquiryId = parseInt(id, 10);
    if (isNaN(enquiryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { status } = body;

    const updated = await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status: status || 'CONTACTED' },
    });

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    console.error('Enquiry update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete an enquiry
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const enquiryId = parseInt(id, 10);
    if (isNaN(enquiryId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    await prisma.enquiry.delete({
      where: { id: enquiryId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Enquiry deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

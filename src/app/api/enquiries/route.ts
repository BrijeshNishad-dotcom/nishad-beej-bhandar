import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST: Public submission of contact/enquiry form
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, mobile, village, cropName, message } = body;

    if (!name || !mobile || !village || !message) {
      return NextResponse.json({ error: 'Name, mobile, village, and message are required.' }, { status: 400 });
    }

    const newEnquiry = await prisma.enquiry.create({
      data: {
        name,
        mobile,
        village,
        cropName: cropName || null,
        message,
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, enquiry: newEnquiry });
  } catch (error: any) {
    console.error('Enquiry submission error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// GET: Fetch all enquiries (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const enquiries = await prisma.enquiry.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ enquiries });
  } catch (error: any) {
    console.error('Enquiry fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

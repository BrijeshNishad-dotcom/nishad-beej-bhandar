import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Run parallel counts and queries
    const [seedCount, fertilizerCount, pesticideCount, categoryCount, enquiryCount, visitors] = await Promise.all([
      prisma.seed.count(),
      prisma.fertilizer.count(),
      prisma.pesticide.count(),
      prisma.category.count(),
      prisma.enquiry.count(),
      prisma.visitor.findMany(),
    ]);

    const totalProducts = seedCount + fertilizerCount + pesticideCount;
    const totalVisitors = visitors.reduce((sum, v) => sum + v.count, 0);

    // Get today's date formatted as YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const visitorsToday = visitors
      .filter((v) => v.date === today)
      .reduce((sum, v) => sum + v.count, 0);

    // Group visitor count by date for charts, sorting and taking the last 10 entries
    const visitorHistoryMap: Record<string, number> = {};
    visitors.forEach((v) => {
      visitorHistoryMap[v.date] = (visitorHistoryMap[v.date] || 0) + v.count;
    });

    const visitorHistory = Object.entries(visitorHistoryMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-10); // last 10 days of visitor history

    return NextResponse.json({
      stats: {
        totalProducts,
        totalCategories: categoryCount,
        totalEnquiries: enquiryCount,
        totalVisitors,
        visitorsToday,
        visitorHistory,
      },
    });
  } catch (error: any) {
    console.error('Stats fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

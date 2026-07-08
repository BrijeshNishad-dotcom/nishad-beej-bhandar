import { prisma } from '@/lib/db';
import DashboardOverview from './DashboardOverview';

export const revalidate = 0; // Disable caching so dashboard is always fresh

export default async function AdminDashboardPage() {
  // 1. Parallel database counts and logs
  const [seedCount, fertilizerCount, pesticideCount, categoryCount, enquiryCount, visitors, recentEnquiries] = await Promise.all([
    prisma.seed.count(),
    prisma.fertilizer.count(),
    prisma.pesticide.count(),
    prisma.category.count(),
    prisma.enquiry.count(),
    prisma.visitor.findMany(),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const totalProducts = seedCount + fertilizerCount + pesticideCount;
  const totalVisitors = visitors.reduce((sum, v) => sum + v.count, 0);

  const today = new Date().toISOString().split('T')[0];
  const visitorsToday = visitors
    .filter((v) => v.date === today)
    .reduce((sum, v) => sum + v.count, 0);

  // Group visitor count by date for charts
  const visitorHistoryMap: Record<string, number> = {};
  visitors.forEach((v) => {
    visitorHistoryMap[v.date] = (visitorHistoryMap[v.date] || 0) + v.count;
  });

  const visitorHistory = Object.entries(visitorHistoryMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-10); // last 10 days of visitor history

  const stats = {
    totalProducts,
    totalCategories: categoryCount,
    totalEnquiries: enquiryCount,
    totalVisitors,
    visitorsToday,
    visitorHistory,
  };

  return (
    <DashboardOverview stats={stats} recentEnquiries={recentEnquiries} />
  );
}

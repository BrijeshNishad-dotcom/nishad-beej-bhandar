import { prisma } from '@/lib/db';
import EnquiriesClient from './EnquiriesClient';

export const revalidate = 0; // Disable cache so enquiries reflect immediately

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <EnquiriesClient initialEnquiries={enquiries} />
  );
}

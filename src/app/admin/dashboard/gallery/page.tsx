import { prisma } from '@/lib/db';
import GalleryClient from './GalleryClient';

export const revalidate = 0; // Disable caching so updates appear instantly

export default async function AdminGalleryPage() {
  const [banners, gallery] = await Promise.all([
    prisma.banner.findMany({
      orderBy: { order: 'asc' },
    }),
    prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return (
    <GalleryClient initialBanners={banners} initialGallery={gallery} />
  );
}

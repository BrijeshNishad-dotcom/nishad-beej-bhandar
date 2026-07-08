import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { promises as fs } from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Configure Cloudinary if keys are present
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Secure server-side session check
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 2. File size validation (limit to 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    // 3. File type validation
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPG, PNG, WEBP, GIF, and SVG are allowed.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary using a Promise wrapper
      return await new Promise<NextResponse>((resolve) => {
        cloudinary.uploader.upload_stream(
          { folder: 'nishad_beej_bhandar' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              resolve(
                NextResponse.json(
                  { error: 'Cloudinary upload failed: ' + error.message },
                  { status: 500 }
                )
              );
            } else {
              resolve(
                NextResponse.json({ url: result?.secure_url })
              );
            }
          }
        ).end(buffer);
      });
    } else {
      // Fallback: Save locally to public/uploads
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Ensure the directory exists
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate clean unique file name
      const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `${Date.now()}-${cleanName}`;
      const filePath = path.join(uploadDir, uniqueName);

      // Write file to local public directory
      await fs.writeFile(filePath, buffer);

      const fileUrl = `/uploads/${uniqueName}`;
      return NextResponse.json({ url: fileUrl });
    }
  } catch (error: any) {
    console.error('Upload handler error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

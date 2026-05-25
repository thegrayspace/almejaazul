import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export interface UploadResult {
  url: string;
  fileName: string;
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB = 10;

export async function uploadMedia(file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File type ${file.type} not allowed`);
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size exceeds ${MAX_SIZE_MB}MB limit`);
  }

  const provider = process.env.MEDIA_STORAGE_PROVIDER ?? 'local';

  if (provider === 'local') {
    return uploadLocal(file);
  }

  // Future: S3, Cloudinary, Vercel Blob, Supabase Storage
  throw new Error(`Media storage provider '${provider}' not yet implemented`);
}

async function uploadLocal(file: File): Promise<UploadResult> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const ext = file.name.split('.').pop() ?? 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, safeName), buffer);

  return {
    url: `/uploads/${safeName}`,
    fileName: safeName,
  };
}

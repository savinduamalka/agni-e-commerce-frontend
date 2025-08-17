import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file to the specified Supabase bucket and returns the public URL.
 * @param bucketName - The name of the Supabase storage bucket.
 * @param file - The File object to upload.
 * @returns Promise<string> - The public URL of the uploaded file.
 */
export async function uploadFileToBucket(
  bucketName: string,
  file: File
): Promise<string> {
  if (!file) throw new Error('File is required');
  const uploadPath = `${file.name}-${Date.now()}`;
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(uploadPath, file, { upsert: true });
  if (error || !data)
    throw new Error(error?.message || 'Failed to upload file');
  const publicUrl = supabase.storage.from(bucketName).getPublicUrl(data.path)
    .data.publicUrl;
  if (!publicUrl) throw new Error('Failed to get public URL');
  return publicUrl;
}

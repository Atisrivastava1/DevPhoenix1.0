import { supabase, supabaseAdmin, hasAdminConfig } from './client';

const dbClient = hasAdminConfig ? supabaseAdmin : supabase;

export const storageService = {
  /**
   * Upload a file to Supabase Storage
   * @param file File object
   * @param bucket Bucket name (e.g. 'media')
   * @param folder Optional folder path (e.g. 'programs')
   * @returns Public URL of the uploaded file
   */
  async uploadFile(file: File, bucket: string = 'media', folder: string = 'uploads'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    console.log(`STORAGE UPLOAD: Uploading ${file.name} to bucket = ${bucket}, path = ${filePath}`);

    const { error: uploadError } = await dbClient.storage
      .from(bucket)
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      console.error('Upload Error:', uploadError);
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }

    const { data } = dbClient.storage.from(bucket).getPublicUrl(filePath);
    console.log(`STORAGE UPLOAD SUCCESS: Public URL = ${data.publicUrl}`);
    return data.publicUrl;
  },

  /**
   * Delete a file from Supabase Storage
   * @param publicUrl Full public URL of the file
   * @param bucket Bucket name
   */
  async deleteFile(publicUrl: string, bucket: string = 'media'): Promise<void> {
    try {
      console.log(`STORAGE DELETE: Attempting to remove publicUrl = ${publicUrl} from bucket = ${bucket}`);
      // Extract file path from public URL
      const urlParts = publicUrl.split(`/${bucket}/`);
      if (urlParts.length < 2) throw new Error('Invalid public URL');
      const filePath = urlParts[1];

      const { error } = await dbClient.storage.from(bucket).remove([filePath]);
      if (error) throw error;
      console.log(`STORAGE DELETE SUCCESS: Path = ${filePath} removed successfully.`);
    } catch (err: any) {
      console.error('Delete Error:', err);
      throw new Error(`Failed to delete image: ${err.message}`);
    }
  }
};

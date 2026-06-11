import { v2 as cloudinary } from 'cloudinary';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
const apiKey = process.env.CLOUDINARY_API_KEY || '';
const apiSecret = process.env.CLOUDINARY_API_SECRET || '';

export const hasCloudinaryConfig = !!(cloudName && apiKey && apiSecret);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
  console.log('☁️ Cloudinary configured successfully.');
} else {
  console.warn(
    '⚠️ CLOUDINARY CREDENTIALS MISSING: File uploads will fall back to local disk. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to .env.local.'
  );
}

// ---------------------------------------------------------------------------
// Storage Service
// ---------------------------------------------------------------------------
export const cloudinaryService = {
  /**
   * Upload a file to Cloudinary
   * @param file File object (from FormData)
   * @param folder Folder path in Cloudinary (e.g. 'devphoenix/programs')
   * @returns Public URL of the uploaded file
   */
  async uploadFile(file: File, folder: string = 'devphoenix/uploads'): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const b64 = buffer.toString('base64');
    const mime = file.type || 'image/jpeg';
    const dataURI = `data:${mime};base64,${b64}`;

    const cleanFolder = `devphoenix/${folder}`.replace(/\/+/g, '/');

    console.log(`☁️ CLOUDINARY UPLOAD: ${file.name} → folder="${cleanFolder}"`);

    try {
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: cleanFolder,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
      });
      console.log(`☁️ CLOUDINARY UPLOAD SUCCESS: ${result.secure_url}`);
      return result.secure_url;
    } catch (error: any) {
      console.error('☁️ CLOUDINARY UPLOAD ERROR:', error);
      throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
    }
  },

  /**
   * Delete a file from Cloudinary by its public URL
   * @param publicUrl Full Cloudinary URL of the file
   */
  async deleteFile(publicUrl: string): Promise<void> {
    try {
      console.log(`☁️ CLOUDINARY DELETE: ${publicUrl}`);

      // Extract public_id from URL
      // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/{public_id}.{ext}
      const publicId = extractPublicId(publicUrl);
      if (!publicId) {
        console.warn('☁️ Could not extract public_id from URL:', publicUrl);
        return;
      }

      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`☁️ CLOUDINARY DELETE RESULT:`, result);
    } catch (err: any) {
      console.error('☁️ CLOUDINARY DELETE ERROR:', err);
      throw new Error(`Cloudinary delete failed: ${err.message}`);
    }
  },
};

/**
 * Extract the Cloudinary public_id from a secure URL.
 * e.g. "https://res.cloudinary.com/dozcyfpxs/image/upload/v1234/devphoenix/programs/abc.jpg"
 *   → "devphoenix/programs/abc"
 */
function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');

    // Find the "upload" segment, everything after it (skipping version) is the public_id
    const uploadIdx = pathParts.indexOf('upload');
    if (uploadIdx === -1) return null;

    // Skip version segment (starts with 'v' followed by digits)
    let startIdx = uploadIdx + 1;
    if (pathParts[startIdx] && /^v\d+$/.test(pathParts[startIdx])) {
      startIdx++;
    }

    const publicIdWithExt = pathParts.slice(startIdx).join('/');
    // Remove file extension
    const lastDot = publicIdWithExt.lastIndexOf('.');
    return lastDot > 0 ? publicIdWithExt.substring(0, lastDot) : publicIdWithExt;
  } catch {
    return null;
  }
}

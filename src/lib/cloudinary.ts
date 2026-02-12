const CLOUD_NAME = 'disuugutd';

export const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/**
 * Upload an image to Cloudinary using unsigned upload.
 * You must create an unsigned upload preset in your Cloudinary dashboard:
 * Settings > Upload > Upload presets > Add > Signing Mode: Unsigned
 * Name it "houserent_unsigned"
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'house_rent');

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('Cloudinary upload error:', errorData);
    throw new Error(errorData?.error?.message || 'Image upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}

import { v2 as cloudinary } from "cloudinary";

/**
 * Validate Cloudinary environment variables
 */
function validateCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME environment variable is required. " +
      "You can find it in your Cloudinary dashboard at https://console.cloudinary.com/"
    );
  }

  if (!apiKey) {
    throw new Error("CLOUDINARY_API_KEY environment variable is required");
  }

  if (!apiSecret) {
    throw new Error("CLOUDINARY_API_SECRET environment variable is required");
  }

  return { cloudName, apiKey, apiSecret };
}

/**
 * Configure Cloudinary
 */
try {
  const { cloudName, apiKey, apiSecret } = validateCloudinaryConfig();
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });
} catch (error) {
  console.error("Cloudinary configuration error:", error);
  // Configuration will fail at runtime if env vars are missing
}

/**
 * Uploads an image to Cloudinary
 * @param imageBase64 - Base64 encoded image string
 * @param folder - Optional folder path in Cloudinary
 * @returns The uploaded image URL
 */
export async function uploadImage(
  imageBase64: string,
  folder: string = "body_ai"
): Promise<string> {
  try {
    // Validate configuration before upload
    validateCloudinaryConfig();

    // Extract base64 data (remove data:image/...;base64, prefix if present)
    const base64Data = imageBase64.includes(",")
      ? imageBase64.split(",")[1]
      : imageBase64;

    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Data}`,
      {
        folder,
        resource_type: "image",
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      }
    );

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    
    if (error instanceof Error && error.message.includes("CLOUDINARY_CLOUD_NAME")) {
      throw error;
    }
    
    throw new Error(
      error instanceof Error 
        ? `Failed to upload image: ${error.message}` 
        : "Failed to upload image to Cloudinary"
    );
  }
}

/**
 * Deletes an image from Cloudinary
 * @param imageUrl - The image URL to delete
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const filename = urlParts[urlParts.length - 1];
    const publicId = filename.split(".")[0];
    const folder = urlParts[urlParts.length - 2];

    await cloudinary.uploader.destroy(`${folder}/${publicId}`);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    // Don't throw error, just log it
  }
}

export { cloudinary };

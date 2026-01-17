import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

/**
 * POST /api/upload
 * Uploads an image to Cloudinary
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Validate that it's a base64 image
    if (!image.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image format. Expected base64 image data." },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImage(image, "body_ai/photos");

    return NextResponse.json(
      {
        url: imageUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

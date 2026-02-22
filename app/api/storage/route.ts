import { NextResponse } from "next/server";
import { s3Client, BUCKET_NAME } from "@/lib/s3";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

// Helper to buffer stream (if needed, but Request.formData() handles it)

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const path = (formData.get("path") as string) || "uploads/";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!BUCKET_NAME) {
      console.error("AWS_S3_BUCKET_NAME is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();

    // Ensure path ends with a slash if provided
    const normalizedPath = path.endsWith("/") ? path : `${path}/`;
    const key = `${normalizedPath}${uuidv4()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    await s3Client.send(command);

    // Return the key (or signed URL immediately if requested, but usually just key)
    return NextResponse.json({ key });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    if (!BUCKET_NAME) {
      console.error("AWS_S3_BUCKET_NAME is not defined");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour

    const redirect = searchParams.get("redirect");
    if (redirect === "true") {
      return NextResponse.redirect(url);
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    return NextResponse.json({ error: "Failed to get URL" }, { status: 500 });
  }
}

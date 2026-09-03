import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthed } from "@/app/admin/actions";

// Client-side upload flow for product photos. The browser asks this route for a
// short-lived token (only if the admin is signed in), then uploads straight to
// Vercel Blob — so it isn't limited by the serverless request body size.

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        if (!(await isAuthed())) {
          throw new Error("Not authorized");
        }
        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/avif",
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10 MB
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Nothing to do — the client stores the returned URL on the product form.
      },
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: (err as Error).message },
      { status: 400 },
    );
  }
}

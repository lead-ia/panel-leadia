import { NextResponse } from "next/server";
import type { OAuthStartResponse } from "@/lib/types/oauth";

export async function GET() {
  try {
    const apiUrl = process.env.URL_API_SERVICE_EXTERNAL;

    if (!apiUrl) {
      return NextResponse.json(
        { error: "URL_API_SERVICE_EXTERNAL not configured" },
        { status: 500 },
      );
    }

    const response = await fetch(`${apiUrl}/calendar/oauth/start`);

    if (!response.ok) {
      throw new Error("Failed to get authorization URL");
    }

    const data: OAuthStartResponse = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error starting OAuth flow:", error);
    return NextResponse.json(
      { error: "Failed to start OAuth flow" },
      { status: 500 },
    );
  }
}

import { db } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

const TABLE_NAME = process.env.DASHBOARD_DATA;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get("tenantId") || "default";

    if (!TABLE_NAME) {
      console.warn("DASHBOARD_DATA environment variable is not defined.");
      return NextResponse.json(
        { error: "Dashboard data table not configured" },
        { status: 500 },
      );
    }

    const result = await db.get(TABLE_NAME, { tenantId });

    if (!result.Item) {
      return NextResponse.json(
        { error: "Dashboard data not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(result.Item);
  } catch (error: any) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 },
    );
  }
}

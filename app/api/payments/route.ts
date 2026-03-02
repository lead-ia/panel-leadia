import { db } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tableName = process.env.PAYMENTS_TABLE;
    if (!tableName) {
      throw new Error("PAYMENTS_TABLE environment variable is not defined");
    }
    const result = await db.scan(tableName);
    return NextResponse.json(result.Items || []);
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}

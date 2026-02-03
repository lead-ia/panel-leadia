import { db } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

const TABLE_NAME = process.env.PATIENTS_TABLE || "patients";

export async function GET() {
  try {
    const result = await db.scan(TABLE_NAME);
    return NextResponse.json(result.Items || []);
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

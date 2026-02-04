import { db } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

const TABLE_NAME = process.env.PATIENTS_TABLE;

export async function GET() {
  try {
    const result = await db.scan(TABLE_NAME!);
    return NextResponse.json(result.Items || []);
  } catch (error: any) {
    console.error("Error fetching patients:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { emails } = await request.json();

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json([]);
    }

    // Since DynamoDB scan filter expressions can be complex for a long list of OR conditions (or IN operator which is not directly supported in scan filter for many items efficiently without expression limitations),
    // and given the likely scale, we'll scan and filter in memory or use a filter expression if the list is small.
    // However, to be robust for this task and assuming table size isn't massive yet, scanning and filtering is the safest strictly "scan" approach requested,
    // though querying would be better if email was a GSI.
    // Let's check the user request: "receive a list of email and query the patients table to find those people... patients table the rows have the properties email and name"
    // The user said "query the database".
    
    // We will scan the whole table and filter for now as per "db.scan(TABLE_NAME!)" existing pattern, 
    // but optimized to only return needed fields and filter locally to avoid N+1 queries if we can't do a batch get (since we don't know the primary key structure, likely it's NOT email).
    
    const result = await db.scan(TABLE_NAME!, {
      ProjectionExpression: "#email, #name",
      ExpressionAttributeNames: {
        "#email": "email",
        "#name": "name",
      },
    });

    const allPatients = result.Items || [];
    const foundPatients = allPatients.filter((p: any) => emails.includes(p.email));

    return NextResponse.json(foundPatients);
  } catch (error: any) {
    console.error("Error fetching patients by email:", error);
    return NextResponse.json({ error: "Failed to fetch patients" }, { status: 500 });
  }
}

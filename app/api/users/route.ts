import { dynamoDb, TABLE_NAME } from "@/lib/dynamodb";
import { ScanCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const result = await dynamoDb.send(command);
    return NextResponse.json(result.Items);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();
    const newUser = {
      id,
      ...body,
      createdAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newUser,
    });

    await dynamoDb.send(command);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

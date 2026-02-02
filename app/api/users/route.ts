import { db, TABLE_NAME } from "@/lib/dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({});
const tableName = 'users'

export async function GET() {
  try {
    const result = await db.scan(TABLE_NAME);
    return NextResponse.json(result.Items);
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      return NextResponse.json([]);
    }
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId, email, ...rest } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    // 1. Check if the user already exists
    try {
      const command = new GetCommand({ TableName: tableName, Key: { email } });
      const existingUser = await client.send(command);
      if (existingUser.Item) {
        return NextResponse.json(existingUser.Item);
      }
    } catch (error: any) {
      console.log('Something went very wrong here!')
      console.log(error)
      // If table doesn't exist, we'll handle it in the creation step below
      if (error.name !== "ResourceNotFoundException") {
        throw error;
      }
    }

    // 2. Prepare new user record
    const newUser = {
      userId,
      email,
      ...rest,
      createdAt: new Date().toISOString(),
    };

    // 3. Try to create the user record
    try {
      const command = new PutCommand({ 
        TableName: tableName, 
        Item: { email, ...newUser } // email is the primary key
      });
      await client.send(command);
    } catch (error: any) {
      throw error;
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error in users POST:", error);
    return NextResponse.json({ error: "Failed to process user" }, { status: 500 });
  }
}

import { db, TABLE_NAME } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

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

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    // 1. Check if the user already exists
    try {
      const existingUser = await db.get(TABLE_NAME, { userId });
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
      await db.put(TABLE_NAME, newUser);
    } catch (error: any) {
      console.log('Something went wrong here', error)
      // 4. If table doesn't exist, create it dynamically
      if (error.name === "ResourceNotFoundException") {
        console.log(`Table ${TABLE_NAME} not found. Creating it...`);
        await db.createTable({
          TableName: TABLE_NAME,
          AttributeDefinitions: [
            { AttributeName: "userId", AttributeType: "S" }
          ],
          KeySchema: [
            { AttributeName: "userId", KeyType: "HASH" }
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          }
        });

        // Wait for table to be ready and retry put
        let retries = 10;
        while (retries > 0) {
          try {
            // Wait 2 seconds between retries
            await new Promise(resolve => setTimeout(resolve, 2000));
            await db.put(TABLE_NAME, newUser);
            console.log(`Successfully created user in new table ${TABLE_NAME}`);
            break;
          } catch (retryError: any) {
            if (retryError.name === "ResourceNotFoundException" || retryError.name === "TableCreatingException") {
              retries--;
              console.log(`Waiting for table ${TABLE_NAME} to be active... (${retries} retries left)`);
            } else {
              throw retryError;
            }
          }
        }
        
        if (retries === 0) {
          throw new Error("Table creation timed out");
        }
      } else {
        throw error;
      }
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error in users POST:", error);
    return NextResponse.json({ error: "Failed to process user" }, { status: 500 });
  }
}

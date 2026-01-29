import { db, TABLE_NAME } from "@/lib/dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

const client = new DynamoDBClient({});
const tableName = process.env.USERS_TABLE

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Since the primary key is 'email', use it in the Key
    const command = new GetCommand({
      TableName: tableName, 
      Key: { email: id } // 'id' param contains the email value
    })
    const result = await client.send(command)

    if (!result.Item) {
      console.log("User not found!!!");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result.Item);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    console.log('Updating user start')
    console.log('Updating user id: ', id)
    const body = await request.json();
    console.log('Incoming body: ', body)
    
    // Construct UpdateExpression dynamically based on body
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(body).forEach((key, index) => {
      if (key !== "email" && key !== "id") { // Don't allow updating the primary key (email)
        const attrName = `#attr${index}`;
        const attrValue = `:val${index}`;
        updateExpressionParts.push(`${attrName} = ${attrValue}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrValue] = body[key];
      }
    });

    if (updateExpressionParts.length === 0) {
       return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const result = await db.update(TABLE_NAME, { email: id }, {
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

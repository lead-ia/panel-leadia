import { dynamoDb, TABLE_NAME } from "@/lib/dynamodb";
import { GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const result = await dynamoDb.send(command);

    if (!result.Item) {
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
    const body = await request.json();
    
    // Construct UpdateExpression dynamically based on body
    const updateExpressionParts: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.keys(body).forEach((key, index) => {
      if (key !== "id") { // Don't allow updating the ID
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

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { id },
      UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: "ALL_NEW",
    });

    const result = await dynamoDb.send(command);
    return NextResponse.json(result.Attributes);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await dynamoDb.send(command);
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}

import { db } from "@/lib/dynamodb";
import { NextResponse } from "next/server";

const TABLE_NAME = process.env.PATIENTS_TABLE || "patients";

export async function POST(request: Request) {
  try {
    const { key, data } = await request.json();

    if (!key || !data) {
      return NextResponse.json({ error: "Key and data are required" }, { status: 400 });
    }

    const fields = Object.keys(data);
    if (!fields.includes('updatedAt')) {
        fields.push('updatedAt');
        data['updatedAt'] = new Date().toISOString();
    }
    
    let updateExpParts: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};
    
    fields.forEach((field, index) => {
        const pName = `#f${index}`;
        const pValue = `:v${index}`;
        updateExpParts.push(`${pName} = ${pValue}`);
        names[pName] = field;
        values[pValue] = data[field];
    });
    
    const params = {
        UpdateExpression: `SET ${updateExpParts.join(", ")}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: "ALL_NEW"
    };

    const result = await db.update(TABLE_NAME, key, params);
    return NextResponse.json(result.Attributes);

  } catch (error: any) {
    console.error("Error updating patient:", error);
    return NextResponse.json({ error: "Failed to update patient" }, { status: 500 });
  }
}

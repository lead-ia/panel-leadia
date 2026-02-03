import { NextResponse } from "next/server";
import type { OAuthCallbackResponse, OAuthErrorResponse } from "@/lib/types/oauth";
import { db, TABLE_NAME } from "@/lib/dynamodb";


export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const code = searchParams.get("code");
        const state = searchParams.get("state");

        if (!code) {
            return NextResponse.json(
                { error: "Missing authorization code" },
                { status: 400 }
            );
        }

        const apiUrl = process.env.URL_API_SERVICE_EXTERNAL;

        if (!apiUrl) {
            return NextResponse.json(
                { error: "URL_API_SERVICE_EXTERNAL not configured" },
                { status: 500 }
            );
        }

        const params = new URLSearchParams({ code });
        if (state) {
            params.append("state", state);
        }

        const response = await fetch(
            `${apiUrl}/calendar/oauth/callback?${params.toString()}`
        );


        if (!response.ok) {
            const error: OAuthErrorResponse = await response.json();
            return NextResponse.json(error, { status: response.status });
        }

        const data: OAuthCallbackResponse = await response.json();

        // Update user with calendar info
        if (data.success && data.oauth_data) {
            const { email, refresh_token, access_token, token_expiry } = data.oauth_data;
            
            try {
                await db.update(TABLE_NAME, { email: email }, {
                    UpdateExpression: "SET #calendarInfo = :calendarInfo",
                    ExpressionAttributeNames: {
                        "#calendarInfo": "calendarInfo"
                    },
                    ExpressionAttributeValues: {
                        ":calendarInfo": {
                             refresh_token,
                             access_token,
                             token_expiry,
                             email
                        }
                    }
                });
                console.log(`Successfully updated calendarInfo for ${email}`);
            } catch (dbError) {
                console.error("Error updating user in DynamoDB:", dbError);
                // We continue even if DB update fails to return the data to the client, 
                // or you might want to return an error here.
            }
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error processing OAuth callback:", error);
        return NextResponse.json(
            { error: "Failed to process OAuth callback" },
            { status: 500 }
        );
    }
}

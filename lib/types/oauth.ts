export interface OAuthStartResponse {
    auth_url: string;
    message: string;
}

export interface OAuthCallbackResponse {
    success: boolean;
    oauth_data: {
        refresh_token: string;
        access_token: string;
        token_expiry: string;
        email: string;
    };
    message: string;
}

export interface OAuthErrorResponse {
    detail: string;
    error?: string;
}

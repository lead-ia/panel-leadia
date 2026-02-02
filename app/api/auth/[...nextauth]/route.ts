import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "799575129374-90l0u88qdtim133k0ip4impdkif1ln46.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent", 
        },
      },
    }),
  ],

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.access_token = account.access_token;
        token.refresh_token = account.refresh_token;
      }
      return token;
    },

    async session({ session, token } : any) {
      session.access_token = token.access_token as string;
      session.refresh_token = token.refresh_token as string;
      return session;
    },
  },
});

export { handler as GET, handler as POST };

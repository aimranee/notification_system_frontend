import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AuthService from "@/services/authServices";
import { AuthResponse } from "../../../../@types/auth";
import { ClientCredentialsResponse } from "../../../../@types/clientCredentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      id: "user-credentials",
      name: "User Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<AuthResponse | null> {
        const authService = new AuthService("");
        try {
          const loginInput = {
            username: credentials?.username,
            password: credentials?.password,
          };
          console.log("Authenticating user with input:", loginInput);

          const authResponse = await authService.authenticate(loginInput);
          console.log("Authentication response:", authResponse);

          if (authResponse.access_token) {
            return authResponse as AuthResponse;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error in authorization:", error);
          return null;
        }
      },
    }),
    CredentialsProvider({
      id: "client-credentials",
      name: "Client Credentials",
      credentials: {
        clientId: { label: "Client ID", type: "text" },
        clientSecret: { label: "Client Secret", type: "password" },
      },

      async authorize(
        credentials: any
      ): Promise<ClientCredentialsResponse | null> {
        const authService = new AuthService("");
        try {
          const loginInput = {
            clientId: credentials?.clientId,
            clientSecret: credentials?.clientSecret,
          };
          console.log("Authenticating user with input:", loginInput);

          const authResponse =
            await authService.authenticateUsingClientCredentials(loginInput);
          console.log("Authentication response:", authResponse);

          if (authResponse.access_token) {
            return authResponse as ClientCredentialsResponse;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error in authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
        token.scope = user.scope;
        token.expires_in = user.expires_in;
        token.client_app_id = user.client_app_id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.access_token = token.access_token as string;
      session.user.scope = token.scope as string;
      session.user.expires_in = token.expires_in as number;
      session.user.client_app_id = token.client_app_id as string;
      session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});

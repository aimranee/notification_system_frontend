import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AuthService from "@/services/authServices";
import { AuthResponse } from "../../../../@types/auth";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials: any): Promise<AuthResponse | null> {
        const authService = new AuthService();
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
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.access_token = user.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.access_token = token.access_token as string;
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

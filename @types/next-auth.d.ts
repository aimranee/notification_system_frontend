import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      access_token: string;
      expires_in: number;
      refresh_expires_in: number;
      refresh_token: string;
      session_state: string;
      scope: string;
      client_app_id: string;
      role: string;
    };
  }

  interface User {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    session_state: string;
    scope: string;
    client_app_id: string;
    role: string;
  }
}

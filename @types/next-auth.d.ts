import NextAuth, { DefaultSession } from 'next-auth';

// declare module 'next-auth' {
//   /**
//    * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     access_token: string;
//     expires_in: number;
//     refresh_expires_in: number;
//     refresh_token: string;
//     token_type: string;
//     not_before_policy: number;
//     session_state: string;
//     scope: string;
//   }
// }


declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      access_token: string;
      expires_in: number;
      refresh_expires_in: number;
      refresh_token: string;
      token_type: string;
      not_before_policy: number;
      session_state: string;
      scope: string;
    };
  }

  interface User {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    not_before_policy: number;
    session_state: string;
    scope: string;
  }
}

// import "next-auth";

// declare module "next-auth" {
//   interface Session {
//     accessToken?: string;
//     refreshToken?: string;
//     expires?: number;
//     error?: string;
//   }

//   interface User {
//     id: string;
//     accessToken: string;
//     refreshToken: string;
//     expires: number;
//   }

//   interface JWT {
//     accessToken?: string;
//     refreshToken?: string;
//     expires?: number;
//     error?: string;
//   }
// }


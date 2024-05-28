import NextAuth, { NextAuthOptions, User as DefaultUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import AuthService from "@/services/authServices";

const MAX_AGE = parseInt(process.env.NEXTAUTH_SESSION_DURATION || "0", 10);

const authService = new AuthService();

type NextAuthOptionsCallback = (
  req: NextApiRequest,
  res: NextApiResponse
) => NextAuthOptions;

interface ExtendedUser extends DefaultUser {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
  exp: number; // Add the 'exp' property
}

async function refreshAccessToken(token: ExtendedUser) {
  try {
    console.log("===========================================>");

    const response = await authService.refreshToken(token.refresh_token);
    if (response.access_token) {
      token.access_token = response.access_token;
      token.refresh_token = response.refresh_token;
      token.expires_in = response.expires_in;
      token.refresh_expires_in = response.refresh_expires_in;
      token.token_type = response.token_type;
      token.not_before_policy = response.not_before_policy;
      token.session_state = response.session_state;
      token.scope = response.scope;
    }
  } catch (error) {
    console.error("Failed to refresh token", error);
    // Handle error if necessary
  }
  return token;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any, req): Promise<ExtendedUser | null> {
        try {
          const loginInput: LoginInput = {
            username: credentials?.username,
            password: credentials?.password,
          };

          const authResponse = await authService.authenticate(loginInput);

          if (authResponse.access_token) {
            // console.log("token : " + authResponse.access_token);
            return authResponse as ExtendedUser;
          } else {
            return null;
          }
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // async signIn({ user, account }: any) {
    //   return !!user.access_token;
    // },

    async jwt({ token, user }) {

      if (user) {
        const extendedUser = user as ExtendedUser;
        const tokenExpirationTime = extendedUser.exp * 1000;
        let updatedToken = {
          ...token,
          access_token: extendedUser.access_token,
          exp: extendedUser.expires_in,
          refresh_expires_in: extendedUser.refresh_expires_in,
          refresh_token: extendedUser.refresh_token,
          token_type: extendedUser.token_type,
          not_before_policy: extendedUser.not_before_policy,
          session_state: extendedUser.session_state,
          scope: extendedUser.scope,
        };
        console.log("===========================================>1");

        if (Date.now() > tokenExpirationTime) {
          // Token has expired, refresh it
          const updatedToken = await refreshAccessToken(extendedUser);
          return { ...token, ...updatedToken };
        }
        return updatedToken;
      }

      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        access_token: token.access_token as string,
        expires_in: token.expires_in as number,
        refresh_expires_in: token.refresh_expires_in as number,
        refresh_token: token.refresh_token as string,
        token_type: token.token_type as string,
        not_before_policy: token.not_before_policy as number,
        session_state: token.session_state as string,
        scope: token.scope as string,
      };
      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === "development",

  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  jwt: {
    maxAge: MAX_AGE,
  },
  // secret: process.env.NEXTAUTH_SECRET,
};

export const nextAuthOptions: NextAuthOptionsCallback = () => {
  return authOptions;
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req, res));
};

export default handler;

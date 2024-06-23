import NextAuth, { User as DefaultUser } from "next-auth";

type ClientCredentials = {
  clientId: string;
  clientSecret: string;
};

export interface ClientCredentialsResponse extends DefaultUser {
  access_token: string;
}

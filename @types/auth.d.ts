// auth.d.ts
type LoginInput = {
  username: string;
  password: string;
};

type RefreshTokenResponse = AuthResponse;

type AuthResponse = {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  not_before_policy: number;
  session_state: string;
  scope: string;
};

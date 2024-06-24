import ApiClient from "@/lib/apiClient";
import axios from "axios";
import {
  AuthResponse,
  LoginInput,
  RefreshTokenResponse,
} from "../../@types/auth";
import {
  ClientCredentials,
  ClientCredentialsResponse,
} from "../../@types/clientCredentials";

class AuthService {
  private apiClient: ApiClient;

  constructor(token: string) {
    this.apiClient = new ApiClient(`${process.env.API_BASE_URL}`);
    if (token != "") this.apiClient.setToken(token);
  }

  async authenticate(loginInput: LoginInput): Promise<AuthResponse> {
    const response = await axios.post(
      "http://localhost:8888/keycloak-management-service/keycloak/login/admin",
      {
        username: loginInput?.username,
        password: loginInput?.password,
      }
    );
    if (response.data.access_token) {
      this.apiClient.setToken(response.data.access_token);
    }
    return response.data;
  }

  async authenticateUsingClientCredentials(
    loginInput: ClientCredentials
  ): Promise<ClientCredentialsResponse> {
    const response = await axios.post(
      "http://localhost:8888/keycloak-management-service/keycloak/login/client",
      {
        clientId: loginInput?.clientId,
        clientSecret: loginInput?.clientSecret,
      }
    );
    if (response.data.access_token) {
      this.apiClient.setToken(response.data.access_token);
    }
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axios.post<RefreshTokenResponse>(
        "http://localhost:8888/refresh-token",
        {
          refreshToken,
        }
      );

      if (response.data.access_token) {
        this.apiClient.setToken(response.data.access_token);
      }

      return response.data;
    } catch (error) {
      console.error("Error refreshing token", error);
      throw error;
    }
  }
}

export default AuthService;

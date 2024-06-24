import ApiClient from "@/lib/apiClient";

class ClientAppService {
  private apiClient: ApiClient;

  constructor(token: string) {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/keycloak-management-service/keycloak`
    );
    this.apiClient.setToken(token);
  }

  async getAllClientsApp(): Promise<ClientAppResponse[]> {
    return this.apiClient
      .get("/findAll")
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async getClientAppByName(name: string): Promise<ClientAppResponse> {
    return this.apiClient
      .get("/name/" + name)
      .then((response) => response.data);
  }

  async getClientAppByKeycloak(appId: string): Promise<ClientAppResponse> {
    return this.apiClient
      .get("/find/clientKeycloakId/" + appId)
      .then((response) => response.data);
  }

  async createClientApp(
    ClientApp: CreateClientApp
  ): Promise<ClientAppResponse> {
    return this.apiClient
      .post("/saveClientApp", { data: ClientApp })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async deleteClientApp(clientId: string): Promise<null> {
    return this.apiClient
      .delete("/delete/" + clientId)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }
}

export default ClientAppService;

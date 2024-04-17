import ApiClient from "@/lib/apiClient";

class ProviderService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(`${process.env.API_BASE_URL}`);
  }

  async getAllProviders(): Promise<ProviderResponse[]> {
    return this.apiClient
      .get("/notification-service/api/configuration/findAll")
      .then((response) => response.data);
  }
}

export default ProviderService;

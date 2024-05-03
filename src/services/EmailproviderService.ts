import ApiClient from "@/lib/apiClient";

class EmailProviderService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/notification-service/api/emailProvider`
    );
  }

  async getAllEmailProviders(): Promise<EmailProviderResponse[]> {
    return this.apiClient.get("/findAll").then((response) => response.data);
  }

  async getProvidersByName(name: string): Promise<EmailProviderResponse[]> {
    return this.apiClient
      .get("/name/" + name)
      .then((response) => response.data);
  }

  // async getProvider(id: number): Promise<ProviderResponse> {
  //   return this.apiClient
  //     .get("/v2/provider/" + id)
  //     .then((response) => response.data)
  //     .catch((err) => {
  //       throw err.data;
  //     });
  // }

  async createEmailProvider(
    Provider: CreateEmailProvider
  ): Promise<EmailProviderResponse> {
    return this.apiClient
      .post("/save", { data: Provider })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async deleteEmailProvider(id: number): Promise<null> {
    return this.apiClient
      .delete("/delete/" + id)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async editEmailProvider(
    editProvider: CreateEmailProvider,
    id: string | undefined
  ): Promise<EmailProviderResponse> {
    return this.apiClient
      .put("/update/" + id, { data: editProvider })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }
}

export default EmailProviderService;

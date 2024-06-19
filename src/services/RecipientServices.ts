import ApiClient from "@/lib/apiClient";

class RecipientServices {
  private apiClient: ApiClient;

  constructor(token: string) {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/notification-service/api/event`
    );
    this.apiClient.setToken(token);
  }
  async getRecipient(): Promise<RecipientResponse> {
    return this.apiClient
      .get("/findAllEmail")
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }
}

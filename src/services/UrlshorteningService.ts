import ApiClient from "@/lib/apiClient";

class UrlshorteningService {
  private apiClient: ApiClient;

  constructor(token: string) {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/urlshortening-service`
    );
    this.apiClient.setToken(token);
  }

  async getAll(clientAppId: string): Promise<UrlshorteningResponse[]> {
    return this.apiClient
      .get("/findAll/" + clientAppId)
      .then((response) => response.data);
  }

  async getEvent(id: string): Promise<EventResponse> {
    return this.apiClient
      .get("/find/" + id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  async editTemplate(editTemplate: UpdateEvent): Promise<EventResponse> {
    return this.apiClient
      .put("/v2/template/" + editTemplate.id, { data: editTemplate })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }
}

export default UrlshorteningService;

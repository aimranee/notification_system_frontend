import ApiClient from "@/lib/apiClient";

class TemplateService {
  private apiClient: ApiClient;

  constructor(token: string) {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/notification-service/api/event`
    );
    if (token != "") this.apiClient.setToken(token);
  }

  async getAllEmailTemplates(): Promise<EventResponse[]> {
    return this.apiClient
      .get("/findAllEmail")
      .then((response) => response.data);
  }

  async getAllEventNames(): Promise<EventsNameResponse[]> {
    return this.apiClient
      .get("/findAllEventNames")
      .then((response) => response.data);
  }

  // async getAllSmsTemplates(): Promise<EventResponse[]> {
  //   return this.apiClient.get("/findAllSms").then((response) => response.data);
  // }

  async createEvent(TemplateInput: CreateEvent): Promise<EventResponse> {
    if (TemplateInput?.notificationType === "email") {
      return this.apiClient
        .post("/saveEmail", { data: TemplateInput })
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw err.data;
        });
    } else {
      return this.apiClient
        .post("/saveSms", { data: TemplateInput })
        .then((response) => {
          return response.data;
        })
        .catch((err) => {
          throw err.data;
        });
    }
  }

  async deleteTemplate(id: string): Promise<null> {
    return this.apiClient
      .delete("v2/template/" + id)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
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

export default TemplateService;

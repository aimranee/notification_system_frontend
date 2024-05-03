import ApiClient from "@/lib/apiClient";

class TemplateService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/notification-service/api/templates`
    );
  }

  async getAllEmailTemplates(): Promise<TemplateResponse[]> {
    return this.apiClient
      .get("/findAllEmail")
      .then((response) => response.data);
  }

  // async getAllSmsTemplates(): Promise<TemplateResponse[]> {
  //   return this.apiClient.get("/findAllSms").then((response) => response.data);
  // }

  // async getTemplate(id: string): Promise<TemplateResponse> {
  //   return this.apiClient
  //     .get("/v2/template/" + id)
  //     .then((response) => response.data.data)
  //     .catch((err) => {
  //       throw err.data;
  //     });
  // }

  async createTemplate(
    TemplateInput: CreateTemplate
  ): Promise<TemplateResponse> {
    if (TemplateInput.type === "email") {
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

  async editTemplate(editTemplate: UpdateTemplate): Promise<TemplateResponse> {
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

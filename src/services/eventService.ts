import ApiClient from "@/lib/apiClient";

class EventService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(
      `${process.env.API_BASE_URL}/notification-service/api/event`
    );
  }

  async getAllEvents(): Promise<EventResponse[]> {
    return this.apiClient.get("/findAll").then((response) => response.data);
  }

  async getEvent(id: string): Promise<EventResponse> {
    return this.apiClient
      .get("/find/" + id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  async createEvent(eventInput: CreateEvent): Promise<EventResponse> {
    return this.apiClient
      .post("/save", { data: eventInput })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async deleteEvent(id: string): Promise<null> {
    return this.apiClient
      .delete("/delete/" + id)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async editEvent(editEvent: UpdateEvent): Promise<EventResponse> {
    return this.apiClient
      .put("/update", { data: editEvent })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }
}

export default EventService;

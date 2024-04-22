import ApiClient from "@/lib/apiClient";

class EventService {
  private apiClient: ApiClient;

  constructor() {
    this.apiClient = new ApiClient(`${process.env.API_BASE_URL}`);
  }

  async getAllEvents(): Promise<EventResponse[]> {
    return this.apiClient
      .get("/notification-service/api/event/findAll")
      .then((response) => response.data);
  }

  async getEvent(id: string): Promise<EventResponse> {
    return this.apiClient
      .get("/notification-service/api/event/find/" + id)
      .then((response) => response.data)
      .catch((err) => {
        throw err.data;
      });
  }

  async createEvent(eventInput: CreateEvent): Promise<EventResponse> {
    return this.apiClient
      .post("/notification-service/api/event/save", { data: eventInput })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async deleteEvent(id: string): Promise<null> {
    return this.apiClient
      .delete("/notification-service/api/event/delete/" + id)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }

  async editEvent(editEvent: UpdateEvent): Promise<EventResponse> {
    return this.apiClient
      .put("/notification-service/api/event/update", { data: editEvent })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        throw err.data;
      });
  }
}

export default EventService;

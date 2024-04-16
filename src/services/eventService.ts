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
}

export default EventService;

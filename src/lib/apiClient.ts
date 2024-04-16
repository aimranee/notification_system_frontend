import HttpClient from "./httpClient";

let signoutTriggered = false;

class ApiClient {
  private httpClient: HttpClient;

  constructor(baseUrl: string, timeout = 20000) {
    this.httpClient = new HttpClient(baseUrl, timeout);
  }

  async get(url: string): Promise<any> {
    return this.httpClient.get(url).then((response: any) => {
      console.log("res 2 : " + response.data);

      return response;
    });
  }
}

export default ApiClient;

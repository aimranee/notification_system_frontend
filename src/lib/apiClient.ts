import HttpClient from "./httpClient";

class ApiClient {
  private httpClient: HttpClient;

  constructor(baseUrl: string, timeout = 20000) {
    this.httpClient = new HttpClient(baseUrl, timeout);
  }

  setToken(token: string | null) {
    if (token) {
      this.httpClient.addHeader("Authorization", `Bearer ${token}`);
      return this;
    }

    this.httpClient.removeHeader("Authorization");
    return this;
  }

  setUserInfo(userInfo: any) {
    this.httpClient.addHeader("userInfo", `${JSON.stringify(userInfo)}`);
    return this;
  }

  async post(url: string, Request: any): Promise<any> {
    return this.httpClient.post(url, Request).then((response) => {
      return response;
    });
  }

  async get(url: string): Promise<any> {
    return this.httpClient.get(url).then((response) => {
      return response;
    });
  }

  async put(url: string, Request: any): Promise<any> {
    return this.httpClient.put(url, Request).then((response) => {
      return response;
    });
  }

  async delete(url: string, Request?: any): Promise<any> {
    return this.httpClient.delete(url, Request).then((response) => {
      return response;
    });
  }
}

export default ApiClient;

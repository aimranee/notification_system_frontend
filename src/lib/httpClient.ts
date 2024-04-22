import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  Method,
  ResponseType,
} from "axios";

interface HttpClientRequest {
  method?: Method;
  url?: string;
  headers?: any;
  params?: any;
  data?: any;
  timeout?: number;
  responseType?: ResponseType;
  onUploadProgress?: (progressEvent: any) => void;
}

interface HttpClientResponse<TData> {
  status: number;
  data: TData;
}

export class HttpClientError<TError = any> extends Error {
  status: number;
  data: TError;

  constructor(message: string, status: number, data: TError) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

class HttpClient {
  private axiosInstance: AxiosInstance;

  constructor(baseUrl = "", timeout = 20000) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async request<TData>(
    config: HttpClientRequest
  ): Promise<HttpClientResponse<TData>> {
    return this.axiosInstance
      .request(config)
      .then((response) => {
        return {
          status: response.status,
          data: response.data,
        };
      })
      .catch((err) => {
        const status = err?.response?.status || 0;
        const data = err?.response?.data || null;
        console.log(err.message, status, data);

        throw new HttpClientError(err.message, status, data);
      });
  }

  async get<TData = any>(url: string, config: HttpClientRequest = {}) {
    return this.request<TData>({ method: "GET", url, ...config });
  }

  async post<TData = any>(url: string, config: HttpClientRequest = {}) {
    return this.request<TData>({ method: "POST", url, ...config });
  }

  async put<TData = any>(url: string, config: HttpClientRequest = {}) {
    return this.request<TData>({ method: "PUT", url, ...config });
  }

  async delete<TData = any>(url: string, config: HttpClientRequest = {}) {
    return this.request<TData>({ method: "DELETE", url, ...config });
  }
}

export default HttpClient;

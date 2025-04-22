import { ApiResponse } from "@/types/api-response";
import { ApiError, NetworkError } from "./errors";
import { safeAwait } from "./safe-await";

const API_URL = "http://localhost:3000";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
    const [err, res] = await safeAwait(
      fetch(`${this.baseUrl}${endpoint}`, {
        credentials: "include", // Send cookies with the request
        ...options,
      })
    );
    if (err) throw new NetworkError();

    const resBody = (await res.json()) as ApiResponse<T>;

    if (!resBody.success) throw new ApiError(resBody.message);

    return resBody.data;
  }

  get<T>(url: string) {
    return this.request<T>(url, {
      method: "GET",
    });
  }

  post<T>(url: string, data = {}, contentType = "application/json") {
    return this.request<T>(url, {
      method: "POST",
      headers: { "Content-Type": contentType },
      body: JSON.stringify(data),
    });
  }

  put<T>(url: string, data = {}, contentType = "application/json") {
    return this.request<T>(url, {
      method: "PUT",
      headers: { "Content-Type": contentType },
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);

import type { ApiResponse } from "@neochef/common";
import { ApiError } from "@/lib/api-error";
import config from "@/config";

const API_URL = `${config.apiUrl}:${config.apiPort}`;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: "include",
        ...options,
      });
      const resBody = (await res.json()) as ApiResponse<T>;

      if (!resBody.success) {
        let retryAfter: number | undefined;
        if (res.status === 429) {
          const resetHeader = res.headers.get("X-RateLimit-Reset");
          if (resetHeader) {
            retryAfter = parseInt(resetHeader, 10);
          }
        }

        throw new ApiError(
          resBody.message,
          res.status,
          resBody.errorCode,
          retryAfter
        );
      }

      return resBody.data;
    } catch (error) {
      if (error instanceof ApiError) throw error;

      throw Error("Something went wrong");
    }
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

  delete<T>(url: string) {
    return this.request<T>(url, {
      method: "DELETE",
    });
  }

  patch<T>(url: string, data = {}, contentType = "application/json") {
    return this.request<T>(url, {
      method: "PATCH",
      headers: { "Content-Type": contentType },
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);

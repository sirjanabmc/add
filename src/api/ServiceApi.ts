import axios, { AxiosInstance, AxiosError } from 'axios';
import { Service, ServiceCategory, ServiceType, ServiceStatus } from '../types/service';

const API_BASE_URL = "http://localhost:3000/api";

export interface ApiResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  status: number;  
  timestamp: string;
}

export interface ServiceSearchParams {
  category?: ServiceCategory;
  type?: ServiceType;
  status?: ServiceStatus;
  query?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius: number;
  };
  page?: number;
  limit?: number;
}

export class ServiceApi {
  private static axiosInstance: AxiosInstance;

  public static initialize(apiKey?: string): void {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      timeout: 30000, // 30 seconds
    });
  }

  private static handleError(err: unknown): ApiResponse<never> {
    if (axios.isAxiosError(err)) {
      const axiosErr = err as AxiosError<any>;
      return {
        error: {
          code: axiosErr.response ? `HTTP_${axiosErr.response.status}` : 'NETWORK_ERROR',
          message: axiosErr.response?.data?.error?.message || axiosErr.message,
          details: axiosErr.response?.data || axiosErr,
        },
        status: axiosErr.response?.status || 500,
        timestamp: new Date().toISOString(),
      };
    }
    return {
      error: { code: 'UNKNOWN_ERROR', message: (err as Error).message, details: err },
      status: 500,
      timestamp: new Date().toISOString(),
    };
  }

  // --- API METHODS ---
  static async getAllServices(): Promise<ApiResponse<Service[]>> {
    try {
      const res = await this.axiosInstance.get('/services');
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async getServiceById(id: number): Promise<ApiResponse<Service>> {
    try {
      const res = await this.axiosInstance.get(`/services/${id}`);
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<{ id: number }>> {
    try {
      const res = await this.axiosInstance.post('/services', service);
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async updateService(id: number, service: Partial<Service>): Promise<ApiResponse<null>> {
    try {
      const res = await this.axiosInstance.put(`/services/${id}`, service);
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async deleteService(id: number): Promise<ApiResponse<null>> {
    try {
      const res = await this.axiosInstance.delete(`/services/${id}`);
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async getServicesByUser(): Promise<ApiResponse<Service[]>> {
    try {
      const res = await this.axiosInstance.get('/services/my');
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async toggleServiceStatus(id: number, isActive: boolean): Promise<ApiResponse<Service>> {
    try {
      const res = await this.axiosInstance.patch(`/services/${id}/status`, { is_active: isActive });
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }

  static async searchServices(query: string): Promise<ApiResponse<Service[]>> {
    try {
      const res = await this.axiosInstance.get(`/services?search=${encodeURIComponent(query)}`);
      return res.data;
    } catch (err) {
      return this.handleError(err);
    }
  }
}

const API_BASE = '/api';

interface ApiError {
  status: number;
  code?: string;
  message?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  assigned_instructor_id?: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: AuthUser;
}

class ApiClient {
  private accessToken: string | null = null;

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) {
      return undefined as T;
    }

    const data = await res.json();
    if (!res.ok) {
      const error = data as ApiError;
      throw {
        status: res.status,
        code: error.code ?? 'REQUEST_FAILED',
        message: error.message ?? 'Request failed',
      };
    }

    return data as T;
  }

  async login(email: string, password: string) {
    const data = await this.request<LoginResponse>('POST', '/auth/login', { email, password });
    this.accessToken = data.access_token;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  }

  async logout() {
    try {
      await this.request('POST', '/auth/logout');
    } finally {
      this.clearSession();
    }
  }

  clearSession() {
    this.accessToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  restoreSession() {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (!token || !user) {
      return false;
    }

    this.accessToken = token;
    return true;
  }
}

export const api = new ApiClient();

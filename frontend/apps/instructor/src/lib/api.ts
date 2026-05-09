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

  getStoredUser(): AuthUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  // ─── Instructor Endpoints ───────────────────────────

  async getBookings() {
    return this.request<any[]>('GET', '/bookings');
  }

  async getSlots(params?: { date?: string }) {
    const query = new URLSearchParams();
    if (params?.date) query.set('date', params.date);
    const qs = query.toString();
    return this.request<any[]>('GET', `/slots${qs ? `?${qs}` : ''}`);
  }

  async completeBooking(bookingId: string, status: 'completed' | 'no_show', notes?: string) {
    return this.request<any>('PATCH', `/bookings/${bookingId}/complete`, { status, notes });
  }

  async cancelBooking(bookingId: string, reason?: string) {
    return this.request<void>('DELETE', `/bookings/${bookingId}`, { reason, cancelled_by: 'instructor' });
  }

  async getStudents(instructorId: string) {
    return this.request<any[]>('GET', `/instructors/${instructorId}/students`);
  }
}

export const api = new ApiClient();

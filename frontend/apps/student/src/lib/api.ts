/**
 * API client for Bloknotik backend.
 * All requests go through Vite proxy: /api/* → http://localhost:3000/*
 */

const API_BASE = '/api';

interface ApiError {
  status: number;
  code: string;
  message: string;
}

class ApiClient {
  private accessToken: string | null = null;

  setToken(token: string | null) {
    this.accessToken = token;
  }

  getToken(): string | null {
    return this.accessToken;
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (res.status === 204) return undefined as T;

    const data = await res.json();

    if (!res.ok) {
      const error = data as ApiError;
      throw error;
    }

    return data as T;
  }

  // ─── Auth ─────────────────────────────────────

  async login(email: string, password: string) {
    const data = await this.request<{
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        name: string;
        role: string;
        assigned_instructor_id?: string;
      };
    }>('POST', '/auth/login', { email, password });

    this.accessToken = data.access_token;
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    localStorage.setItem('user', JSON.stringify(data.user));

    return data;
  }

  async refresh() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const data = await this.request<{ access_token: string }>(
      'POST',
      '/auth/refresh',
      { refresh_token: refreshToken }
    );

    this.accessToken = data.access_token;
    localStorage.setItem('access_token', data.access_token);
    return data;
  }

  async logout() {
    try {
      await this.request('POST', '/auth/logout');
    } finally {
      this.accessToken = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  // ─── Slots ────────────────────────────────────

  async getSlots(params?: { instructor_id?: string; date?: string }) {
    const query = new URLSearchParams();
    if (params?.instructor_id) query.set('instructor_id', params.instructor_id);
    if (params?.date) query.set('date', params.date);
    const qs = query.toString();
    return this.request<any[]>('GET', `/slots${qs ? `?${qs}` : ''}`);
  }

  // ─── Bookings ─────────────────────────────────

  async getBookings() {
    return this.request<any[]>('GET', '/bookings');
  }

  async getAvailability() {
    return this.request<{
      can_book: boolean;
      has_priority: boolean;
      lessons_this_week: number;
      min_required: number;
      waitlist_position?: number;
    }>('GET', '/bookings/availability');
  }

  async createBooking(slotId: string) {
    return this.request<any>('POST', '/bookings', { slot_id: slotId });
  }

  async cancelBooking(bookingId: string, reason?: string) {
    return this.request<void>('DELETE', `/bookings/${bookingId}`, { reason });
  }

  // ─── Waitlist ─────────────────────────────────

  async joinWaitlist(date: string, instructorId: string) {
    return this.request<{ id: string; position: number }>(
      'POST',
      '/waitlist',
      { date, instructor_id: instructorId }
    );
  }

  async getWaitlistStatus() {
    return this.request<any>('GET', '/waitlist/status');
  }

  async confirmWaitlist(entryId: string) {
    return this.request<any>('POST', `/waitlist/${entryId}/confirm`);
  }

  // ─── Progress ─────────────────────────────────

  async getProgress(studentId: string) {
    return this.request<{
      total_hours_driven: number;
      lessons_completed: number;
      lessons_this_week: number;
    }>('GET', `/students/${studentId}/progress`);
  }

  async getNotes(studentId: string) {
    return this.request<any[]>('GET', `/students/${studentId}/notes`);
  }

  // ─── Init ─────────────────────────────────────

  /** Restore session from localStorage on app start */
  restoreSession(): boolean {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.accessToken = token;
      return true;
    }
    return false;
  }

  getStoredUser() {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }
}

export const api = new ApiClient();

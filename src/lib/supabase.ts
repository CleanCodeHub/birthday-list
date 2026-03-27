const API_BASE = '/api';

export interface RSVP {
  id: string;
  name: string;
  adults: number;
  kids: number;
  comment: string | null;
  created_at: string;
}

export interface BirthdayInfo {
  id: string;
  birthday_person_name: string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  success: boolean;
  token?: string;
  error?: string;
}

interface SessionResponse {
  authenticated: boolean;
  token?: string;
}

let authToken: string | null = null;

export const api = {
  async getRsvps(): Promise<RSVP[]> {
    const response = await fetch(`${API_BASE}/rsvps.php`);
    return response.json();
  },

  async createRsvp(data: { name: string; adults: number; kids: number; comment: string | null }) {
    const response = await fetch(`${API_BASE}/rsvps.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  async updateRsvp(id: string, data: { name: string; adults: number; kids: number; comment: string | null }) {
    const response = await fetch(`${API_BASE}/rsvps.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ id, ...data }),
    });
    return response.json();
  },

  async deleteRsvp(id: string) {
    const response = await fetch(`${API_BASE}/rsvps.php?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    return response.json();
  },

  async deleteAllRsvps() {
    const response = await fetch(`${API_BASE}/rsvps.php?id=all`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` },
    });
    return response.json();
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
    }
    return data;
  },

  async logout() {
    const response = await fetch(`${API_BASE}/auth.php`, {
      method: 'DELETE',
    });
    authToken = null;
    return response.json();
  },

  async checkSession(): Promise<SessionResponse> {
    const response = await fetch(`${API_BASE}/auth.php`);
    const data = await response.json();
    if (data.token) {
      authToken = data.token;
    }
    return data;
  },

  setToken(token: string) {
    authToken = token;
  },

  async getBirthdayInfo(): Promise<BirthdayInfo | null> {
    const response = await fetch(`${API_BASE}/rsvps.php?action=get_birthday_info`);
    const data = await response.json();
    return data.length > 0 ? data[0] : null;
  },

  async updateBirthdayInfo(name: string) {
    const response = await fetch(`${API_BASE}/rsvps.php`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ birthday_person_name: name }),
    });
    return response.json();
  }
};

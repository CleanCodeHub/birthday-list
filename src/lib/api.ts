let authToken: string | null = null;

export interface RSVP {
  id: string;
  name: string;
  attending: boolean;
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
  error?: string;
  token?: string;
}

async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken && !endpoint.includes('auth.php')) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

export const api = {
  async getRsvps(): Promise<RSVP[]> {
    const data = await fetchAPI('api/rsvps.php');
    return data.map((rsvp: any) => ({
      ...rsvp,
      attending: Boolean(rsvp.attending)
    }));
  },

  async createRsvp(rsvpData: { name: string; attending: boolean; adults: number; kids: number; comment: string | null }) {
    const result = await fetchAPI('api/rsvps.php', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
    return result;
  },

  async updateRsvp(id: string, rsvpData: { name: string; attending: boolean; adults: number; kids: number; comment: string | null }) {
    const result = await fetchAPI('api/rsvps.php', {
      method: 'PUT',
      body: JSON.stringify({ id, ...rsvpData }),
    });
    return result;
  },

  async deleteRsvp(id: string) {
    const result = await fetchAPI(`api/rsvps.php?id=${id}`, {
      method: 'DELETE',
    });
    return result;
  },

  async deleteAllRsvps() {
    const result = await fetchAPI('api/rsvps.php?id=all', {
      method: 'DELETE',
    });
    return result;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const result = await fetchAPI('api/auth.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (result.success && result.token) {
        authToken = result.token;
        localStorage.setItem('authToken', result.token);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Login failed' };
    }
  },

  async logout() {
    try {
      await fetchAPI('api/auth.php', {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    authToken = null;
    localStorage.removeItem('authToken');
    return { success: true };
  },

  async checkSession() {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      authToken = storedToken;
    }

    if (!authToken) {
      return { authenticated: false };
    }

    try {
      const result = await fetchAPI('api/auth.php');
      return { authenticated: result.authenticated };
    } catch (error) {
      authToken = null;
      localStorage.removeItem('authToken');
      return { authenticated: false };
    }
  },

  async getBirthdayInfo(): Promise<BirthdayInfo | null> {
    try {
      const data = await fetchAPI('api/rsvps.php?action=get_birthday_info');
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      return null;
    }
  },

  async updateBirthdayInfo(name: string) {
    const result = await fetchAPI('api/rsvps.php', {
      method: 'PATCH',
      body: JSON.stringify({ birthday_person_name: name }),
    });
    return result;
  }
};

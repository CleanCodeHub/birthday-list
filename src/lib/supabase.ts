import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export const api = {
  async getRsvps(): Promise<RSVP[]> {
    const { data, error } = await supabase
      .from('rsvps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async createRsvp(data: { name: string; adults: number; kids: number; comment: string | null }) {
    const { data: newRsvp, error } = await supabase
      .from('rsvps')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return newRsvp;
  },

  async updateRsvp(id: string, data: { name: string; adults: number; kids: number; comment: string | null }) {
    const { data: updatedRsvp, error } = await supabase
      .from('rsvps')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return updatedRsvp;
  },

  async deleteRsvp(id: string) {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  },

  async deleteAllRsvps() {
    const { error } = await supabase
      .from('rsvps')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (error) throw error;
    return { success: true };
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, token: data.session?.access_token };
  },

  async logout() {
    await supabase.auth.signOut();
    return { success: true };
  },

  async checkSession(): Promise<SessionResponse> {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      authenticated: !!session,
      token: session?.access_token,
    };
  },

  setToken(token: string) {
    // This is handled automatically by Supabase client
  },

  async getBirthdayInfo(): Promise<BirthdayInfo | null> {
    const { data, error } = await supabase
      .from('birthday_info')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching birthday info:', error);
      return null;
    }
    return data;
  },

  async updateBirthdayInfo(name: string) {
    const { data: existingInfo } = await supabase
      .from('birthday_info')
      .select('id')
      .maybeSingle();

    if (existingInfo) {
      const { data, error } = await supabase
        .from('birthday_info')
        .update({ birthday_person_name: name, updated_at: new Date().toISOString() })
        .eq('id', existingInfo.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('birthday_info')
        .insert([{ birthday_person_name: name }])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }
};

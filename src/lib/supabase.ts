import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  async createRsvp(rsvpData: { name: string; attending: boolean; adults: number; kids: number; comment: string | null }) {
    const { data, error } = await supabase
      .from('rsvps')
      .insert([rsvpData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateRsvp(id: string, rsvpData: { name: string; attending: boolean; adults: number; kids: number; comment: string | null }) {
    const { data, error } = await supabase
      .from('rsvps')
      .update(rsvpData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
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

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (adminError || !adminData) {
      await supabase.auth.signOut();
      return { success: false, error: 'Not authorized as admin' };
    }

    return { success: true };
  },

  async logout() {
    await supabase.auth.signOut();
    return { success: true };
  },

  async checkSession() {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return { authenticated: false };
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    return {
      authenticated: !!adminData,
    };
  },

  async getBirthdayInfo(): Promise<BirthdayInfo | null> {
    const { data, error } = await supabase
      .from('birthday_info')
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateBirthdayInfo(name: string) {
    const { data: existing } = await supabase
      .from('birthday_info')
      .select('id')
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('birthday_info')
        .update({ birthday_person_name: name, updated_at: new Date().toISOString() })
        .eq('id', existing.id)
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

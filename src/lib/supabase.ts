import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      org_custom_forms: {
        Row: {
          id: string;
          org_id: string;
          slug: string;
          org_code: string;
          logo_url: string | null;
          colors: {
            primary: string;
            secondary: string;
            background: string;
            text: string;
          } | null;
          fields: any[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          slug: string;
          org_code?: string;
          logo_url?: string | null;
          colors?: {
            primary: string;
            secondary: string;
            background: string;
            text: string;
          } | null;
          fields?: any[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          slug?: string;
          org_code?: string;
          logo_url?: string | null;
          colors?: {
            primary: string;
            secondary: string;
            background: string;
            text: string;
          } | null;
          fields?: any[];
          created_at?: string;
          updated_at?: string;
        };
      };
      form_templates: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          category: 'global' | 'industry' | 'custom';
          is_global: boolean;
          is_active: boolean;
          org_id: string | null;
          fields: any[];
          layout: any;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          category?: 'global' | 'industry' | 'custom';
          is_global?: boolean;
          is_active?: boolean;
          org_id?: string | null;
          fields?: any[];
          layout?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          category?: 'global' | 'industry' | 'custom';
          is_global?: boolean;
          is_active?: boolean;
          org_id?: string | null;
          fields?: any[];
          layout?: any;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      form_analytics: {
        Row: {
          id: string;
          org_id: string;
          form_id: string | null;
          event_type: 'view' | 'submit' | 'abandon' | 'error' | 'field_focus' | 'field_blur' | 'field_change';
          event_data: any;
          user_agent: string | null;
          ip_address: string | null;
          referrer: string | null;
          session_id: string | null;
          duration_ms: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          form_id?: string | null;
          event_type: 'view' | 'submit' | 'abandon' | 'error' | 'field_focus' | 'field_blur' | 'field_change';
          event_data?: any;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          session_id?: string | null;
          duration_ms?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          form_id?: string | null;
          event_type?: 'view' | 'submit' | 'abandon' | 'error' | 'field_focus' | 'field_blur' | 'field_change';
          event_data?: any;
          user_agent?: string | null;
          ip_address?: string | null;
          referrer?: string | null;
          session_id?: string | null;
          duration_ms?: number | null;
          created_at?: string;
        };
      };
      form_field_analytics: {
        Row: {
          id: string;
          org_id: string;
          form_id: string | null;
          field_name: string;
          field_type: string;
          event_type: 'focus' | 'blur' | 'change' | 'validation_error';
          event_value: string | null;
          validation_error: string | null;
          interaction_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          form_id?: string | null;
          field_name: string;
          field_type: string;
          event_type: 'focus' | 'blur' | 'change' | 'validation_error';
          event_value?: string | null;
          validation_error?: string | null;
          interaction_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          form_id?: string | null;
          field_name?: string;
          field_type?: string;
          event_type?: 'focus' | 'blur' | 'change' | 'validation_error';
          event_value?: string | null;
          validation_error?: string | null;
          interaction_count?: number;
          created_at?: string;
        };
      };
      form_sessions: {
        Row: {
          id: string;
          org_id: string;
          form_id: string | null;
          session_id: string;
          started_at: string;
          ended_at: string | null;
          is_completed: boolean;
          total_duration_ms: number | null;
          field_interactions: any;
          browser_info: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          form_id?: string | null;
          session_id: string;
          started_at?: string;
          ended_at?: string | null;
          is_completed?: boolean;
          total_duration_ms?: number | null;
          field_interactions?: any;
          browser_info?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          form_id?: string | null;
          session_id?: string;
          started_at?: string;
          ended_at?: string | null;
          is_completed?: boolean;
          total_duration_ms?: number | null;
          field_interactions?: any;
          browser_info?: any;
          created_at?: string;
        };
      };
    };
  };
}

// Helper functions for database operations
export async function getFormByOrgCode(orgCode: string) {
  const { data, error } = await supabase
    .from('org_custom_forms')
    .select('*')
    .eq('org_code', orgCode)
    .single();

  return { data, error };
}

export async function getFormTemplates(category?: string, orgId?: string) {
  let query = supabase
    .from('form_templates')
    .select('*')
    .eq('is_active', true);

  if (category) {
    query = query.eq('category', category);
  }

  if (orgId) {
    query = query.or(`is_global.eq.true,org_id.eq.${orgId}`);
  } else {
    query = query.eq('is_global', true);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  return { data, error };
}

export async function trackAnalyticsEvent(event: {
  org_id: string;
  form_id?: string;
  event_type: string;
  event_data?: any;
  session_id?: string;
  duration_ms?: number;
  field_name?: string;
  field_type?: string;
}) {
  const { data, error } = await supabase
    .from('form_analytics')
    .insert({
      ...event,
      user_agent: typeof window !== 'undefined' ? window.navigator.userAgent : null,
      ip_address: null // Will be set by RLS policy
    });

  return { data, error };
}

export async function createFormSession(session: {
  org_id: string;
  form_id?: string;
  session_id: string;
  browser_info?: any;
}) {
  const { data, error } = await supabase
    .from('form_sessions')
    .insert({
      ...session,
      started_at: new Date().toISOString()
    });

  return { data, error };
}

export async function updateFormSession(sessionId: string, updates: {
  ended_at?: string;
  is_completed?: boolean;
  total_duration_ms?: number;
  field_interactions?: any;
}) {
  const { data, error } = await supabase
    .from('form_sessions')
    .update(updates)
    .eq('session_id', sessionId);

  return { data, error };
}

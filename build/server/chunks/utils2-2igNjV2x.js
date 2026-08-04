import { createClient } from '@supabase/supabase-js';
import 'clsx';
import { z } from 'zod';

const PUBLIC_SUPABASE_URL = "https://srlwxabgqnyjdhxrwnic.supabase.co";
const PUBLIC_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNybHd4YWJncW55amRoeHJ3bmljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NDcwODIsImV4cCI6MjA4MjUyMzA4Mn0.m0zGC1qbLvzMBWqZe7CDaPac6eNNKG12dxy-61rkvTs";
const supabaseUrl = PUBLIC_SUPABASE_URL;
const supabaseAnonKey = PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});
async function getFormByOrgCode(orgCode) {
  const { data, error } = await supabase.from("org_custom_forms").select("*").eq("org_code", orgCode).single();
  return { data, error };
}
async function trackAnalyticsEvent(event) {
  const { data, error } = await supabase.from("form_analytics").insert({
    ...event,
    user_agent: typeof window !== "undefined" ? window.navigator.userAgent : null,
    ip_address: null
    // Will be set by RLS policy
  });
  return { data, error };
}
async function createFormSession(session) {
  const { data, error } = await supabase.from("form_sessions").insert({
    ...session,
    started_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  return { data, error };
}
function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
class FormError extends Error {
  constructor(message, field, code) {
    super(message);
    this.field = field;
    this.code = code;
    this.name = "FormError";
  }
}
function handleApiError(error) {
  if (error?.code === "PGRST116") {
    return new FormError("Form not found", void 0, "FORM_NOT_FOUND");
  }
  if (error?.message) {
    return new FormError(error.message, error.field, error.code);
  }
  return new FormError("An unexpected error occurred", void 0, "UNKNOWN_ERROR");
}
z.object({
  id: z.string(),
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(["text", "email", "phone", "textarea", "select", "checkbox"]),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
    pattern: z.string().optional()
  }).optional()
});

export { generateSessionId as a, createFormSession as c, getFormByOrgCode as g, handleApiError as h, trackAnalyticsEvent as t };
//# sourceMappingURL=utils2-2igNjV2x.js.map

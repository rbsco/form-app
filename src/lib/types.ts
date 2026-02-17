import { z } from 'zod';

// Form field configuration schema
export const FormFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'checkbox']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional()
  }).optional()
});

export type FormField = z.infer<typeof FormFieldSchema>;

// Form configuration schema
export const FormConfigSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  slug: z.string(),
  org_code: z.string().length(6),
  logo_url: z.string().url().optional(),
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    background: z.string(),
    text: z.string()
  }),
  fields: z.array(FormFieldSchema),
  layout: z.object({
    columns: z.number().min(1).max(4).default(1),
    fieldOrder: z.array(z.string()),
    spacing: z.enum(['compact', 'normal', 'relaxed']).default('normal')
  }).optional(),
  settings: z.object({
    show_progress: z.boolean().default(false),
    auto_save: z.boolean().default(true),
    confirmation_message: z.string().optional(),
    redirect_url: z.string().url().optional()
  }).optional()
});

export type FormConfig = z.infer<typeof FormConfigSchema>;

// Form submission schema
export const FormSubmissionSchema = z.object({
  form_id: z.string(),
  org_code: z.string().length(6),
  data: z.record(z.any()),
  session_id: z.string().optional(),
  user_agent: z.string().optional(),
  referrer: z.string().optional()
});

export type FormSubmission = z.infer<typeof FormSubmissionSchema>;

// Analytics event schema
export const AnalyticsEventSchema = z.object({
  form_id: z.string(),
  org_id: z.string(),
  event_type: z.enum(['view', 'submit', 'abandon', 'error', 'field_focus', 'field_blur', 'field_change']),
  event_data: z.record(z.any()).optional(),
  session_id: z.string().optional(),
  duration_ms: z.number().optional(),
  field_name: z.string().optional(),
  field_type: z.string().optional(),
  user_agent: z.string().optional(),
  ip_address: z.string().optional()
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

// Template schema
export const FormTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(['global', 'industry', 'custom']),
  is_global: z.boolean(),
  is_active: z.boolean(),
  org_id: z.string().optional(),
  fields: z.array(FormFieldSchema),
  layout: z.object({
    columns: z.number().min(1).max(4),
    fieldOrder: z.array(z.string()),
    spacing: z.enum(['compact', 'normal', 'relaxed']).default('normal')
  }),
  created_at: z.string(),
  updated_at: z.string(),
  created_by: z.string().optional()
});

export type FormTemplate = z.infer<typeof FormTemplateSchema>;

// Form session schema
export const FormSessionSchema = z.object({
  id: z.string(),
  org_id: z.string(),
  form_id: z.string(),
  session_id: z.string(),
  started_at: z.string(),
  ended_at: z.string().optional(),
  is_completed: z.boolean(),
  total_duration_ms: z.number().optional(),
  field_interactions: z.record(z.any()).optional(),
  browser_info: z.record(z.any()).optional()
});

export type FormSession = z.infer<typeof FormSessionSchema>;

// API Response schemas
export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional()
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Form state for frontend
export interface FormState {
  config: FormConfig | null;
  data: Record<string, any>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isSubmitted: boolean;
  sessionId: string;
  lastSaved: Date | null;
}

// Validation error type
export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

// Analytics summary type
export interface AnalyticsSummary {
  total_views: number;
  total_submissions: number;
  total_abandons: number;
  conversion_rate: number;
  avg_duration_ms: number;
  completion_rate: number;
}

// Browser info for analytics
export interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  cookieEnabled: boolean;
  onLine: boolean;
  screen: {
    width: number;
    height: number;
    colorDepth: number;
  };
}

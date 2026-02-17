import { type ClassValue, clsx } from 'clsx';
import { z } from 'zod';

// Utility function for combining CSS classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Generate unique session ID
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Generate unique field ID
export function generateFieldId(): string {
  return `field_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Validation helpers
export function validateField(field: any, value: any): { isValid: boolean; error?: string } {
  if (field.required && (!value || value.toString().trim() === '')) {
    return { isValid: false, error: `${field.label} is required` };
  }

  if (!value) return { isValid: true };

  switch (field.type) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { isValid: false, error: 'Please enter a valid email address' };
      }
      break;

    case 'phone':
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
      }
      break;

    case 'text':
    case 'textarea':
      const strValue = value.toString();
      if (field.validation?.min && strValue.length < field.validation.min) {
        return { isValid: false, error: `Must be at least ${field.validation.min} characters` };
      }
      if (field.validation?.max && strValue.length > field.validation.max) {
        return { isValid: false, error: `Must be no more than ${field.validation.max} characters` };
      }
      if (field.validation?.pattern) {
        const regex = new RegExp(field.validation.pattern);
        if (!regex.test(strValue)) {
          return { isValid: false, error: 'Invalid format' };
        }
      }
      break;
  }

  return { isValid: true };
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Local storage helpers
export const storage = {
  get: (key: string): any => {
    if (typeof window === 'undefined') return null;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: (key: string, value: any): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore errors
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
};

// Browser info for analytics
export function getBrowserInfo() {
  if (typeof window === 'undefined') return null;
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    screen: {
      width: screen.width,
      height: screen.height,
      colorDepth: screen.colorDepth
    }
  };
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#ffffff';
}

// Form field type guards
export function isSelectField(field: any): field is { type: 'select'; options: string[] } {
  return field.type === 'select' && Array.isArray(field.options);
}

export function isCheckboxField(field: any): field is { type: 'checkbox' } {
  return field.type === 'checkbox';
}

export function isTextareaField(field: any): field is { type: 'textarea' } {
  return field.type === 'textarea';
}

// Error handling
export class FormError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'FormError';
  }
}

// API error handling
export function handleApiError(error: any): FormError {
  if (error?.code === 'PGRST116') {
    return new FormError('Form not found', undefined, 'FORM_NOT_FOUND');
  }
  
  if (error?.message) {
    return new FormError(error.message, error.field, error.code);
  }
  
  return new FormError('An unexpected error occurred', undefined, 'UNKNOWN_ERROR');
}

// Form validation schema
export const FormFieldValidationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  label: z.string().min(1),
  type: z.enum(['text', 'email', 'phone', 'textarea', 'select', 'checkbox']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  validation: z.object({
    min: z.number().positive().optional(),
    max: z.number().positive().optional(),
    pattern: z.string().optional()
  }).optional()
});

// Type guards
export function isValidFormField(field: unknown): field is z.infer<typeof FormFieldValidationSchema> {
  try {
    FormFieldValidationSchema.parse(field);
    return true;
  } catch {
    return false;
  }
}

// Date formatting
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// URL utilities
export function getOrgCodeFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const path = window.location.pathname;
  const match = path.match(/^\/([A-Z0-9]{6})/);
  return match ? match[1] : null;
}

export function buildFormUrl(orgCode: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/${orgCode}`;
}

// Performance monitoring
export function measurePerformance<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  if (typeof window === 'undefined' || !window.performance) {
    return fn();
  }

  const start = performance.now();
  
  const result = fn();
  
  if (result instanceof Promise) {
    return result.finally(() => {
      const end = performance.now();
      console.log(`${name}: ${end - start}ms`);
    });
  } else {
    const end = performance.now();
    console.log(`${name}: ${end - start}ms`);
    return result;
  }
}

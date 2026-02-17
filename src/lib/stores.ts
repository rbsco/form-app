import { writable, derived, get } from 'svelte/store';
import { browser } from '$app/environment';
import { generateSessionId, storage } from './utils';
import type { FormConfig, FormState, AnalyticsEvent } from './types';

// Current form configuration
export const formConfig = writable<FormConfig | null>(null);

// Form data and state
export const formState = writable<FormState>({
  config: null,
  data: {},
  errors: {},
  isSubmitting: false,
  isSubmitted: false,
  sessionId: generateSessionId(),
  lastSaved: null
});

// Session tracking
export const sessionStartTime = writable<number>(Date.now());
export const sessionDuration = derived(
  sessionStartTime,
  $startTime => Date.now() - $startTime
);

// Auto-save state
export const autoSaveEnabled = writable<boolean>(true);
export const lastAutoSave = writable<Date | null>(null);

// Form validation state
export const isValid = derived(
  formState,
  $formState => Object.keys($formState.errors).length === 0
);

// Form progress (for multi-step forms)
export const formProgress = derived(
  formState,
  $formState => {
    if (!$formState.config) return 0;
    
    const requiredFields = $formState.config.fields.filter(field => field.required);
    const filledRequiredFields = requiredFields.filter(field => {
      const value = $formState.data[field.name];
      return value && value.toString().trim() !== '';
    });
    
    return requiredFields.length > 0 
      ? (filledRequiredFields.length / requiredFields.length) * 100 
      : 0;
  }
);

// Analytics events queue
export const analyticsQueue = writable<AnalyticsEvent[]>([]);

// Form actions
export const formActions = {
  // Initialize form with configuration
  initialize: (config: FormConfig) => {
    formState.update(state => ({
      ...state,
      config,
      data: {},
      errors: {},
      isSubmitted: false,
      sessionId: generateSessionId()
    }));
    
    formConfig.set(config);
    
    // Restore saved data if exists
    if (browser && config.settings?.auto_save) {
      const savedData = storage.get(`form_${config.id}_data`);
      if (savedData) {
        formState.update(state => ({
          ...state,
          data: savedData
        }));
      }
    }
  },

  // Update field value
  updateField: (fieldName: string, value: any) => {
    formState.update(state => {
      const newData = { ...state.data, [fieldName]: value };
      
      // Clear error for this field
      const newErrors = { ...state.errors };
      delete newErrors[fieldName];
      
      // Auto-save if enabled
      if (browser && state.config?.settings?.auto_save && autoSaveEnabled) {
        storage.set(`form_${state.config.id}_data`, newData);
        lastAutoSave.set(new Date());
      }
      
      return {
        ...state,
        data: newData,
        errors: newErrors
      };
    });
  },

  // Set field error
  setFieldError: (fieldName: string, error: string) => {
    formState.update(state => ({
      ...state,
      errors: {
        ...state.errors,
        [fieldName]: error
      }
    }));
  },

  // Clear field error
  clearFieldError: (fieldName: string) => {
    formState.update(state => {
      const newErrors = { ...state.errors };
      delete newErrors[fieldName];
      return { ...state, errors: newErrors };
    });
  },

  // Clear all errors
  clearErrors: () => {
    formState.update(state => ({ ...state, errors: {} }));
  },

  // Set submitting state
  setSubmitting: (isSubmitting: boolean) => {
    formState.update(state => ({ ...state, isSubmitting }));
  },

  // Mark form as submitted
  setSubmitted: () => {
    formState.update(state => ({ ...state, isSubmitted: true }));
    
    // Clear saved data after successful submission
    if (browser && state.config?.id) {
      storage.remove(`form_${state.config.id}_data`);
    }
  },

  // Reset form
  reset: () => {
    const config = get(formConfig);
    if (config) {
      formState.update(state => ({
        ...state,
        data: {},
        errors: {},
        isSubmitted: false,
        sessionId: generateSessionId()
      }));
      
      // Clear saved data
      if (browser) {
        storage.remove(`form_${config.id}_data`);
      }
    }
  },

  // Validate all fields
  validate: () => {
    const state = get(formState);
    const config = state.config;
    
    if (!config) return false;
    
    let isValid = true;
    const errors: Record<string, string> = {};
    
    for (const field of config.fields) {
      const value = state.data[field.name];
      
      if (field.required && (!value || value.toString().trim() === '')) {
        errors[field.name] = `${field.label} is required`;
        isValid = false;
      } else if (value) {
        // Additional validation based on field type
        switch (field.type) {
          case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
              errors[field.name] = 'Please enter a valid email address';
              isValid = false;
            }
            break;
            
          case 'phone':
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
              errors[field.name] = 'Please enter a valid phone number';
              isValid = false;
            }
            break;
            
          case 'text':
          case 'textarea':
            const strValue = value.toString();
            if (field.validation?.min && strValue.length < field.validation.min) {
              errors[field.name] = `Must be at least ${field.validation.min} characters`;
              isValid = false;
            }
            if (field.validation?.max && strValue.length > field.validation.max) {
              errors[field.name] = `Must be no more than ${field.validation.max} characters`;
              isValid = false;
            }
            break;
        }
      }
    }
    
    formState.update(state => ({ ...state, errors }));
    return isValid;
  }
};

// Analytics actions
export const analyticsActions = {
  // Track event
  trackEvent: (event: Omit<AnalyticsEvent, 'id'>) => {
    const queue = get(analyticsQueue);
    analyticsQueue.update(q => [...q, event as AnalyticsEvent]);
    
    // Process queue (in real implementation, this would send to server)
    processAnalyticsQueue();
  },

  // Track form view
  trackFormView: (formId: string, orgId: string) => {
    analyticsActions.trackEvent({
      form_id: formId,
      org_id: orgId,
      event_type: 'view',
      session_id: get(formState).sessionId,
      user_agent: browser ? navigator.userAgent : undefined
    });
  },

  // Track form submission
  trackFormSubmit: (formId: string, orgId: string, success: boolean) => {
    analyticsActions.trackEvent({
      form_id: formId,
      org_id: orgId,
      event_type: success ? 'submit' : 'error',
      session_id: get(formState).sessionId,
      duration_ms: get(sessionDuration),
      user_agent: browser ? navigator.userAgent : undefined
    });
  },

  // Track field interaction
  trackFieldInteraction: (
    formId: string, 
    orgId: string, 
    fieldName: string, 
    fieldType: string, 
    eventType: 'focus' | 'blur' | 'change'
  ) => {
    analyticsActions.trackEvent({
      form_id: formId,
      org_id: orgId,
      event_type: eventType === 'focus' ? 'field_focus' : 
                 eventType === 'blur' ? 'field_blur' : 'field_change',
      field_name: fieldName,
      field_type: fieldType,
      session_id: get(formState).sessionId,
      user_agent: browser ? navigator.userAgent : undefined
    });
  }
};

// Process analytics queue (simplified for now)
function processAnalyticsQueue() {
  const queue = get(analyticsQueue);
  if (queue.length === 0) return;
  
  // In real implementation, this would send events to your analytics endpoint
  console.log('Analytics events to process:', queue);
  
  // Clear queue
  analyticsQueue.set([]);
}

// Auto-save timer
let autoSaveTimer: NodeJS.Timeout;

if (browser) {
  // Set up auto-save every 30 seconds
  autoSaveTimer = setInterval(() => {
    const state = get(formState);
    const config = get(formConfig);
    
    if (config?.settings?.auto_save && get(autoSaveEnabled) && !state.isSubmitted) {
      storage.set(`form_${config.id}_data`, state.data);
      lastAutoSave.set(new Date());
    }
  }, 30000);
}

// Cleanup on page unload
if (browser) {
  window.addEventListener('beforeunload', () => {
    if (autoSaveTimer) {
      clearInterval(autoSaveTimer);
    }
  });
}

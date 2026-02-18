<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { formState, formConfig, analyticsActions } from '../stores';
  import { validateField } from '../utils';
  import type { FormField, FormConfig } from '../types';

  // Import field components
  import TextField from './fields/TextField.svelte';
  import TextareaField from './fields/TextareaField.svelte';
  import SelectField from './fields/SelectField.svelte';
  import CheckboxField from './fields/CheckboxField.svelte';

  export let config: FormConfig;
  export let disabled: boolean = false;
  export let showProgress: boolean = false;

  const dispatch = createEventDispatcher();
  let formData: Record<string, any> = {};
  let errors: Record<string, string> = {};
  let isSubmitting = false;

  // Field component mapping
  const fieldComponents = {
    text: TextField,
    email: TextField,
    phone: TextField,
    textarea: TextareaField,
    select: SelectField,
    checkbox: CheckboxField
  };

  onMount(() => {
    // Initialize form with config
    formActions.initialize(config);
    
    // Track form view
    analyticsActions.trackFormView(config.id, config.org_id);
    
    // Restore saved data if exists
    const savedData = localStorage.getItem(`form_${config.id}_data`);
    if (savedData) {
      try {
        formData = JSON.parse(savedData);
        formState.updateState({ data: formData });
      } catch (e) {
        console.warn('Failed to restore saved form data:', e);
      }
    }
  });

  function handleFieldChange(fieldName: string, value: any) {
    formData = { ...formData, [fieldName]: value };
    
    // Clear error for this field
    if (errors[fieldName]) {
      errors = { ...errors };
      delete errors[fieldName];
    }
    
    // Update store
    formState.updateState({ 
      data: formData, 
      errors 
    });
    
    // Auto-save
    if (config.settings?.auto_save !== false) {
      localStorage.setItem(`form_${config.id}_data`, JSON.stringify(formData));
    }
    
    dispatch('change', { fieldName, value, formData });
  }

  function handleFieldError(fieldName: string, error: string) {
    errors = { ...errors, [fieldName]: error };
    formState.updateState({ errors });
    dispatch('error', { fieldName, error });
  }

  async function handleSubmit() {
    if (isSubmitting || disabled) return;
    
    // Validate all fields
    let isValid = true;
    const newErrors: Record<string, string> = {};
    
    for (const field of config.fields) {
      const value = formData[field.name];
      const validation = validateField(field, value);
      
      if (!validation.isValid) {
        newErrors[field.name] = validation.error || `${field.label} is required`;
        isValid = false;
      }
    }
    
    errors = newErrors;
    formState.updateState({ errors });
    
    if (!isValid) {
      dispatch('validationError', { errors });
      return;
    }
    
    isSubmitting = true;
    formState.updateState({ isSubmitting: true });
    
    try {
      // Track submission start
      analyticsActions.trackFormSubmit(config.id, config.org_id, false);
      
      // Prepare submission data
      const submissionData = {
        form_id: config.id,
        org_code: config.org_code,
        data: formData,
        session_id: formState.sessionId,
        user_agent: navigator.userAgent,
        referrer: document.referrer
      };
      
      // Submit to server
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Track successful submission
        analyticsActions.trackFormSubmit(config.id, config.org_id, true);
        
        // Clear saved data
        localStorage.removeItem(`form_${config.id}_data`);
        
        formState.updateState({ 
          isSubmitted: true, 
          isSubmitting: false 
        });
        
        dispatch('submit', { data: formData, result });
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      formState.updateState({ isSubmitting: false });
      dispatch('error', { error: error.message });
    } finally {
      isSubmitting = false;
    }
  }

  function handleReset() {
    formData = {};
    errors = {};
    localStorage.removeItem(`form_${config.id}_data`);
    formState.updateState({ 
      data: {}, 
      errors: {}, 
      isSubmitted: false 
    });
    dispatch('reset');
  }

  // Get field component based on type
  function getFieldComponent(field: FormField) {
    return fieldComponents[field.type] || TextField;
  }

  // Calculate form layout
  function getFieldLayout() {
    const columns = config.layout?.columns || 1;
    const fieldOrder = config.layout?.fieldOrder || config.fields.map(f => f.name);
    
    // Sort fields according to fieldOrder
    const sortedFields = [...config.fields].sort((a, b) => {
      const aIndex = fieldOrder.indexOf(a.name);
      const bIndex = fieldOrder.indexOf(b.name);
      return aIndex - bIndex;
    });
    
    // Group fields into columns
    const columnGroups = [];
    for (let i = 0; i < columns; i++) {
      columnGroups.push([]);
    }
    
    sortedFields.forEach((field, index) => {
      const columnIndex = index % columns;
      columnGroups[columnIndex].push(field);
    });
    
    return columnGroups;
  }

  $: fieldLayout = getFieldLayout();
  $: progress = config.fields.filter(f => f.required && formData[f.name]).length / 
               config.fields.filter(f => f.required).length * 100;
</script>

<div class="w-full max-w-4xl mx-auto">
  {#if showProgress && config.fields.some(f => f.required)}
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium opacity-90">Form Progress</span>
        <span class="text-sm text-muted-foreground">{Math.round(progress)}%</span>
      </div>
      <div class="w-full bg-muted rounded-full h-2">
        <div 
          class="bg-primary h-2 rounded-full transition-all duration-300"
          style="width: {progress}%"
        ></div>
      </div>
    </div>
  {/if}

  <form 
    class="space-y-6"
    on:submit|preventDefault={handleSubmit}
    on:reset={handleReset}
  >
    {#if fieldLayout.length === 1}
      <!-- Single column layout -->
      {#each fieldLayout[0] as field (field.id)}
        <div class="animate-in fade-in duration-300" style="animation-delay: {index * 50}ms">
          <svelte:component 
            this={getFieldComponent(field)}
            {field}
            bind:value={formData[field.name]}
            bind:error={errors[field.name]}
            {disabled}
            on:change={(e) => handleFieldChange(field.name, e.detail.value)}
            on:error={(e) => handleFieldError(field.name, e.detail.error)}
          />
        </div>
      {/each}
    {:else}
      <!-- Multi-column layout -->
      <div class="grid gap-6" style="grid-template-columns: repeat({fieldLayout.length}, 1fr);">
        {#each fieldLayout as column, columnIndex}
          <div class="space-y-6">
            {#each column as field (field.id)}
              <div class="animate-in fade-in duration-300" style="animation-delay: {$index * 50}ms">
                <svelte:component 
                  this={getFieldComponent(field)}
                  {field}
                  bind:value={formData[field.name]}
                  bind:error={errors[field.name]}
                  {disabled}
                  on:change={(e) => handleFieldChange(field.name, e.detail.value)}
                  on:error={(e) => handleFieldError(field.name, e.detail.error)}
                />
              </div>
            {/each}
          </div>
        {/each}
      </div>
    {/if}

    <!-- Form actions -->
    <div class="flex flex-col sm:flex-row gap-3 pt-6 border-t border-muted">
      <button
        type="button"
        class="px-6 py-3 rounded-lg font-medium border border-muted bg-transparent hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        on:click={handleReset}
        {disabled}
      >
        Reset
      </button>
      
      <button
        type="submit"
        class="btn-primary flex items-center justify-center gap-2"
        {disabled}
        class:opacity-50={isSubmitting}
      >
        {#if isSubmitting}
          <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Submitting...
        {:else}
          Submit Form
        {/if}
      </button>
    </div>
  </form>
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formState, analyticsActions } from '../../stores';
  import { validateField } from '../../utils';
  import type { FormField } from '../../types';

  export let field: FormField;
  export let value: boolean = false;
  export let error: string = '';
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
  let checkboxElement: HTMLInputElement;
  let isFocused = false;

  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newValue = target.checked;
    
    value = newValue;
    error = '';
    
    // Update store
    formState.updateField(field.name, newValue);
    
    // Track analytics
    analyticsActions.trackFieldInteraction(
      formState.config?.id || '',
      formState.config?.org_id || '',
      field.name,
      field.type,
      'change'
    );
    
    dispatch('change', { value: newValue });
  }

  function handleFocus() {
    isFocused = true;
    
    // Track analytics
    analyticsActions.trackFieldInteraction(
      formState.config?.id || '',
      formState.config?.org_id || '',
      field.name,
      field.type,
      'focus'
    );
    
    dispatch('focus');
  }

  function handleBlur() {
    isFocused = false;
    
    // Validate on blur
    const validation = validateField(field, value);
    if (!validation.isValid) {
      error = validation.error || '';
      formState.setFieldError(field.name, error);
    } else {
      formState.clearFieldError(field.name);
    }
    
    // Track analytics
    analyticsActions.trackFieldInteraction(
      formState.config?.id || '',
      formState.config?.org_id || '',
      field.name,
      field.type,
      'blur'
    );
    
    dispatch('blur', { value, error });
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      value = !value;
      formState.updateField(field.name, value);
      dispatch('change', { value });
    }
  }

  $: hasError = error && error.length > 0;
  $: checkboxClasses = [
    'w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-2',
    hasError ? 'border-red-500' : 'border-gray-300',
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    isFocused ? 'ring-2 ring-primary ring-offset-2' : ''
  ].filter(Boolean).join(' ');
</script>

<div class="space-y-2">
  <label 
    for={field.id} 
    class="flex items-center gap-3 cursor-pointer"
    class:opacity-50={disabled}
  >
    <input
      bind:this={checkboxElement}
      id={field.id}
      name={field.name}
      type="checkbox"
      bind:checked={value}
      {disabled}
      class={checkboxClasses}
      on:change={handleChange}
      on:focus={handleFocus}
      on:blur={handleBlur}
      on:keydown={handleKeydown}
    />
    
    <span class="text-sm font-medium opacity-90 select-none">
      {field.label}
      {#if field.required}
        <span class="text-red-500">*</span>
      {/if}
    </span>
  </label>

  {#if hasError}
    <p class="error-text ml-8">{error}</p>
  {/if}

  {#if field.placeholder}
    <p class="text-xs text-muted-foreground ml-8">
      {field.placeholder}
    </p>
  {/if}
</div>

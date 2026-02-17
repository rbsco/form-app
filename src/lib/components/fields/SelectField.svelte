<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { formState, analyticsActions } from '../../stores';
  import { validateField } from '../../utils';
  import type { FormField } from '../../types';

  export let field: FormField;
  export let value: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let placeholder: string = 'Select an option...';

  const dispatch = createEventDispatcher();
  let selectElement: HTMLSelectElement;
  let isFocused = false;

  onMount(() => {
    // Set default value if none provided
    if (!value && field.options && field.options.length > 0) {
      value = '';
    }
  });

  function handleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    
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

  $: hasError = error && error.length > 0;
  $: selectClasses = [
    'form-field',
    hasError ? 'error-field' : '',
    isFocused ? 'ring-2 ring-primary' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  ].filter(Boolean).join(' ');

  $: hasOptions = field.options && field.options.length > 0;
</script>

<div class="space-y-2">
  {#if field.label}
    <label for={field.id} class="block text-sm font-medium opacity-90">
      {field.label}
      {#if field.required}
        <span class="text-red-500">*</span>
      {/if}
    </label>
  {/if}

  <select
    bind:this={selectElement}
    id={field.id}
    name={field.name}
    bind:value
    {disabled}
    class={selectClasses}
    class:w-full
    class:px-4
    class:py-2.5
    class:rounded-lg
    class:border
    class:bg-white/80
    class:focus:outline-none
    class:transition-all
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
    required={field.required}
  >
    <option value="" disabled selected={!value}>
      {placeholder}
    </option>
    
    {#if hasOptions}
      {#each field.options as option}
        <option value={option}>
          {option}
        </option>
      {/each}
    {/if}
  </select>

  {#if hasError}
    <p class="error-text">{error}</p>
  {/if}

  {#if !hasOptions}
    <p class="text-xs text-muted-foreground">
      No options available
    </p>
  {/if}
</div>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { formState, analyticsActions } from '../../stores';
  import { validateField } from '../../utils';
  import type { FormField } from '../../types';

  export let field: FormField;
  export let value: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let placeholder: string = field.placeholder || '';
  export let autocomplete: string = 'off';

  const dispatch = createEventDispatcher();
  let inputElement: HTMLInputElement;
  let isFocused = false;

  onMount(() => {
    if (inputElement && field.type === 'email') {
      inputElement.type = 'email';
    }
  });

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
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
    
    dispatch('input', { value: newValue });
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
    if (event.key === 'Enter' && field.type !== 'textarea') {
      event.preventDefault();
      dispatch('submit');
    }
  }

  $: inputType = field.type === 'phone' ? 'tel' : field.type;
  $: hasError = error && error.length > 0;
  $: inputClasses = [
    'form-field',
    hasError ? 'error-field' : '',
    isFocused ? 'ring-2 ring-primary' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  ].filter(Boolean).join(' ');
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

  <input
    bind:this={inputElement}
    id={field.id}
    name={field.name}
    type={inputType}
    value={value}
    {placeholder}
    {disabled}
    {autocomplete}
    class={inputClasses}
    class:w-full
    class:px-4
    class:py-2.5
    class:rounded-lg
    class:border
    class:bg-white/80
    class:focus:outline-none
    class:transition-all
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:keydown={handleKeydown}
    required={field.required}
    {field.type === 'email' ? 'pattern': ''}
    {field.type === 'phone' ? 'pattern': ''}
  />

  {#if hasError}
    <p class="error-text">{error}</p>
  {/if}

  {#if field.type === 'phone' && value}
    <p class="text-xs text-muted-foreground">
      Format: (555) 555-5555
    </p>
  {/if}
</div>

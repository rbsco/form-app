<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { formState, analyticsActions } from '../../stores';
  import { validateField } from '../../utils';
  import type { FormField } from '../../types';

  export let field: FormField;
  export let value: string = '';
  export let error: string = '';
  export let disabled: boolean = false;
  export let placeholder: string = field.placeholder || '';
  export let rows: number = 4;

  const dispatch = createEventDispatcher();
  let textareaElement: HTMLTextAreaElement;
  let isFocused = false;
  let characterCount = 0;

  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    const newValue = target.value;
    
    value = newValue;
    characterCount = newValue.length;
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
    
    dispatch('input', { value: newValue, characterCount });
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
    
    dispatch('blur', { value, error, characterCount });
  }

  function handleKeydown(event: KeyboardEvent) {
    // Handle Ctrl+Enter for submit
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      dispatch('submit');
    }
  }

  $: hasError = error && error.length > 0;
  $: inputClasses = [
    'form-field',
    hasError ? 'error-field' : '',
    isFocused ? 'ring-2 ring-primary' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    'resize-none'
  ].filter(Boolean).join(' ');

  $: maxLength = field.validation?.max;
  $: isNearLimit = maxLength && characterCount > maxLength * 0.9;
  $: isOverLimit = maxLength && characterCount > maxLength;
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

  <textarea
    bind:this={textareaElement}
    id={field.id}
    name={field.name}
    value={value}
    {placeholder}
    {disabled}
    {rows}
    class={inputClasses}
    class:w-full
    class:px-4
    class:py-2.5
    class:rounded-lg
    class:border
    class:bg-opacity-80
    class:bg-white
    class:focus:outline-none
    class:transition-all
    on:input={handleInput}
    on:focus={handleFocus}
    on:blur={handleBlur}
    on:keydown={handleKeydown}
    required={field.required}
    maxlength={maxLength}
  ></textarea>

  {#if maxLength}
    <div class="flex justify-between items-center text-xs">
      <div>
        {#if hasError}
          <span class="text-red-500">{error}</span>
        {:else if isOverLimit}
          <span class="text-red-500">Character limit exceeded</span>
        {:else if isNearLimit}
          <span class="text-yellow-600">Approaching character limit</span>
        {/if}
      </div>
      <div class="text-muted-foreground">
        {characterCount}/{maxLength}
      </div>
    </div>
  {:else if hasError}
    <p class="error-text">{error}</p>
  {/if}

  {#if field.validation?.min && characterCount < field.validation.min}
    <p class="text-xs text-muted-foreground">
      Minimum {field.validation.min} characters required
    </p>
  {/if}
</div>

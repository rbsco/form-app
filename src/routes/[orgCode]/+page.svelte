<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { getFormByOrgCode } from '$lib/supabase';
  import { formConfig, formState, analyticsActions } from '$lib/stores';
  import { handleApiError, getOrgCodeFromUrl } from '$lib/utils';
  import DynamicForm from '$lib/components/DynamicForm.svelte';
  import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-svelte';

  export let data;

  let orgCode = '';
  let formConfigData = null;
  let loading = true;
  let error = null;
  let submitted = false;
  let submissionResult = null;

  // Cleanup function for analytics
  let cleanupAnalytics = () => {};

  onMount(async () => {
    // Extract org code from URL
    orgCode = $page.params.orgCode?.toUpperCase();
    
    if (!orgCode || orgCode.length !== 6) {
      error = 'Invalid organization code';
      loading = false;
      return;
    }

    try {
      // Load form configuration
      const { data: configData, error: fetchError } = await getFormByOrgCode(orgCode);
      
      if (fetchError) {
        throw handleApiError(fetchError);
      }

      if (!configData) {
        error = 'Form not found for this organization';
        loading = false;
        return;
      }

      formConfigData = configData;
      formConfig.set(configData);
      
      // Apply custom colors
      if (configData.colors) {
        applyThemeColors(configData.colors);
      }

      // Track page view
      analyticsActions.trackFormView(configData.id, configData.org_id);
      
      loading = false;
    } catch (err) {
      console.error('Error loading form:', err);
      error = err.message || 'Failed to load form';
      loading = false;
    }
  });

  onDestroy(() => {
    cleanupAnalytics();
  });

  function applyThemeColors(colors) {
    const root = document.documentElement;
    
    // Set CSS custom properties
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-background', colors.background);
    root.style.setProperty('--color-text', colors.text);
    
    // Set body background
    document.body.style.backgroundColor = colors.background;
    document.body.style.color = colors.text;
  }

  function handleFormSubmit(event) {
    submitted = true;
    submissionResult = event.detail;
    
    // Track successful submission
    analyticsActions.trackFormSubmit(
      formConfigData.id, 
      formConfigData.org_id, 
      true
    );

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFormError(event) {
    console.error('Form error:', event.detail);
    
    // Track submission error
    analyticsActions.trackFormSubmit(
      formConfigData.id, 
      formConfigData.org_id, 
      false
    );
  }

  function submitAnother() {
    submitted = false;
    submissionResult = null;
    formState.reset();
  }

  function goBack() {
    window.history.back();
  }
</script>

<svelte:head>
  <title>
    {formConfigData ? `${formConfigData.org_code} - Work Order Form` : 'Loading...'}
  </title>
  <meta name="description" content="Submit a work order request" />
</svelte:head>

<div class="min-h-screen" style="background-color: var(--color-background, #ffffff);">
  {#if loading}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Loader2 class="w-12 h-12 animate-spin mx-auto mb-4" style="color: var(--color-primary, #3b82f6);" />
        <p class="text-lg font-medium" style="color: var(--color-text, #1f2937);">Loading form...</p>
      </div>
    </div>
  {:else if error}
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 class="text-2xl font-bold mb-2" style="color: var(--color-text, #1f2937);">Error</h1>
        <p class="text-lg mb-6 opacity-80" style="color: var(--color-text, #1f2937);">{error}</p>
        <button
          class="px-6 py-3 rounded-lg font-medium transition-colors"
          style="background-color: var(--color-primary, #3b82f6); color: white;"
          on:click={goBack}
        >
          Go Back
        </button>
      </div>
    </div>
  {:else if submitted}
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center max-w-md animate-in fade-in duration-500">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mb-6" style="background-color: var(--color-primary, #3b82f6);">
          <CheckCircle class="w-8 h-8 text-white" />
        </div>
        
        {#if formConfigData.logo_url}
          <img 
            src={formConfigData.logo_url} 
            alt="Organization Logo" 
            class="h-16 w-auto mx-auto mb-4 object-contain"
          />
        {/if}
        
        <h2 class="text-2xl font-bold mb-2" style="color: var(--color-text, #1f2937);">
          Request Submitted!
        </h2>
        
        <p class="text-lg mb-8 opacity-80" style="color: var(--color-text, #1f2937);">
          {formConfigData.settings?.confirmation_message || 'Your work order has been received successfully.'}
        </p>
        
        <div class="space-y-3">
          <button
            class="w-full px-6 py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
            style="background-color: var(--color-primary, #3b82f6);"
            on:click={submitAnother}
          >
            Submit Another Request
          </button>
          
          <button
            class="w-full px-6 py-3 rounded-lg font-medium border transition-colors"
            style="border-color: var(--color-primary, #3b82f6); color: var(--color-primary, #3b82f6);"
            on:click={goBack}
          >
            <ArrowLeft class="w-4 h-4 inline mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  {:else}
    <div class="min-h-screen py-8 px-4">
      <!-- Header -->
      <div class="max-w-4xl mx-auto mb-8">
        <div class="text-center">
          {#if formConfigData.logo_url}
            <img 
              src={formConfigData.logo_url} 
              alt="Organization Logo" 
              class="h-20 w-auto mx-auto mb-4 object-contain"
            />
          {/if}
          
          <h1 class="text-3xl font-bold mb-2" style="color: var(--color-primary, #3b82f6);">
            Work Order Request
          </h1>
          
          <p class="text-lg opacity-80" style="color: var(--color-text, #1f2937);">
            Please fill out the details below to submit your work order request.
          </p>
          
          <div class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" 
               style="background-color: var(--color-primary, #3b82f6); color: white;">
            Organization Code: {orgCode}
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-4xl mx-auto">
        <div class="bg-white/50 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-sm border" 
             style="border-color: rgba(0, 0, 0, 0.05); background-color: var(--color-background, #ffffff);">
          <DynamicForm 
            config={formConfigData}
            showProgress={formConfigData.settings?.show_progress}
            on:submit={handleFormSubmit}
            on:error={handleFormError}
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12 opacity-40 text-sm" style="color: var(--color-text, #1f2937);">
        Powered by Work Smart Management
      </div>
    </div>
  {/if}
</div>

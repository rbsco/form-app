<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { getFormByOrgCode } from "$lib/supabase";
  import {
    formActions,
    formConfig,
    formState,
    analyticsActions,
  } from "$lib/stores";
  import { handleApiError, getOrgCodeFromUrl } from "$lib/utils";
  import DynamicForm from "$lib/components/DynamicForm.svelte";
  import {
    CheckCircle,
    AlertCircle,
    Loader2,
    ArrowLeft,
    Bug,
  } from "lucide-svelte";

  // export let data;

  let orgCode = "";
  let formConfigData: any = null;
  let loading = true;
  let error: any = null;
  let submitted = false;
  let submissionResult = null;
  let debugInfo: any = null;
  let showDebug = false;
  let debugLoading = false;

  // Cleanup function for analytics
  let cleanupAnalytics = () => {};

  async function runDebug() {
    debugLoading = true;
    try {
      // Check environment variables
      const envVars = {
        PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL || "NOT SET",
        PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY
          ? "SET"
          : "NOT SET",
        browser: typeof window !== "undefined",
        orgCode: orgCode,
      };

      // Test Supabase connection
      let supabaseTest = null;
      try {
        const { data, error } = await getFormByOrgCode(orgCode);
        supabaseTest = {
          success: !error,
          data: data ? "FOUND" : "NOT FOUND",
          error: error?.message || null,
        };
      } catch (err: any) {
        supabaseTest = {
          success: false,
          error: err.message || String(err),
        };
      }

      // Check localStorage
      const localStorageTest = {
        available: typeof localStorage !== "undefined",
        canSet:
          typeof localStorage !== "undefined"
            ? (() => {
                try {
                  localStorage.setItem("test", "test");
                  localStorage.removeItem("test");
                  return true;
                } catch {
                  return false;
                }
              })()
            : false,
      };

      debugInfo = {
        envVars,
        supabaseTest,
        localStorageTest,
        timestamp: new Date().toISOString(),
      };
      showDebug = true;
    } catch (error: any) {
      debugInfo = {
        error: error?.message || String(error),
        timestamp: new Date().toISOString(),
      };
      showDebug = true;
    } finally {
      debugLoading = false;
    }
  }

  onMount(async () => {
    // Extract org code from URL
    orgCode = $page.params.orgCode?.toUpperCase() || "";

    if (!orgCode || orgCode.length !== 6) {
      error = "Invalid organization code";
      loading = false;
      return;
    }

    try {
      // Load form configuration by org code only; the database enforces
      // one form per organization and the get_form_by_slug RPC is not
      // deployed to the active Supabase project.
      const { data: configData, error: fetchError } =
        await getFormByOrgCode(orgCode);

      if (fetchError) {
        throw handleApiError(fetchError);
      }

      if (!configData) {
        error = "Form not found for this organization";
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
    } catch (err: any) {
      console.error("Error loading form:", err);
      error = err.message || "Failed to load form";
      loading = false;
    }
  });

  onDestroy(() => {
    cleanupAnalytics();
  });

  function applyThemeColors(colors: {
    primary: string | null;
    background: string | null;
    text: string | null;
  }) {
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty("--color-primary", colors.primary || "#3b82f6");
    root.style.setProperty(
      "--color-background",
      colors.background || "#ffffff",
    );
    root.style.setProperty("--color-text", colors.text || "#1f2937");

    // Set body background
    document.body.style.backgroundColor = colors.background || "#ffffff";
    document.body.style.color = colors.text || "#1f2937";
  }

  function handleFormSubmit(event: { detail: any }) {
    submitted = true;
    submissionResult = event.detail;

    // Track successful submission
    analyticsActions.trackFormSubmit(
      formConfigData.id,
      formConfigData.org_id,
      true,
    );

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormError(event: { detail: any }) {
    console.error("Form error:", event.detail);

    // Track submission error
    analyticsActions.trackFormSubmit(
      formConfigData.id,
      formConfigData.org_id,
      false,
    );
  }

  function submitAnother() {
    submitted = false;
    submissionResult = null;
    formActions.reset();
  }

  function goBack() {
    window.history.back();
  }
</script>

<svelte:head>
  <title>
    {formConfigData
      ? `${formConfigData.org_code} - Work Order Form`
      : "Loading..."}
  </title>
  <meta name="description" content="Submit a work order request" />
</svelte:head>

<div
  class="min-h-screen"
  style="background-color: var(--color-background, #ffffff);"
>
  {#if loading}
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <Loader2
          class="w-12 h-12 animate-spin mx-auto mb-4"
          style="color: var(--color-primary, #3b82f6);"
        />
        <p
          class="text-lg font-medium"
          style="color: var(--color-text, #1f2937);"
        >
          Loading form...
        </p>
        <!-- Debug Button -->
        <button
          on:click={runDebug}
          disabled={debugLoading}
          class="fixed bottom-4 right-4 text-white p-3 rounded-full shadow-lg transition-colors disabled:opacity-50 z-50"
          style="position: fixed; bottom: 20px; right: 20px; z-index: 9999; background-color: #ef4444; color: white; border: none; cursor: pointer; padding: 12px; border-radius: 50%; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
          title="Debug Form Issues"
        >
          {#if debugLoading}
            <Loader2 class="w-5 h-5 animate-spin" />
          {:else}
            <Bug class="w-5 h-5" />
          {/if}
        </button>
      </div>
    </div>
  {:else if error}
    <div class="min-h-screen flex items-center justify-center p-4">
      <div class="text-center max-w-md">
        <AlertCircle class="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1
          class="text-2xl font-bold mb-2"
          style="color: var(--color-text, #1f2937);"
        >
          Error
        </h1>
        <p
          class="text-lg mb-6 opacity-80"
          style="color: var(--color-text, #1f2937);"
        >
          {error}
        </p>
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
        <div
          class="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style="background-color: var(--color-primary, #3b82f6);"
        >
          <CheckCircle class="w-8 h-8 text-white" />
        </div>

        {#if formConfigData.logo_url}
          <img
            src={formConfigData.logo_url}
            alt="Organization Logo"
            class="h-16 w-auto mx-auto mb-4 object-contain"
          />
        {/if}

        <h2
          class="text-2xl font-bold mb-2"
          style="color: var(--color-text, #1f2937);"
        >
          Request Submitted!
        </h2>

        <p
          class="text-lg mb-8 opacity-80"
          style="color: var(--color-text, #1f2937);"
        >
          {formConfigData.settings?.confirmation_message ||
            "Your work order has been received successfully."}
        </p>

        <div class="space-y-3">
          <button
            class="w-full px-6 py-3 rounded-xl font-semibold text-white transition-all active:scale-[0.98]"
            style="background-color: var(--color-primary, #3b82f6);"
            on:click={submitAnother}
          >
            Submit Another Request
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

          <h1
            class="text-3xl font-bold mb-2"
            style="color: var(--color-primary, #3b82f6);"
          >
            Work Order Request
          </h1>

          <p
            class="text-lg opacity-80"
            style="color: var(--color-text, #1f2937);"
          >
            Please fill out the details below to submit your work order request.
          </p>

          <div
            class="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            style="background-color: var(--color-primary, #3b82f6); color: white;"
          >
            Organization Code: {orgCode}
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="max-w-4xl mx-auto">
        <div
          class="bg-white/50 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-sm border"
          style="border-color: rgba(0, 0, 0, 0.05); background-color: var(--color-background, #ffffff);"
        >
          <DynamicForm
            config={formConfigData}
            showProgress={formConfigData.settings?.show_progress}
            on:submit={handleFormSubmit}
            on:error={handleFormError}
          />
        </div>
      </div>

      <!-- Footer -->
      <div
        class="text-center mt-12 opacity-40 text-sm"
        style="color: var(--color-text, #1f2937);"
      >
        Powered by Task Master, through ATD Software
      </div>
    </div>
  {/if}
</div>

<!-- Debug Modal -->
{#if showDebug && debugInfo}
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem;"
  >
    <div
      class="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-auto relative"
      style="background: white; border-radius: 8px; max-width: 800px; width: 100%; max-height: 80vh; overflow: auto; position: relative;"
    >
      <button
        on:click={() => (showDebug = false)}
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        style="position: absolute; top: 16px; right: 16px; color: #6b7280; cursor: pointer; background: none; border: none; font-size: 20px;"
      >
        ×
      </button>

      <div class="p-6">
        <h2 class="text-xl font-bold mb-4">Form Debug Information</h2>

        <div class="space-y-4">
          <!-- Environment Variables -->
          <div>
            <h3 class="text-lg font-semibold mb-2 text-blue-600">
              Environment Variables
            </h3>
            <pre
              class="bg-gray-100 p-4 rounded text-xs overflow-auto"
              style="background: #f5f5f5; padding: 16px; border-radius: 4px; overflow: auto; font-size: 12px;">{JSON.stringify(
                debugInfo.envVars,
                null,
                2,
              )}</pre>
          </div>

          <!-- Supabase Test -->
          <div>
            <h3 class="text-lg font-semibold mb-2 text-green-600">
              Supabase Connection
            </h3>
            <pre
              class="bg-gray-100 p-4 rounded text-xs overflow-auto"
              style="background: #f5f5f5; padding: 16px; border-radius: 4px; overflow: auto; font-size: 12px;">{JSON.stringify(
                debugInfo.supabaseTest,
                null,
                2,
              )}</pre>
          </div>

          <!-- LocalStorage Test -->
          <div>
            <h3 class="text-lg font-semibold mb-2 text-purple-600">
              LocalStorage
            </h3>
            <pre
              class="bg-gray-100 p-4 rounded text-xs overflow-auto"
              style="background: #f5f5f5; padding: 16px; border-radius: 4px; overflow: auto; font-size: 12px;">{JSON.stringify(
                debugInfo.localStorageTest,
                null,
                2,
              )}</pre>
          </div>

          <!-- Error -->
          {#if debugInfo.error}
            <div>
              <h3 class="text-lg font-semibold mb-2 text-red-600">Error</h3>
              <pre
                class="bg-red-100 p-4 rounded text-xs"
                style="background: #fef2f2; padding: 16px; border-radius: 4px; font-size: 12px; color: #dc2626;">{debugInfo.error}</pre>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

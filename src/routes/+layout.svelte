<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  let isEmbedded = false;

  // Detect if running embedded in ATD layout
  onMount(() => {
    if (!browser) return;
    
    const checkEmbedded = () => {
      try {
        // Check if we're in an iframe or have ATD layout indicators
        const inIframe = window.self !== window.top;
        const hasATDNav = window.parent !== window && 
          (window.parent.document.querySelector('.logo') || 
           window.parent.document.querySelector('[class*="atd"]'));
        
        isEmbedded = Boolean(inIframe || hasATDNav);
      } catch {
        // If cross-origin access fails, assume not embedded
        isEmbedded = false;
      }
    };

    checkEmbedded();
    // Also check periodically in case the embedding changes
    const interval = setInterval(checkEmbedded, 1000);
    return () => clearInterval(interval);
  });
</script>

{#if isEmbedded}
  <!-- Embedded layout - minimal header, no sidebar -->
  <div class="embedded-layout">
    <header class="embedded-header">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
        </div>
        <h1 class="text-lg font-semibold text-gray-900">TaskMaster</h1>
      </div>
    </header>
    <main class="embedded-main">
      <slot />
    </main>
  </div>
{:else}
  <!-- Standalone layout - full app experience -->
  <div class="standalone-layout">
    <nav class="standalone-nav">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M9 11l3 3L22 4"></path>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
          </svg>
        </div>
        <div>
          <div class="font-bold text-gray-900 text-sm">TaskMaster</div>
          <div class="text-xs text-gray-500">Form & Workflow Management</div>
        </div>
      </div>
      
      <div class="nav-links">
        <a href="/" class:active={$page.url.pathname === '/'}>Dashboard</a>
        <a href="/forms" class:active={$page.url.pathname.startsWith('/forms')}>Forms</a>
        <a href="/workflows" class:active={$page.url.pathname.startsWith('/workflows')}>Workflows</a>
        <a href="/settings" class:active={$page.url.pathname === '/settings'}>Settings</a>
      </div>
    </nav>
    
    <main class="standalone-main">
      <slot />
    </main>
  </div>
{/if}

<style>
  .embedded-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f9fafb;
  }

  .embedded-header {
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .embedded-main {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }

  .standalone-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: #f9fafb;
  }

  .standalone-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    background: white;
  }

  .nav-links {
    display: flex;
    gap: 2rem;
  }

  .nav-links a {
    text-decoration: none;
    color: #6b7280;
    font-weight: 500;
    padding: 0.5rem 0;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }

  .nav-links a:hover {
    color: #374151;
  }

  .nav-links a.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .standalone-nav,
  .embedded-header {
    display: none;
  }

  .standalone-main {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  @media (max-width: 768px) {
    .standalone-nav {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .nav-links {
      gap: 1rem;
    }

    .standalone-main {
      padding: 1rem;
    }
  }
</style>

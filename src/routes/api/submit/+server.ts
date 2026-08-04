// `form-app/src/routes/api/submit/+server.ts`
//
// FIX: this endpoint previously validated the submission against Supabase,
// recorded an analytics event, and returned "success" WITHOUT ever creating
// a work order. The Rust backend already has a fully working handler for
// this at POST /api/forms/submit (inserts into form_submissions AND creates
// the matching work_orders row) — this endpoint just never called it.
//
// A prior attempt tried to relay to the Rust backend using
// `new URL('/api/forms/submit', request.url)`. Inside the SvelteKit server
// process, `request.url` is the externally-visible URL
// (e.g. https://taskmaster.atdsoftware.org/forms/<orgCode>), constructed
// with the SvelteKit `base: '/forms'` path config. Resolving a relative URL
// against that produces something like
// `https://taskmaster.atdsoftware.org/forms/api/submit` — which routes back
// into THIS SvelteKit app (wrong) and 404s, instead of reaching the Rust
// backend's `/api/forms/submit` route.
//
// The fix: use an explicit internal URL via env var rather than deriving it
// from the request. Both processes run as siblings inside the same Fly
// machine (see start.sh): SvelteKit listens on $PORT=3177, the Rust backend
// listens on $PORT=8080. From inside the SvelteKit server process,
// `http://localhost:8080` always reaches the Rust backend directly —
// no public hostname or TLS involved.
//
// RUST_BACKEND_URL can be overridden via Fly secrets/env if the internal
// port ever changes; it defaults to the documented internal port.

import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getFormByOrgCode, trackAnalyticsEvent, createFormSession } from '$lib/supabase';
import { handleApiError } from '$lib/utils';

const RUST_BACKEND_URL = env.RUST_BACKEND_URL || 'http://127.0.0.1:8080';

export async function POST({ request }) {
  try {
    const body = await request.json();

    const { form_id, org_code, data, session_id, user_agent, referrer } = body;

    // Basic presence check
    if (!form_id || !org_code || !data) {
      return json(
        { success: false, error: 'Missing required fields: form_id, org_code, data' },
        { status: 400 }
      );
    }

    // Verify the form exists for this org code (fast-fail before hitting Rust).
    const { data: formConfig, error: formError } = await getFormByOrgCode(org_code);

    if (formError || !formConfig) {
      return json(
        { success: false, error: 'Invalid organization code or form not found' },
        { status: 404 }
      );
    }

    // Guard against spoofed form_id
    if (formConfig.id !== form_id) {
      return json(
        { success: false, error: 'Form ID mismatch' },
        { status: 400 }
      );
    }

    // ── Relay to the Rust backend — this is the call that actually creates
    // the form_submissions row AND the work_orders row. Everything above is
    // just a fast client-facing validation; the Rust handler re-validates
    // the form server-side regardless. ──────────────────────────────────
    let backendResult: { id?: string; success?: boolean; message?: string } | null = null;
    try {
      const backendRes = await fetch(`${RUST_BACKEND_URL}/api/forms/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_id, org_code, data, session_id, user_agent, referrer })
      });

      if (!backendRes.ok) {
        const errText = await backendRes.text().catch(() => '');
        console.error('[form submit] backend rejected submission:', backendRes.status, errText);
        return json(
          { success: false, error: 'Could not save your submission. Please try again.' },
          { status: 502 }
        );
      }

      backendResult = await backendRes.json();
    } catch (relayErr) {
      // The Rust backend is unreachable — this is the one failure mode that
      // must NOT be silently swallowed, since it means no work order will
      // ever be created for this submission.
      console.error('[form submit] could not reach Rust backend:', relayErr);
      return json(
        { success: false, error: 'Form service is temporarily unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    // ── Best-effort analytics — failures here must NOT block the
    // already-successful submission above. ─────────────────────────────
    try {
      if (session_id) {
        await createFormSession({
          org_id: formConfig.org_id,
          form_id: formConfig.id,
          session_id,
          browser_info: { userAgent: user_agent, referrer }
        });
      }
      await trackAnalyticsEvent({
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        event_type: 'submit',
        event_data: data,
        session_id,
        user_agent
      });
    } catch (analyticsErr) {
      console.error('[form submit] analytics tracking failed (non-fatal):', analyticsErr);
    }

    return json({
      success: true,
      message: backendResult?.message || 'Form submitted successfully',
      data: {
        submission_id: backendResult?.id,
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        submitted_at: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('[form submit] error:', error);

    if (error?.name === 'ZodError') {
      return json(
        { success: false, error: 'Invalid submission data', details: error.errors },
        { status: 400 }
      );
    }

    const apiError = handleApiError(error);
    return json(
      { success: false, error: apiError.message, code: apiError.code },
      { status: 500 }
    );
  }
}

export async function GET() {
  return json({ error: 'Method not allowed' }, { status: 405 });
}

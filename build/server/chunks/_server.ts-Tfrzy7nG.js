import { j as json } from './index-CoD1IJuy.js';
import { g as getFormByOrgCode, c as createFormSession, t as trackAnalyticsEvent, h as handleApiError } from './utils2-2igNjV2x.js';
import '@supabase/supabase-js';
import 'clsx';
import 'zod';

async function POST({ request }) {
  try {
    const body = await request.json();
    const { form_id, org_code, data, session_id, user_agent, referrer } = body;
    if (!form_id || !org_code || !data) {
      return json(
        { success: false, error: "Missing required fields: form_id, org_code, data" },
        { status: 400 }
      );
    }
    const { data: formConfig, error: formError } = await getFormByOrgCode(org_code);
    if (formError || !formConfig) {
      return json(
        { success: false, error: "Invalid organization code or form not found" },
        { status: 404 }
      );
    }
    if (formConfig.id !== form_id) {
      return json(
        { success: false, error: "Form ID mismatch" },
        { status: 400 }
      );
    }
    if (session_id) {
      await createFormSession({
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        session_id,
        browser_info: {
          userAgent: user_agent,
          referrer
        }
      });
    }
    await trackAnalyticsEvent({
      org_id: formConfig.org_id,
      form_id: formConfig.id,
      event_type: "submit",
      event_data: data,
      session_id,
      user_agent
    });
    return json({
      success: true,
      message: "Form submitted successfully",
      data: {
        submission_id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        submitted_at: (/* @__PURE__ */ new Date()).toISOString()
      }
    });
  } catch (error) {
    console.error("[form submit] error:", error);
    if (error?.name === "ZodError") {
      return json(
        { success: false, error: "Invalid submission data", details: error.errors },
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
async function GET() {
  return json({ error: "Method not allowed" }, { status: 405 });
}

export { GET, POST };
//# sourceMappingURL=_server.ts-Tfrzy7nG.js.map

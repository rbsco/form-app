import { json } from '@sveltejs/kit';
import { getFormByOrgCode, trackAnalyticsEvent, createFormSession } from '$lib/supabase';
import { FormSubmissionSchema, type FormSubmission } from '$lib/types';
import { handleApiError } from '$lib/utils';

export async function POST({ request }) {
  try {
    const body = await request.json();
    
    // Validate submission data
    const submission = FormSubmissionSchema.parse(body) as FormSubmission;
    
    // Verify form exists and org code matches
    const { data: formConfig, error: formError } = await getFormByOrgCode(submission.org_code);
    
    if (formError || !formConfig) {
      return json(
        { success: false, error: 'Invalid organization code or form not found' },
        { status: 404 }
      );
    }
    
    // Verify form ID matches
    if (formConfig.id !== submission.form_id) {
      return json(
        { success: false, error: 'Form ID mismatch' },
        { status: 400 }
      );
    }
    
    // Create or update session
    if (submission.session_id) {
      await createFormSession({
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        session_id: submission.session_id,
        browser_info: {
          userAgent: submission.user_agent,
          referrer: submission.referrer
        }
      });
    }
    
    // Track submission event
    await trackAnalyticsEvent({
      org_id: formConfig.org_id,
      form_id: formConfig.id,
      event_type: 'submit',
      event_data: submission.data,
      session_id: submission.session_id,
      user_agent: submission.user_agent
    });
    
    // Here you would typically:
    // 1. Save the form data to your work_orders table
    // 2. Send notifications
    // 3. Trigger any workflows
    
    // For now, we'll just return success
    // In production, you'd want to integrate with your existing work order system
    
    return json({
      success: true,
      message: 'Form submitted successfully',
      data: {
        submission_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        org_id: formConfig.org_id,
        form_id: formConfig.id,
        submitted_at: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    if (error.name === 'ZodError') {
      return json(
        { 
          success: false, 
          error: 'Invalid submission data',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    const apiError = handleApiError(error);
    return json(
      { 
        success: false, 
        error: apiError.message,
        code: apiError.code 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

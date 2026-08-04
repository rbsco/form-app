// import { fail, type Actions, type ServerLoad } from '@sveltejs/kit';
// import { getFormByOrgCode } from '$lib/supabase';

// export const load: ServerLoad = async ({ params }) => {
//   const orgCode = params.orgCode?.toUpperCase();
  
//   if (!orgCode || orgCode.length !== 6) {
//     throw new Error('Invalid organization code');
//   }

//   try {
//     const { data: configData, error: fetchError } = await getFormByOrgCode(orgCode);

//     if (fetchError) {
//       throw new Error(fetchError.message);
//     }

//     if (!configData) {
//       throw new Error('Form not found for this organization');
//     }

//     return {
//       formConfig: configData
//     };
//   } catch (error) {
//     console.error('Error loading form:', error);
//     throw error;
//   }
// };

// export const actions: Actions = {
//   default: async ({ request, params }) => {
//     try {
//       const orgCode = params.orgCode?.toUpperCase();
//       const formData = await request.formData();
      
//       // Extract form data from the FormData
//       const submissionData: Record<string, any> = {};
//       for (const [key, value] of formData.entries()) {
//         submissionData[key] = value;
//       }

//       // Prepare the payload for the Rust backend
//       const payload = {
//         form_id: submissionData.form_id,
//         org_code: orgCode,
//         data: submissionData,
//         session_id: submissionData.session_id || null,
//         user_agent: request.headers.get('user-agent') || '',
//         referrer: request.headers.get('referer') || ''
//       };

//       // Send to Rust backend
//       const response = await fetch('http://localhost:8080/api/forms/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });

//       const result = await response.json();

//       if (!response.ok) {
//         return fail(response.status, { 
//           error: result.error || 'Submission failed',
//           data: submissionData 
//         });
//       }

//       return {
//         success: true,
//         submissionId: result.id,
//         data: result
//       };

//     } catch (error) {
//       console.error('Form submission error:', error);
//       return fail(500, { 
//         error: error instanceof Error ? error.message : 'Unknown error occurred' 
//       });
//     }
//   }
// };





// `form-app/src/routes/[orgCode]/+page.server.ts`
//
// NOTE: This file intentionally does NO data loading.
//
// The +page.svelte for this route loads the form config entirely client-side
// (inside onMount via getFormByOrgCode) and manages its own loading/error state.
// A server-side load that throws on a missing form would produce a hard 500 error
// page, bypassing the form's own graceful "Form not found" UI.
//
// Removing the server load keeps SSR fast (no Supabase round-trip on the server),
// lets the client show its own loading spinner, and means a bad org code shows
// the friendly inline error instead of a blank error page.

export const load = async () => {
  // Intentionally empty — all data fetching happens client-side in +page.svelte
  return {};
};

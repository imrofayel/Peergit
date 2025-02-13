import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const username = event.context.params?.username;

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username is required',
    });
  }

  console.log('Fetching analysis for username:', username); // Debug log

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  try {
    // First try to get existing analysis
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('github_username', username)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Supabase fetch error:', fetchError);
      throw createError({
        statusCode: 500,
        message: 'Database error occurred',
      });
    }

    if (existingAnalysis) {
      console.log('Found existing analysis');
      return existingAnalysis;
    }

    console.log('No existing analysis found, triggering new analysis');

    // If no analysis exists, trigger a new one
    try {
      const response = await $fetch(`/api/analyze?username=${encodeURIComponent(username)}`);
      console.log('New analysis generated successfully');
      return response;
    } catch (e: any) {
      console.error('Error generating new analysis:', e);
      throw createError({
        statusCode: 404,
        message: e.message || 'Unable to analyze GitHub profile',
      });
    }
  } catch (error: any) {
    console.error('Unexpected error:', error);
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'An unexpected error occurred',
    });
  }
});

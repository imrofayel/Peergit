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

    // Simplified error throwing
    throw createError({
      statusCode: 404,
      statusMessage: 'Analysis not found',
      data: { redirect: true, username }
    });

  } catch (error: any) {
    console.error('Error:', error);
    // Ensure we preserve the status code and message
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'An unexpected error occurred',
      data: error.data
    });
  }
});

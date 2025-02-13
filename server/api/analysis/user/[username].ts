import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const username = (event.context.params?.username || '').trim().toLowerCase();

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
    const { data: existingAnalysis, error: fetchError } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('github_username', username)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw createError({
        statusCode: 500,
        message: 'Database error occurred',
        data: { error: fetchError }
      });
    }

    if (existingAnalysis) {
      return existingAnalysis;
    }

    throw createError({
      statusCode: 404,
      message: 'Analysis not found',
      data: { redirect: true, username }
    });
  } catch (error: any) {
    // Ensure we preserve the error data
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An unexpected error occurred',
      data: error.data || { error }
    });
  }
});

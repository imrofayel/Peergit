import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Analysis ID is required',
    });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data, error } = await supabase
    .from('analysis_results')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw createError({
      statusCode: 404,
      message: 'Analysis not found',
    });
  }

  return data;
});

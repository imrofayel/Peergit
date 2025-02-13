// server/api/saveAnalysis.post.ts
import { createClient } from '@supabase/supabase-js';
import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  // Use readBody to get the request payload
  const body = await readBody(event) as { profile: any; stats: any; analysis: string };

  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  type AnalysisResult = {
    id: number;
    profile: any;
    stats: any;
    analysis: string;
  };

  const { data, error } = await supabase
    .from('analysis_results')
    .insert([{ profile: body.profile, stats: body.stats, analysis: body.analysis }])
    .select()
    .single<AnalysisResult>();

  if (error) {
    return { error: error.message };
  }

  return { id: data.id };
});

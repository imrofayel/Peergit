import { createClient } from '@supabase/supabase-js';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // Fetch all analyzed usernames
  const { data: analyses } = await supabase
    .from('analysis_results')
    .select('github_username, created_at')
    .order('created_at', { ascending: false });

  // Generate sitemap XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://peergit.vercel.app</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ${analyses?.map(analysis => `
  <url>
    <loc>https://peergit.vercel.app/${analysis.github_username}</loc>
    <lastmod>${new Date(analysis.created_at).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  `).join('')}
</urlset>`;

  setHeader(event, 'content-type', 'application/xml');
  return xml;
});

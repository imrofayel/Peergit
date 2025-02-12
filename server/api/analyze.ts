import { Octokit } from 'octokit';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  const username = query.username as string;

  if (!username) {
    throw createError({
      statusCode: 400,
      message: 'Username is required'
    });
  }

  const octokit = new Octokit({
    auth: config.public.githubToken
  });

  const genAI = new GoogleGenerativeAI(config.public.geminiApiKey);

  try {
    // Fetch user profile
    const { data: profile } = await octokit.rest.users.getByUsername({
      username,
    });

    // Fetch repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 10,
    });

    // Fetch READMEs for each repo
    const readmes = await Promise.all(
      repos.map(async (repo) => {
        try {
          const { data } = await octokit.rest.repos.getReadme({
            owner: username,
            repo: repo.name,
          });
          return Buffer.from(data.content, 'base64').toString();
        } catch {
          return '';
        }
      })
    );

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this GitHub user's profile and provide a positive, motivational analysis:
      
      User Profile:
      - Name: ${profile.name || profile.login}
      - Bio: ${profile.bio || 'No bio provided'}
      - Public Repos: ${profile.public_repos}
      - Followers: ${profile.followers}
      - Following: ${profile.following}
      
      Top Repositories:
      ${repos.map(repo => `- ${repo.name}: ${repo.description || 'No description'}`).join('\n')}
      
      Based on their repositories, technologies used, and overall GitHub activity:
      1. Highlight their strengths and skills
      2. Suggest potential career paths or project ideas
      3. Provide encouraging feedback about their coding journey
      4. Make specific recommendations for growth
      
      Keep the tone positive, professional, and motivational.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return {
      profile,
      repos,
      analysis
    };
  } catch (error: any) {
    console.error('Error:', error);
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'An error occurred'
    });
  }
});

import { Octokit } from 'octokit';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface GithubRepo {
  name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  created_at: string;
  html_url: string;
}

interface GithubProfile {
  login: string;
  name: string | null;
  bio: string | null;
  location: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  avatar_url: string;
}

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

    // Fetch all repositories
    const { data: repos } = await octokit.rest.repos.listForUser({
      username,
      sort: 'updated',
      per_page: 100,
      type: 'owner'
    });

    // Type assertion for the responses
    const typedProfile = profile as GithubProfile;
    const typedRepos = repos as GithubRepo[];

    // Fetch languages for each repo
    const repoLanguages = await Promise.all(
      typedRepos.map(async (repo) => {
        try {
          const { data } = await octokit.rest.repos.listLanguages({
            owner: username,
            repo: repo.name,
          });
          return data;
        } catch {
          return {};
        }
      })
    );

    // Calculate total stats
    const stats = {
      totalStars: typedRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0),
      totalForks: typedRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0),
      totalWatchers: typedRepos.reduce((sum, repo) => sum + (repo.watchers_count || 0), 0),
      languages: repoLanguages.reduce((acc, langs) => {
        Object.entries(langs).forEach(([lang, bytes]) => {
          acc[lang] = (acc[lang] || 0) + (bytes as number);
        });
        return acc;
      }, {} as Record<string, number>),
      mostStarredRepo: typedRepos.reduce((max, repo) => 
        (repo.stargazers_count || 0) > (max?.stargazers_count || 0) ? repo : max
      , typedRepos[0]),
      oldestRepo: typedRepos.reduce((oldest, repo) =>
        new Date(repo.created_at) < new Date(oldest.created_at) ? repo : oldest
      , typedRepos[0]),
      newestRepo: typedRepos.reduce((newest, repo) =>
        new Date(repo.created_at) > new Date(newest.created_at) ? repo : newest
      , typedRepos[0])
    };

    // Sort languages by usage
    const topLanguages = Object.entries(stats.languages)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([lang]) => lang);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Write a fun, engaging, and slightly playful analysis of this GitHub user's profile in a novel-like narrative style. 
      Include some light-hearted observations and friendly roasting where appropriate (but must do). Make it feel like a friend telling 
      another friend about someone interesting they discovered.

      Here's the user's data (but don't list these facts directly, weave them naturally into the story):

      Profile:
      - Name: ${typedProfile.name || typedProfile.login}
      - Bio: ${typedProfile.bio || 'No bio provided'}
      - Public Repos: ${typedProfile.public_repos}
      - Followers: ${typedProfile.followers}
      - Following: ${typedProfile.following}
      - Account created: ${new Date(typedProfile.created_at).toLocaleDateString()}
      
      Stats:
      - Total Stars: ${stats.totalStars}
      - Total Forks: ${stats.totalForks}
      - Top Languages: ${topLanguages.join(', ')}
      - Most Starred Repo: ${stats.mostStarredRepo.name} (${stats.mostStarredRepo.stargazers_count} stars)
      - First Repo: ${stats.oldestRepo.name} (${new Date(stats.oldestRepo.created_at).toLocaleDateString()})
      - Latest Repo: ${stats.newestRepo.name} (${new Date(stats.newestRepo.created_at).toLocaleDateString()})

      Guidelines for the narrative:
      1. Start with an engaging hook about their coding journey
      2. Weave in observations about their evolution as a developer
      3. Make educated guesses about their personality and working style based on their repos and activity
      4. Include some playful observations about their language preferences and coding patterns
      5. Suggest potential future directions or hidden talents you spot..
      6. End with an encouraging and friendly note
      7. Keep the tone casual and fun, like a friend telling a story
      8. Feel free to make reasonable assumptions about their coding journey and interests
      9. (IMPORTANT) Include some light-hearted jokes or observations where appropriate. (must after every two lines).
      10. Write in paragraphs, not bullet points or markdown
      11. Dont just keep making the person greatest of all time but also pinpoint what he is missing (if needed) and how he
      can improve, and just be a casual funny mentor.
      12. (IMPORTANT) Keep the language easy to read, simple good wording but not too simple to look like some 5 years old wrote.
      13. Try to be unique for each user.

      Dont always start from "So, you won't BELIEVE who I stumbled upon on GitHub", try different ones.  

      Make it feel like a story that's fun to read while being insightful and encouraging.
    `;

    const result = await model.generateContent(prompt);
    const analysis = result.response.text();

    return {
      profile: typedProfile,
      analysis,
      stats
    };
  } catch (error: any) {
    console.error('Error:', error);
    throw createError({
      statusCode: error.status || 500,
      message: error.message || 'An error occurred'
    });
  }
});

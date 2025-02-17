# $Peergit$

> [!TIP]
> Get a Fun, Honest Take on Your GitHub Profile!.

Peergit gives you a fun, engaging impression of your GitHub profile—like a friend casually telling you what they think about your coding journey. Expect insights, laughs, and maybe a little friendly roasting!

> [!NOTE]
> To make a local copy of this project, follow these instructions.

1. Clone the project and run `bun install`.
2. Create a project in Supabase, and run the following SQL query to create `analysis_results` table.

```sql
create table public.analysis_results (
  id uuid not null default extensions.uuid_generate_v4 (),
  github_username text not null,
  created_at timestamp with time zone null default timezone ('utc'::text, now()),
  profile jsonb null,
  stats jsonb null,
  analysis text null,
  constraint analysis_results_pkey primary key (id),
  constraint analysis_results_github_username_key unique (github_username)
) TABLESPACE pg_default;
```

3. Get your Gemini API from [Google AI Studio](https://aistudio.google.com/apikey).
4. Generate a [GitHub Personal Access Token (Classic)](https://github.com/settings/tokens) with `public_repo`, `read:user`, `repo:status` scope.
5. Configure Environment Variables needed like Supabase credentials, Gemini API and GitHub token — check `.env.example`.
6. Run `bun run dev`.

You have $Peergit$ at home now. This project can be deployed to various platforms like Vercel or Netlify. 🤍

> [!WARNING]
> This project is intended for educational and personal use only. Please do not use it to create a copycat service. If you'd like to contribute or extend it, feel free to fork the repository and give proper credit.

-- Repos table
create table if not exists repos (
  id uuid primary key default uuid_generate_v4(),
  repo_url text not null,
  public_id text unique not null,
  repo_name text,
  owner text,
  story text,
  commit_history jsonb,
  code_summary text,
  main_language text,
  created_at timestamp default now()
);

-- Personal Story Points
create table if not exists personal_story_points (
  id uuid primary key default uuid_generate_v4(),
  repo_id uuid references repos(id),
  user_id uuid references auth.users(id),
  content text,
  created_at timestamp default now()
);

-- Story Points table for user-added story points
create table if not exists story_points (
  id uuid primary key default gen_random_uuid(),
  repo_url text not null,
  commit_hash text,
  story_point text not null,
  user_id uuid not null references auth.users(id),
  created_at timestamp default now()
);

-- Tracked Repos table for user repo tracking
create table if not exists tracked_repos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  repo_url text not null,
  created_at timestamp default now(),
  unique(user_id, repo_url)
);

-- Add indexes for better performance
create index if not exists idx_story_points_repo_url on story_points(repo_url);
create index if not exists idx_story_points_user_id on story_points(user_id);
create index if not exists idx_tracked_repos_user_id on tracked_repos(user_id);
create index if not exists idx_tracked_repos_repo_url on tracked_repos(repo_url); 
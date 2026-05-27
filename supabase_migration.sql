-- ============================================================
-- Portfolio CMS — Supabase SQL Migration
-- Paste this entire file into: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- 1. PROFILE TABLE (about section + robot speech)
create table if not exists profile (
  id bigint primary key generated always as identity,
  name text not null default 'Kuldeep Kumar',
  title text not null default 'AI/ML Engineer',
  tagline text not null default 'Building intelligent systems that learn, reason, and create.',
  bio text not null default '',
  location text not null default 'India',
  email text not null default 'kuldeep@example.com',
  available_for_work boolean not null default true,
  years_of_experience int not null default 4,
  projects_completed int not null default 30,
  models_deployed int not null default 12,
  robot_lines jsonb not null default '[]'::jsonb,
  stats jsonb not null default '[]'::jsonb,
  contact_text text not null default '"I''ll make sure Kuldeep reads your message first."',
  updated_at timestamptz not null default now()
);

-- 2. BRAIN NODES TABLE
create table if not exists brain_nodes (
  id bigint primary key generated always as identity,
  label text not null,
  icon text not null default 'Brain',
  x float not null default 50,
  y float not null default 50,
  cx float not null default 50,
  cy float not null default 50,
  dur float not null default 3.0,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 3. PROJECTS TABLE
create table if not exists projects (
  id text primary key,
  title text not null,
  description text not null default '',
  long_description text not null default '',
  tags jsonb not null default '[]'::jsonb,
  category text not null,
  status text not null,
  bento_texts jsonb not null default '[]'::jsonb,
  github_url text,
  demo_url text,
  video_url text,
  paper_url text,
  featured boolean not null default false,
  year int not null default 2024,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 4. SKILLS TABLE
create table if not exists skills (
  id bigint primary key generated always as identity,
  category text not null,
  icon text not null default 'Code',
  items jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 5. ONGOING PROJECTS TABLE
create table if not exists ongoing_projects (
  id text primary key,
  title text not null,
  icon text not null default 'Network',
  status text not null default 'in_progress',
  highlights jsonb not null default '[]'::jsonb,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- 6. SOCIAL LINKS TABLE
create table if not exists social_links (
  id bigint primary key generated always as identity,
  platform text not null,
  url text not null,
  handle text not null,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

-- Allow public read access (your portfolio is public)
alter table profile enable row level security;
alter table brain_nodes enable row level security;
alter table projects enable row level security;
alter table skills enable row level security;
alter table ongoing_projects enable row level security;
alter table social_links enable row level security;

create policy "Public can read profile" on profile for select using (true);
create policy "Public can read brain_nodes" on brain_nodes for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read skills" on skills for select using (true);
create policy "Public can read ongoing_projects" on ongoing_projects for select using (true);
create policy "Public can read social_links" on social_links for select using (true);

-- Allow full write access from the anon key (admin dashboard uses it)
-- In production you'd lock this down with a service role key, but for a personal
-- portfolio this is the simplest approach.
create policy "Anon can write profile" on profile for all using (true);
create policy "Anon can write brain_nodes" on brain_nodes for all using (true);
create policy "Anon can write projects" on projects for all using (true);
create policy "Anon can write skills" on skills for all using (true);
create policy "Anon can write ongoing_projects" on ongoing_projects for all using (true);
create policy "Anon can write social_links" on social_links for all using (true);

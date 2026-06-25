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

-- 7. MESSAGES TABLE (Contact Form)
create table if not exists messages (
  id bigint primary key generated always as identity,
  name text not null,
  email text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW-LEVEL SECURITY
-- Model: content tables are publicly READABLE; only an authenticated
-- admin can write. messages can be INSERTED by anyone (contact form)
-- but only read/modified by an authenticated admin.
-- ============================================================

-- Enable RLS on every table.
alter table profile           enable row level security;
alter table brain_nodes       enable row level security;
alter table projects          enable row level security;
alter table skills            enable row level security;
alter table ongoing_projects  enable row level security;
alter table social_links      enable row level security;
alter table messages          enable row level security;

-- Self-healing: drop ALL existing policies on these tables first, so
-- re-running this migration removes any stray/over-permissive policies
-- (e.g. accidental "anon can write") and rebuilds the correct set.
do $$
declare r record;
begin
  for r in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profile','brain_nodes','projects','skills',
        'ongoing_projects','social_links','messages'
      )
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- Content tables: public read, authenticated (admin) write.
do $$
declare t text;
begin
  foreach t in array array[
    'profile','brain_nodes','projects','skills','ongoing_projects','social_links'
  ]
  loop
    execute format('create policy "read_%1$s"   on public.%1$I for select using (true);', t);
    execute format('create policy "insert_%1$s" on public.%1$I for insert to authenticated with check (true);', t);
    execute format('create policy "update_%1$s" on public.%1$I for update to authenticated using (true) with check (true);', t);
    execute format('create policy "delete_%1$s" on public.%1$I for delete to authenticated using (true);', t);
  end loop;
end $$;

-- messages: anyone can submit the contact form; only admin can read/manage.
create policy "insert_messages" on public.messages for insert with check (true);
create policy "read_messages"   on public.messages for select to authenticated using (true);
create policy "update_messages" on public.messages for update to authenticated using (true) with check (true);
create policy "delete_messages" on public.messages for delete to authenticated using (true);
